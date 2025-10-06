import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Star, Rocket } from "lucide-react";
import { GlobalLoader } from "../../index.js"; // your global loader

const AstronomyAdventure = () => {
    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

    useEffect(() => {
        axios
            .get("https://opentdb.com/api.php?amount=10&category=17&type=multiple") // Science & Nature
            .then((res) => {
                if (res.data && res.data.results) {
                    const astroData = res.data.results.map((q) => ({
                        question: q.question,
                        options: shuffleArray([...q.incorrect_answers, q.correct_answer]),
                        answer: q.correct_answer,
                    }));
                    setQuestions(astroData);
                } else {
                    setError("No astronomy data found.");
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load astronomy data.");
                setLoading(false);
            });
    }, []);

    const handleAnswer = (option) => {
        if (!questions[current]) return;
        if (option === questions[current].answer) {
            setScore(score + 1);
            setFeedback("✅ Correct! You’re reaching for the stars!");
        } else {
            setFeedback("❌ Not quite. Keep exploring the universe!");
        }

        setTimeout(() => {
            setFeedback("");
            const next = current + 1;
            if (next < questions.length) setCurrent(next);
            else setFeedback("🌠 Mission Complete! Great job!");
        }, 1000);
    };

    if (loading) return <GlobalLoader />;
    if (error) return <p className="text-red-400 text-center mt-20">{error}</p>;

    const q = questions[current];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#050816] to-[#110828] text-white p-4 relative overflow-hidden">
            {/* Animated Starfield */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] pointer-events-none" />
            <div className="absolute inset-0 animate-[pulse_6s_ease-in-out_infinite] bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.05),transparent_70%)] pointer-events-none" />

            <h2 className="text-3xl md:text-4xl font-bold text-[#e7d0ff] mb-2 text-center">
                Astronomy Adventure 🌌
            </h2>
            <p className="text-sm md:text-base text-[#bfc0e8] mb-6 text-center max-w-2xl">
                Learn about planets, stars, and galaxies in an interactive way!
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
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-2xl bg-[#1e1630] rounded-2xl p-6 shadow-xl text-center"
            >
                {/* Astronomy Icon */}
                <motion.div
                    className="flex justify-center mb-4"
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                >
                    {current % 4 === 0 && <Rocket className="w-10 h-10 text-pink-400" />}
                    {current % 4 === 1 && <Moon className="w-10 h-10 text-blue-400" />}
                    {current % 4 === 2 && <Star className="w-10 h-10 text-yellow-400" />}
                    {current % 4 === 3 && <Sun className="w-10 h-10 text-orange-400" />}
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

            {/* Starshine Overlay */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute w-2 h-2 bg-white rounded-full opacity-80"
                    animate={{
                        x: ["0%", "100%"],
                        y: ["0%", "100%"],
                        opacity: [0.5, 1, 0.3],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 10,
                        ease: "easeInOut",
                    }}
                />
            </div>
        </div>
    );
};

export default AstronomyAdventure;
