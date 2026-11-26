// Adapted from Vengeance UI "FAQ Accordion" (MIT, © Ashutoshx7): https://www.vengenceui.com/components/faq-accordion
// Changes: no built-in title, light theme only, first item open by default.
import React, { useState } from "react";
import { cn } from "@/lib/utils";

export interface FaqItem {
  question: string;
  answer: React.ReactNode;
}

export function FaqAccordion({ items, className }: { items: FaqItem[]; className?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  return (
    <div className={cn("relative w-full", className)}>
      <ul className="m-0 flex w-full list-none flex-col p-0">
        {items.map((item, index) => {
          const isActive = activeIndex === index;
          return (
            <li
              key={item.question}
              className={cn(
                "relative w-full border-b-2 border-[var(--rv-line)] transition-all duration-300 ease-in last:border-b-0",
                isActive && "border-b border-[var(--rv-line)]"
              )}
            >
              <button
                type="button"
                className={cn(
                  "relative flex min-h-[60px] w-full cursor-pointer flex-row items-center justify-start text-left text-base outline-none md:text-lg",
                  "transition-colors duration-200",
                  isActive
                    ? "border-l-neutral-900 bg-[var(--rv-soft)] font-semibold text-[var(--rv-text)]"
                    : "border-l-neutral-300 bg-transparent text-[var(--rv-body-2)] hover:border-l-neutral-500 hover:bg-[var(--rv-surface)] hover:text-[var(--rv-text)]"
                )}
                onClick={() => setActiveIndex(isActive ? null : index)}
                aria-expanded={isActive}
                // Inline so Bootstrap's unlayered button reset cannot override Tailwind's layered utilities.
                style={{
                  margin: 0,
                  padding: "1rem 3rem 1rem 3.5rem",
                  border: "none",
                  borderLeft: `6px solid ${isActive ? "var(--rv-text)" : "var(--rv-line)"}`,
                  borderRadius: 0,
                  background: isActive ? "var(--rv-soft)" : "transparent",
                }}
              >
                <span
                  className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 leading-none transition-all duration-200 md:left-5",
                    isActive ? "text-[32px] text-[var(--rv-text)] md:text-[40px]" : "text-[24px] text-[var(--rv-muted)] md:text-[30px]"
                  )}
                  aria-hidden="true"
                >
                  {isActive ? "-" : "+"}
                </span>
                <span className="pr-8">{item.question}</span>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute right-6 block h-2 w-2 border-r-[3px] border-t-[3px] transition-transform duration-200 ease-in-out",
                    isActive ? "rotate-[-44deg] border-[var(--rv-text)]" : "rotate-[133deg] border-[var(--rv-muted)]"
                  )}
                />
              </button>

              <div
                className={cn(
                  "grid w-full transition-all duration-300 ease-in-out",
                  isActive ? "grid-rows-[1fr] bg-[var(--rv-soft)]" : "grid-rows-[0fr] bg-transparent"
                )}
                style={{ borderLeft: `6px solid ${isActive ? "var(--rv-text)" : "var(--rv-line)"}` }}
              >
                <div className="overflow-hidden">
                  <div className="flex w-full flex-row items-start justify-start text-base font-normal leading-relaxed text-[var(--rv-body)] md:text-[17px]" style={{ padding: "0.5rem 1.5rem 1.5rem 3.5rem" }}>
                    <span>{item.answer}</span>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default FaqAccordion;
