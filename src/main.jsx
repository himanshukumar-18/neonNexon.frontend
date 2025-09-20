import React from "react";
import "./index.css";
import "./App.css";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./app/store.js";
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

import App from "./App";
import { Home, Dashboard, Quiz, Game, Awareness, Login, Register } from "./index.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} /> 
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="game" element={<Game />} />
      <Route path="quiz" element={<Quiz />} />
      <Route path="awareness" element={<Awareness />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
