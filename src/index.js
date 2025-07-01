import React from "react";
import ReactDOM from "react-dom/client";
import '@mantine/core/styles.css'
import "./index.css";
import reportWebVitals from "./reportWebVitals";
// import Home from "./components/HomePage/HomePage";

import { MantineProvider } from "@mantine/core";
import { DoubleNavbar } from "./components/Navbar/DoubleNavbar";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <DoubleNavbar />
    </MantineProvider>
  </React.StrictMode>
);

reportWebVitals();
