import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

const app = <StrictMode><BrowserRouter><App /></BrowserRouter></StrictMode>;
const root = document.getElementById("root");
// Prerendered pages are hydrated; the dev server renders fresh.
root.hasChildNodes() ? hydrateRoot(root, app) : createRoot(root).render(app);
