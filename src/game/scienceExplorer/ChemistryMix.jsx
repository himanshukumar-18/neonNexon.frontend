import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const reactions = {
    "Hydrogen+Oxygen": {
        result: "Water (H₂O)",
        color: "#00ffff",
        message: "💧 You made Water! Essential for life!",
    },
    "Sodium+Chlorine": {
        result: "Salt (NaCl)",
        color: "#f5f5f5",
        message: "🧂 You made Salt! The chemistry of taste!",
    },
    "Vinegar+Baking Soda": {
        result: "Carbon Dioxide",
        color: "#ff00ff",
        message: "💨 Fizz! You created CO₂ gas!",
    },
};

const chemicals = ["Hydrogen", "Oxygen", "Sodium", "Chlorine", "Vinegar", "Baking Soda"];

const ChemistryMix = () => {
    const [selected, setSelected] = useState([]);
    const [reaction, setReaction] = useState(null);
    const [score, setScore] = useState(0);

    const mixChemicals = () => {
        if (selected.length < 2) return;
        const comboKey = `${selected[0]}+${selected[1]}`;
        const reverseKey = `${selected[1]}+${selected[0]}`;
        const found = reactions[comboKey] || reactions[reverseKey];

        if (found) {
            setReaction(found);
            setScore(score + 1);
        } else {
            setReaction({
                result: "💥 Boom!",
                color: "#ff0055",
                message: "That didn’t work... try a safer mix!",
            });
        }
        setSelected([]);
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f1530] to-[#1a1330] text-[#e7d0ff] p-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-2 text-center">Chemistry Mix 🧪</h2>
            <p className="text-sm md:text-base text-[#bfc0e8] mb-8 text-center max-w-2xl">
                Combine chemicals safely in fun experiments and discover reactions!
            </p>

            {/* Scoreboard */}
            <div className="mb-6 bg-[#1e1630] px-6 py-3 rounded-2xl shadow-lg text-lg md:text-xl font-semibold flex gap-6">
                <span>Score: {score}</span>
                <span>Selected: {selected.join(" + ") || "None"}</span>
            </div>

            {/* Chemical Options */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                {chemicals.map((chem) => (
                    <motion.button
                        key={chem}
                        whileTap={{ scale: 0.9 }}
                        className={`px-5 py-3 rounded-xl bg-[#2b1f40] hover:bg-[#3a2a5a] transition-all ${selected.includes(chem) ? "ring-2 ring-[#ff00ff]" : ""
                            }`}
                        onClick={() =>
                            setSelected((prev) =>
                                prev.includes(chem) ? prev.filter((c) => c !== chem) : [...prev, chem].slice(-2)
                            )
                        }
                    >
                        {chem}
                    </motion.button>
                ))}
            </div>

            {/* Mix Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={mixChemicals}
                className="bg-gradient-to-r from-[#6f42c1] to-[#00ffff] text-white font-semibold py-3 px-8 rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
                Mix Chemicals
            </motion.button>

            {/* Reaction Display */}
            <AnimatePresence>
                {reaction && (
                    <motion.div
                        key={reaction.result}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            backgroundColor: reaction.color,
                            boxShadow: `0 0 20px ${reaction.color}`,
                        }}
                        className="mt-10 text-center text-black font-bold py-6 px-10 rounded-2xl"
                    >
                        <p className="text-2xl">{reaction.result}</p>
                        <p className="text-md mt-2">{reaction.message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ChemistryMix;
