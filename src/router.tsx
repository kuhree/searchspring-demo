import { createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./pages/error";

import { AppRoot } from "./pages/root";
import { SearchPage, loader as searchLoader } from "./pages/search";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <AppRoot />,
      errorElement: <ErrorPage />,
      children: [
        {
          errorElement: <ErrorPage />,
          children: [
            {
              index: true,
              element: <SearchPage />,
              loader: searchLoader,
            },
          ],
        },
      ],
    },
  ],
  { basename: "/searchspring-demo" }
);
