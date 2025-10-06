import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Dna, Microscope, Leaf, Brain } from "lucide-react";
import { GlobalLoader } from "../../index.js"; // your existing loader

const BiologyQuest = () => {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Shuffle helper
    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    useEffect(() => {
        axios
            .get("https://opentdb.com/api.php?amount=10&category=17&type=multiple") // using Science category
            .then((res) => {
                if (res.data && res.data.results) {
                    const bioQuestions = res.data.results.map((q) => ({
                        question: q.question,
                        options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
                        answer: q.correct_answer,
                    }));
                    setQuestions(bioQuestions);
                } else {
                    setError("No biology questions found.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load biology data.");
                setLoading(false);
            });
    }, []);

    const handleAnswer = (option) => {
        if (!questions[current]) return;
        if (option === questions[current].answer) {
            setScore(score + 1);
            setFeedback("✅ Correct! Great job exploring biology!");
        } else {
            setFeedback("❌ Wrong! Keep studying life’s wonders!");
        }

        setTimeout(() => {
            setFeedback("");
            const next = current + 1;
            if (next < questions.length) setCurrent(next);
            else setFeedback("🎉 Quiz Complete!");
        }, 1000);
    };

    if (loading) return <GlobalLoader />;
    if (error) return <p className="text-red-400 text-center mt-20">{error}</p>;

    const q = questions[current];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0f1530] to-[#1a1330] text-white p-4">
            <h2 className="text-3xl md:text-4xl font-bold text-[#e7d0ff] mb-2 text-center">
                Biology Quest 🧬
            </h2>
            <p className="text-sm md:text-base text-[#bfc0e8] mb-6 text-center max-w-2xl">
                Explore cells, DNA, and living organisms through mini-games!
            </p>

            {/* Scoreboard */}
            <div className="w-full max-w-2xl mb-6 flex justify-between items-center bg-[#1e1630]/80 p-4 rounded-2xl shadow-lg backdrop-blur-xl">
                <span className="text-[#f0dfff] font-semibold text-lg md:text-xl">
                    Score: {score}
                </span>
                <span className="text-[#f0dfff] font-semibold text-lg md:text-xl">
                    Question: {current + 1}/{questions.length}
                </span>
            </div>

            {/* Question Card */}
            <motion.div
                key={current}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl bg-[#1e1630] rounded-2xl p-6 shadow-lg text-center"
            >
                {/* Biology icon */}
                <motion.div
                    className="flex justify-center mb-4"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 3 }}
                >
                    {current % 4 === 0 && <Microscope className="w-10 h-10 text-pink-400" />}
                    {current % 4 === 1 && <Dna className="w-10 h-10 text-purple-400" />}
                    {current % 4 === 2 && <Leaf className="w-10 h-10 text-green-400" />}
                    {current % 4 === 3 && <Brain className="w-10 h-10 text-blue-400" />}
                </motion.div>

                <h3
                    className="text-lg md:text-xl font-semibold mb-4 text-[#f0dfff]"
                    dangerouslySetInnerHTML={{ __html: q.question }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options.map((opt, idx) => (
                        <motion.button
                            key={idx}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleAnswer(opt)}
                            className="bg-[#2b1f40] text-[#e7d0ff] py-3 px-4 rounded-xl hover:bg-[#3a2a5a] transition-all duration-200"
                            dangerouslySetInnerHTML={{ __html: opt }}
                        />
                    ))}
                </div>

                <AnimatePresence>
                    {feedback && (
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mt-4 text-lg md:text-xl font-semibold text-[#f0dfff]"
                        >
                            {feedback}
                        </motion.p>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default BiologyQuest;
