import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Zap, ArrowDown, Scale } from "lucide-react";

const questions = [
    {
        question: "Which falls faster in a vacuum?",
        options: ["Feather", "Metal Ball"],
        correct: "Both fall equally fast",
        fact: "In a vacuum, gravity accelerates all objects equally! 🌌",
    },
    {
        question: "Which side will balance?",
        options: ["Light", "Heavy"],
        correct: "Heavy",
        fact: "Heavier objects produce greater torque if placed farther away.",
    },
    {
        question: "What causes lightning?",
        options: ["Friction", "Electric Charge"],
        correct: "Electric Charge",
        fact: "Lightning forms from static electricity buildup in clouds ⚡",
    },
];

export default function PhysicsPuzzle() {
    const [index, setIndex] = useState(0);
    const [answer, setAnswer] = useState(null);
    const [score, setScore] = useState(0);

    const q = questions[index];

    const handleAnswer = (opt) => {
        setAnswer(opt);
        if (opt === q.correct) setScore(score + 10);
    };

    const next = () => {
        setAnswer(null);
        setIndex((i) => (i + 1) % questions.length);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f1530] to-[#1a1330] text-white p-4">
            <h2 className="text-3xl font-bold text-[#e7d0ff] mb-2">Physics Puzzle ⚛️</h2>
            <p className="text-sm text-[#bfc0e8] mb-4">Test your physics knowledge!</p>

            <motion.div
                className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-lg max-w-md w-full"
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex justify-center mb-3">
                    {index === 0 && <ArrowDown className="w-8 h-8 text-blue-400" />}
                    {index === 1 && <Scale className="w-8 h-8 text-yellow-400" />}
                    {index === 2 && <Zap className="w-8 h-8 text-purple-400" />}
                </div>

                <h3 className="font-semibold mb-3">{q.question}</h3>

                <div className="flex flex-col gap-2">
                    {q.options.map((opt) => (
                        <motion.button
                            key={opt}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(opt)}
                            disabled={answer !== null}
                            className={`px-4 py-2 rounded-xl ${answer === opt
                                    ? opt === q.correct
                                        ? "bg-green-500/30 border border-green-400"
                                        : "bg-red-500/30 border border-red-400"
                                    : "bg-white/10 hover:bg-white/20"
                                }`}
                        >
                            {opt}
                        </motion.button>
                    ))}
                </div>

                <AnimatePresence>
                    {answer && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-3 text-sm text-[#c7bff7]"
                        >
                            {answer === q.correct ? `✅ ${q.fact}` : "❌ Try again!"}
                        </motion.p>
                    )}
                </AnimatePresence>

                <button
                    onClick={next}
                    className="mt-4 bg-[#e7d0ff]/20 border border-[#e7d0ff]/30 text-[#e7d0ff] px-4 py-2 rounded-xl hover:bg-[#e7d0ff]/30 transition"
                >
                    Next
                </button>

                <p className="mt-3 text-[#bfc0e8]">Score: {score}</p>
            </motion.div>
        </div>
    );
}
