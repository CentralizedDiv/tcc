import React from "react";
import ReactDOM from "react-dom/client";

import "moment/locale/pt-br";
import locale from "antd/lib/locale/pt_BR";
import { ConfigProvider } from "antd";
import { Provider } from "react-redux";

import { store } from "./config/store";
import { App } from "./app";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider locale={locale}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);
