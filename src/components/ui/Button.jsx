// src/components/ui/Button.jsx
import React, { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import styles from "@/styles/Button.module.css";

const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      shape = "pill",
      badge,
      icon,
      leftIcon,
      rightIcon,
      showArrow = false,
      arrowIcon,
      fullWidth = false,
      href,
      target,
      rel,
      type = "button",
      disabled = false,
      className = "",
      style,
      ...props
    },
    ref
  ) => {
    // Resolve left and right icons
    const resolvedLeftIcon = leftIcon || icon;
    const resolvedRightIcon = rightIcon;

    // Build class string
    const combinedClasses = [
      styles.btn,
      styles[variant] || styles.primary,
      styles[size] || styles.md,
      styles[shape] || styles.pill,
      fullWidth ? styles.fullWidth : "",
      disabled ? styles.disabled : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    // Standardize external link attributes
    const resolvedRel =
      rel || (target === "_blank" ? "noopener noreferrer" : undefined);

    // Render inner content
    const content = (
      <>
        {resolvedLeftIcon && (
          <span className={styles.iconLeft}>{resolvedLeftIcon}</span>
        )}

        {children && <span className={styles.label}>{children}</span>}

        {badge !== undefined && badge !== null && badge !== "" && (
          <span className={styles.badge}>{badge}</span>
        )}

        {resolvedRightIcon && (
          <span className={styles.iconRight}>{resolvedRightIcon}</span>
        )}

        {showArrow && (
          <span className={styles.arrowIcon}>
            {arrowIcon || <ArrowRight size={size === "sm" ? 14 : size === "lg" ? 18 : 16} />}
          </span>
        )}
      </>
    );

    if (href && !disabled) {
      return (
        <a
          ref={ref}
          href={href}
          target={target}
          rel={resolvedRel}
          className={combinedClasses}
          style={style}
          {...props}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled}
        className={combinedClasses}
        style={style}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
