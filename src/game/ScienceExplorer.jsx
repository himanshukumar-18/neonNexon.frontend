// ScienceExplorer.jsx
import React from "react";
import { Link } from "react-router-dom";

const miniGames = [
    {
        link: "/game/scienceexplorer/physicspuzzle",
        title: "Physics Puzzle ⚛️",
        description: "Solve interactive physics challenges and test your understanding of forces and motion.",
    },
    {
        link: "/game/scienceexplorer/chemistrymix",
        title: "Chemistry Mix 🧪",
        description: "Combine chemicals safely in fun experiments and discover reactions.",
    },
    {
        link: "/game/scienceexplorer/biologyquest",
        title: "Biology Quest 🧬",
        description: "Explore cells, DNA, and living organisms through mini-games.",
    },
    {
        link: "/game/scienceexplorer/astronomyadventure",
        title: "Astronomy Adventure 🌌",
        description: "Learn about planets, stars, and galaxies in an interactive way.",
    },
];

const ScienceExplorer = () => {
    return (
        <div className="w-full min-h-screen flex flex-col pt-50  items-center p-4 pb-20 bg-gradient-to-br from-[#0f1530] to-[#1a1330]">
            <h2 className="text-4xl md:text-5xl font-bold text-[#e7d0ff] mb-4 text-center">
                Science Explorer 🔬
            </h2>
            <p className="text-sm md:text-base text-[#bfc0e8] mb-8 text-center max-w-2xl">
                Explore fun science facts with interactive mini-games.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                {miniGames.map((game, index) => (
                    <Link to={game.link} key={index}>
                        <div
                            key={index}
                            className="bg-[#1e1630] rounded-2xl p-6 h-[200px] flex flex-col items-start hover:scale-105 transform transition-all duration-300 shadow-lg"
                        >
                            <h3 className="text-xl md:text-2xl font-semibold text-[#f0dfff] mb-2">
                                {game.title}
                            </h3>
                            <p className="text-sm md:text-base text-[#cfcfe8]">{game.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ScienceExplorer;
