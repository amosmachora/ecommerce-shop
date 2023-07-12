import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom";

import App from "./App";
import { Checkout } from "./components";
import Cart from "./components/Cart/Cart";

ReactDOM.render(
  <App />,

  document.getElementById("root")
);
