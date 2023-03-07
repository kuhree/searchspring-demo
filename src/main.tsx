import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import React from "react";

import { router } from "./router";
import "./styles/index.css";

const rootNode = document.getElementById("app");
const root = ReactDOM.createRoot(rootNode as HTMLElement);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
