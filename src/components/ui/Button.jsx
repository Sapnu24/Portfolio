// src/components/Button.jsx
import React from "react";
import styles from "../../styles/Button.module.css";

const Button = ({ variant = "primary", size = "md", href, children }) => {
  if (href) {
    return (
      <a
        href={href}
        className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
      >
        {children}
      </a>
    );
  }

  return (
    <button className={`${styles.btn} ${styles[variant]} ${styles[size]}`}>
      {children}
    </button>
  );
};

export default Button;
