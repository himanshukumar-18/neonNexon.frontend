import React, { useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Star, Check, X } from "lucide-react";

const COLORS = {
    bgFrom: "#0f1530",
    bgTo: "#1a1330",
    accent: "#e7d0ff",
    sub: "#bfc0e8",
    highlight: "#ff79c6",
    success: "#50fa7b",
    fail: "#ff5555",
};

const SHAPES = [
    { name: "Square", blocks: [[0, 0], [0, 1], [1, 0], [1, 1]] },
    { name: "Triangle", blocks: [[0, 1], [1, 0], [1, 2]] },
    { name: "Line", blocks: [[0, 0], [0, 1], [0, 2]] },
    { name: "L-Shape", blocks: [[0, 0], [1, 0], [1, 1]] },
];

export default function ShapeBuilderPage() {
    const [currentShape, setCurrentShape] = useState(SHAPES[0]);
    const [placed, setPlaced] = useState([]);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState(null); // 'correct' | 'wrong'

    const reset = () => {
        setPlaced([]);
        setFeedback(null);
        const nextShape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        setCurrentShape(nextShape);
    };

    const handleDrop = (block) => {
        const exists = placed.some(b => b[0] === block[0] && b[1] === block[1]);
        if (!exists) setPlaced([...placed, block]);
    };

    const checkCompletion = () => {
        if (placed.length !== currentShape.blocks.length) return false;
        return currentShape.blocks.every(cb => placed.some(pb => pb[0] === cb[0] && pb[1] === cb[1]));
    };

    const handleCheck = () => {
        if (checkCompletion()) {
            setFeedback('correct');
            setScore(score + 1);
        } else {
            setFeedback('wrong');
            setScore(score > 0 ? score - 1 : 0);
        }
    };

    const completed = checkCompletion();

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${COLORS.bgFrom}, ${COLORS.bgTo})` }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-4xl mx-auto flex flex-col gap-6"
            >
                <div className="bg-opacity-30 backdrop-blur-sm p-5 rounded-3xl shadow-xl border border-white/10 flex flex-col gap-4 animate-fadeIn">
                    <h1 className="text-4xl font-extrabold tracking-wide" style={{ color: COLORS.accent }}>Shape Builder 🔷</h1>
                    <p className="text-sm md:text-base" style={{ color: COLORS.sub }}>Drag or click blocks to recreate the geometric shape. Complete shapes to earn points!</p>
                    <div className="flex gap-4 mt-3 items-center">
                        <button onClick={reset} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/20 text-sm font-medium hover:scale-110 transition-transform bg-gradient-to-r from-[#7f5af0]/20 to-[#ff6fd8]/20 backdrop-blur-md" style={{ color: COLORS.accent }}>
                            <RefreshCw size={18} /> Reset
                        </button>
                        <button onClick={handleCheck} className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl border border-white/20 text-sm font-medium hover:scale-110 transition-transform bg-gradient-to-r from-[#50fa7b]/20 to-[#ffb86c]/20 backdrop-blur-md" style={{ color: COLORS.accent }}>
                            Check
                        </button>
                        {feedback === 'correct' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-lg font-bold" style={{ color: COLORS.success }}>
                            <Check size={20} className="animate-bounce" /> Correct!
                        </motion.div>}
                        {feedback === 'wrong' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-2 text-lg font-bold" style={{ color: COLORS.fail }}>
                            <X size={20} className="animate-bounce" /> Try Again!
                        </motion.div>}
                        <div className="ml-auto text-lg font-semibold" style={{ color: COLORS.accent }}>Score: {score}</div>
                    </div>
                </div>

                <div className="bg-opacity-20 backdrop-blur-lg p-6 rounded-3xl shadow-inner border border-white/10 flex flex-col items-center animate-fadeIn">
                    <div className="grid grid-cols-3 gap-3">
                        {[0, 1, 2].map(r => (
                            [0, 1, 2].map(c => {
                                const isPlaced = placed.some(b => b[0] === r && b[1] === c);
                                const shouldBePlaced = currentShape.blocks.some(b => b[0] === r && b[1] === c);
                                const bgColor = completed && shouldBePlaced ? COLORS.success : isPlaced ? `linear-gradient(135deg, ${COLORS.highlight}, ${COLORS.accent})` : 'rgba(255,255,255,0.05)';
                                return (
                                    <motion.div
                                        key={`${r}-${c}`}
                                        className={`w-24 h-24 flex items-center justify-center border-2 rounded-xl cursor-pointer shadow-md hover:scale-110 transition-transform`}
                                        style={{
                                            background: bgColor,
                                            borderColor: isPlaced ? COLORS.accent : 'rgba(255,255,255,0.1)',
                                            color: isPlaced ? '#fff' : COLORS.sub
                                        }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => handleDrop([r, c])}
                                    >
                                        {isPlaced && <span className="text-2xl font-bold">■</span>}
                                    </motion.div>
                                );
                            })
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}