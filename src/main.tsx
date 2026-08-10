import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "../styles/globals.css";

// Font Awesome global CSS
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
