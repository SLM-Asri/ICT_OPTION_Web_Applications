import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import site from "./content/site.json";
import { RouteCtx } from "./lib.jsx";
import Layout from "./components/Layout.jsx";
import { notFound, routes } from "./routes.jsx";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/site.css";
import "./styles/imported.css";
import "./styles/motion.css";

function Page({ r }) {
  useEffect(() => { // keep title and description right on client-side navigation
    document.title = r.title;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement("meta"); m.name = "description"; document.head.appendChild(m); }
    m.content = r.desc;
  }, [r]);
  if (r.bare) return r.el;
  return <RouteCtx.Provider value={{ crumbs: r.crumbs || null }}><Layout route={r}>{r.el}</Layout></RouteCtx.Provider>;
}
export default function App() {
  return (
    <Routes>
      {[...routes, notFound].map((r) => <Route key={r.path} path={r.path} element={<Page r={r} />} />)}
    </Routes>
  );
}
export { site };
