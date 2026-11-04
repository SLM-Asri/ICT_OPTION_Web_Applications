import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "./App.jsx";
import { notFound, routes } from "./routes.jsx";
import site from "./content/site.json";

export const meta = { routes, notFound, site };
export const render = (url) => renderToString(<StaticRouter location={url}><App /></StaticRouter>);
