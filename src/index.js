import React from "react";
import ReactDOM from "react-dom/client";
import '@mantine/core/styles.css';
import "./index.css";
import reportWebVitals from "./reportWebVitals";

import { MantineProvider } from "@mantine/core";
import { BrowserRouter } from 'react-router-dom';


import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
