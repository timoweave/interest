import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";
import { SetupWorker } from "msw";

const loadMockServiceWorker = (mockBrowserPath: string): void => {
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  import(
    /* @vite-ignore */
    mockBrowserPath
  ).then((mockBrowser) => {
    const worker = mockBrowser.worker as SetupWorker;
    worker.start();
  });
};

loadMockServiceWorker("./mocks/browser.ts");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
