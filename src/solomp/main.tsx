// @jsxImportSource @remix-run/component
import { createRoot } from "@remix-run/component";
import { App } from "./_lib/App.tsx";

const rootElement = document.getElementById("app");
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
