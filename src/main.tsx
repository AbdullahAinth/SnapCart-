import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // keep if you have global styles

// Mount React app
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
