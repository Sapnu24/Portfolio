import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, X, Check, ChevronDown, Sparkles } from "lucide-react";
import { getAllTechOptions, getTechIcon, TECH_REGISTRY } from "@/utils/techIcons";
import styles from "@/styles/TechIconPicker.module.css";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "mobile", label: "Mobile" },
  { id: "database", label: "Database" },
  { id: "devops", label: "DevOps / Cloud" },
  { id: "tools", label: "Tools" },
  { id: "design", label: "Design" },
];

export default function TechIconPicker({
  value = "react",
  onChange,
  suggestedKey = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const allOptions = useMemo(() => getAllTechOptions(), []);

  // Filter options based on category and search query
  const filteredOptions = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allOptions.filter((opt) => {
      const matchCategory =
        selectedCategory === "all" || opt.category === selectedCategory;
      if (!matchCategory) return false;

      if (!q) return true;
      return (
        opt.name.toLowerCase().includes(q) ||
        opt.key.toLowerCase().includes(q) ||
        (opt.category && opt.category.toLowerCase().includes(q))
      );
    });
  }, [allOptions, searchQuery, selectedCategory]);

  const currentSelection = useMemo(() => {
    if (!value) return null;
    const entry = TECH_REGISTRY[value.toLowerCase()];
    if (entry) {
      return {
        key: value.toLowerCase(),
        name: entry.name,
        category: entry.category,
        color: entry.color,
      };
    }
    const match = allOptions.find(
      (opt) => opt.key === value || opt.name.toLowerCase() === value.toLowerCase()
    );
    if (match) return match;
    return {
      key: value,
      name: value,
      category: "custom",
      color: "#004643",
    };
  }, [value, allOptions]);

  // Handle outside clicks to close the dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Focus search input when popover opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (key) => {
    if (onChange) {
      onChange(key);
    }
    setIsOpen(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSelectedCategory("all");
  };

  const showSuggestion =
    suggestedKey &&
    suggestedKey !== "default" &&
    suggestedKey.toLowerCase() !== (value || "").toLowerCase() &&
    TECH_REGISTRY[suggestedKey.toLowerCase()];

  return (
    <div className={styles.comboboxWrapper} ref={wrapperRef}>
      {/* Combobox Trigger Button */}
      <button
        type="button"
        className={`${styles.comboboxTrigger} ${
          isOpen ? styles.comboboxTriggerActive : ""
        }`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className={styles.triggerContent}>
          <div
            className={styles.triggerIcon}
            style={{ color: currentSelection?.color || "var(--primary-color, #004643)" }}
          >
            {getTechIcon(currentSelection?.key || value, 18)}
          </div>
          <span className={styles.triggerLabel}>
            {currentSelection?.name || value}
          </span>
          {currentSelection?.category && (
            <span className={styles.triggerCategory}>
              ({currentSelection.category})
            </span>
          )}
        </div>
        <ChevronDown
          size={16}
          className={`${styles.triggerChevron} ${
            isOpen ? styles.triggerChevronOpen : ""
          }`}
        />
      </button>

      {/* Floating Searchable Popover */}
      {isOpen && (
        <div className={styles.popover}>
          {/* Search Input Bar */}
          <div className={styles.searchContainer}>
            <Search size={14} className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Search icons (e.g. Flutter, React, Postgres)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                className={styles.clearSearchBtn}
                onClick={() => setSearchQuery("")}
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className={styles.categoryBar}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`${styles.categoryPill} ${
                  selectedCategory === cat.id ? styles.categoryPillActive : ""
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Meta Row: Count & Suggested Match */}
          <div className={styles.metaRow}>
            <span>
              {filteredOptions.length} icon{filteredOptions.length === 1 ? "" : "s"} found
            </span>
            {showSuggestion && (
              <button
                type="button"
                className={styles.suggestBadge}
                onClick={() => handleSelect(suggestedKey)}
                title={`Apply detected icon: ${TECH_REGISTRY[suggestedKey]?.name || suggestedKey}`}
              >
                <Sparkles size={11} />
                <span>Match: {TECH_REGISTRY[suggestedKey]?.name || suggestedKey}</span>
              </button>
            )}
          </div>

          {/* Scrollable Icon Grid */}
          <div className={styles.iconGrid} role="listbox">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected =
                  value && value.toLowerCase() === opt.key.toLowerCase();
                const IconComp = opt.icon;

                return (
                  <button
                    key={opt.key}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    className={`${styles.iconCard} ${
                      isSelected ? styles.iconCardActive : ""
                    }`}
                    onClick={() => handleSelect(opt.key)}
                    title={`${opt.name} (${opt.category})`}
                  >
                    {isSelected && (
                      <div className={styles.checkIndicator}>
                        <Check size={10} strokeWidth={3} />
                      </div>
                    )}
                    <div
                      className={styles.iconSvgWrapper}
                      style={{ color: opt.color || "inherit" }}
                    >
                      {IconComp ? (
                        <IconComp size={20} />
                      ) : (
                        getTechIcon(opt.key, 20)
                      )}
                    </div>
                    <span className={styles.iconName}>{opt.name}</span>
                    <span className={styles.iconCategoryTag}>{opt.category}</span>
                  </button>
                );
              })
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyStateText}>
                  No icons matching "<strong>{searchQuery}</strong>"
                </p>
                <button
                  type="button"
                  className={styles.resetBtn}
                  onClick={handleClearSearch}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
