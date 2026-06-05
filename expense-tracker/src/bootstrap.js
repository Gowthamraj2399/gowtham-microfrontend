import React from "react";
import { createRoot } from "react-dom/client";
import { createMemoryHistory, createBrowserHistory } from "history";
import App from "./App";
import "./index.css";

// Register service worker (needed for push notifications + offline)
// Skip in development — SW causes issues with webpack HMR and microfrontend dev server
if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/service-worker.js")
      .then((reg) => console.log("[SW] Registered, scope:", reg.scope))
      .catch((err) => console.warn("[SW] Registration failed:", err));
  });
  console.log("[Push] VAPID key present:", !!process.env.VITE_VAPID_PUBLIC_KEY);
}

// Mount function to start up the app
const mount = (el, { onNavigate, defaultHistory, initialPath }) => {
  const history =
    defaultHistory ||
    createMemoryHistory({
      initialEntries: [initialPath],
    });

  if (onNavigate) {
    history.listen((update) => {
      onNavigate({ pathname: update.location.pathname });
    });
  }

  const root = createRoot(el);
  root.render(<App history={history} />);

  return {
    onParentNavigate({ pathname: nextPathname }) {
      const { pathname } = history.location;

      if (pathname !== nextPathname) {
        history.push(nextPathname);
      }
    },
  };
};

// If we are in development and in isolation,
// call mount immediately
if (process.env.NODE_ENV === "development") {
  const devRoot = document.querySelector("#_marketing-dev-root");

  if (devRoot) {
    mount(devRoot, { defaultHistory: createBrowserHistory() });
  }
}

// We are running through container
// and we should export the mount function
export { mount };
