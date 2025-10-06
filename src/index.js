import Home from "./pages/Home";
import Button from "./components/Button";
import FeaturesCard from "./components/FeaturesCard";
import Nav from "./components/navbar/Nav";
import Footer from "./components/footer/Footer";
import Welcome from "./components/Welcome";
import GlobalLoader from "./components/loader/GlobalLoader";
import axios from "./utils/axios/axios.server.js"
import FlashcardGame from "./game/FlashcardGame.jsx";
import PuzzelGame from "./game/PuzzelGame.jsx";
import MathGame from "./game/MathGame.jsx";
import WordBuilder from "./game/WordBuilder.jsx";
import Coding from "./game/Coding.jsx";

//pages
import Dashboard from "./pages/Dashboard";
import Game from "./pages/Game";
import Quiz from "./pages/Quiz";
import Awareness from "./pages/Awareness";
import Register from "./pages/register";
import Login from "./pages/login";
import BackToBtn from "./components/BackToBtn";
import MemoryMatch from "./game/MemoryMatch.jsx";
import ScienceExplorer from "./game/ScienceExplorer.jsx";
import PhysicsPuzzle from "./game/scienceExplorer/PhysicsPuzzle.jsx";
import ChemistryMix from "./game/scienceExplorer/ChemistryMix.jsx";
import BiologyQuest from "./game/scienceExplorer/BiologyQuest.jsx";
import AstronomyAdventure from "./game/scienceExplorer/AstronomyAdventure.jsx";
import WordSearch from "./game/WordSearch.jsx";
import ShapeBuilder from "./game/ShapeBuilder.jsx";

export {
    Home,
    Button,
    FeaturesCard,
    Nav,
    Awareness,
    Dashboard,
    Game,
    Quiz,
    Footer,
    Welcome,
    GlobalLoader,
    Register,
    BackToBtn,
    Login,
    axios,
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
}