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
import {
  Home,
  Dashboard,
  Quiz,
  Game,
  Awareness,
  Login,
  Register,
  FlashcardGame,
  PuzzelGame,
  MathGame,
  WordBuilder,
  Coding,
  MemoryMatch,
  ScienceExplorer,
  PhysicsPuzzle,
  ChemistryMix,
  BiologyQuest,
  AstronomyAdventure,
  WordSearch,
  ShapeBuilder
} from "./index.js";

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
      <Route path="/game/flashcards" element={<FlashcardGame />} />
      <Route path="/game/puzzle" element={<PuzzelGame />} />
      <Route path="/game/math" element={<MathGame />} />
      <Route path="/game/wordbuilder" element={<WordBuilder />} />
      <Route path="/game/coding" element={<Coding />} />
      <Route path="/game/memorymatch" element={<MemoryMatch />} />
      <Route path="/game/scienceexplorer" element={<ScienceExplorer />} />
      <Route path="/game/scienceexplorer/physicspuzzle" element={<PhysicsPuzzle />} />
      <Route path="/game/scienceexplorer/chemistrymix" element={<ChemistryMix />} />
      <Route path="/game/scienceexplorer/biologyquest" element={<BiologyQuest />} />
      <Route path="/game/scienceexplorer/astronomyadventure" element={<AstronomyAdventure />} />
      <Route path="/game/wordsearch" element={<WordSearch />} />
      <Route path="/game/shapebuilder" element={<ShapeBuilder />} />
      <Route path="*" element={<h1 className="text-3xl text-center mt-20">404 - Page Not Found</h1>} />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
