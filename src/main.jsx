// src/main.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./styles/global.css"; // global styles here

import App from "./App.jsx";

const rootElement = document.getElementById("root");

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
