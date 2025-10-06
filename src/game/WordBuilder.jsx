import React, { useEffect, useMemo, useState, useRef } from "react";

// WordBuilder React component
// - Tailwind CSS utility classes assumed
// - Uses same color schema as other pages: gradient background, neon accents
// - Medium difficulty: mix of 6-9 letter science words, hints, timer, shuffle, score

const SCIENCE_WORDS = [
    "ATOMOS",
    "GRAVITY",
    "NEURON",
    "PHOTOS",
    "ELECTRO",
    "MOLECULE",
    "CALCIUM",
    "PLANETS",
    "GENOME",
    "RNA",
    "ENZYME",
    "QUARK",
];

export default function WordBuilder() {
    const [wordIndex, setWordIndex] = useState(0);
    const [targetWord, setTargetWord] = useState(prepareWord(SCIENCE_WORDS[0]));
    const [letters, setLetters] = useState(shuffleArray(targetWord.letters));
    const [placed, setPlaced] = useState([]); // array of letters placed in order
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(90); // 90s per level (medium)
    const [isPlaying, setIsPlaying] = useState(true);
    const [message, setMessage] = useState("");
    const [hintsUsed, setHintsUsed] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        // start timer
        if (isPlaying) {
            timerRef.current = setInterval(() => {
                setTimeLeft((t) => {
                    if (t <= 1) {
                        clearInterval(timerRef.current);
                        setIsPlaying(false);
                        setMessage("Time's up! Try the next word.");
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [isPlaying, wordIndex]);

    useEffect(() => {
        // reset when wordIndex changes
        const w = prepareWord(SCIENCE_WORDS[wordIndex % SCIENCE_WORDS.length]);
        setTargetWord(w);
        setLetters(shuffleArray(w.letters));
        setPlaced([]);
        setTimeLeft(90);
        setIsPlaying(true);
        setMessage("");
        setHintsUsed(0);
    }, [wordIndex]);

    function handlePick(letter, i) {
        // pick a letter from pool
        setLetters((prev) => prev.filter((_, idx) => idx !== i));
        setPlaced((p) => [...p, letter]);
        setMessage("");
    }

    function handleRemove(idx) {
        // remove from placed and return to pool
        setPlaced((p) => {
            const copy = [...p];
            const [removed] = copy.splice(idx, 1);
            setLetters((l) => [...l, removed]);
            return copy;
        });
    }

    function checkAnswer() {
        const attempt = placed.join("");
        if (attempt.toUpperCase() === targetWord.base.toUpperCase()) {
            setMessage("Correct! ⭐");
            setScore((s) => s + Math.max(10, 50 - hintsUsed * 10));
            setTimeout(() => setWordIndex((i) => i + 1), 900);
        } else {
            setMessage("Not quite — keep trying.");
            setScore((s) => Math.max(0, s - 5));
        }
    }

    function useHint() {
        if (hintsUsed >= 2) return;
        const nextPos = placed.length;
        const correctLetter = targetWord.letters[nextPos];
        // remove one instance of correctLetter from pool and place it
        const idx = letters.findIndex((l) => l === correctLetter);
        if (idx >= 0) {
            setLetters((prev) => prev.filter((_, i) => i !== idx));
            setPlaced((p) => [...p, correctLetter]);
        } else {
            // maybe already placed, skip
        }
        setHintsUsed((h) => h + 1);
        setScore((s) => Math.max(0, s - 10));
    }

    function skipWord() {
        setMessage("Skipped.");
        setWordIndex((i) => i + 1);
    }

    function shufflePool() {
        setLetters((prev) => shuffleArray(prev));
    }

    function resetLevel() {
        setLetters(shuffleArray(targetWord.letters));
        setPlaced([]);
        setTimeLeft(90);
        setIsPlaying(true);
        setMessage("");
    }

    return (
        <div className="min-h-screen w-full p-6 pt-50 bg-gradient-to-br from-[#0f1530] to-[#1a1330] flex flex-col items-center text-[#e7d0ff]">
            <div className="w-full max-w-7xl">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Word Builder 🔠</h1>
                        <p className="text-sm text-[#bfc0e8] mt-1">Rearrange letters to form science-related words.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-[#bfc0e8]">Score</div>
                        <div className="text-xl font-bold">{score}</div>
                    </div>
                </header>

                <main className="bg-[#071026]/60 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                    <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <div className="text-sm text-[#bfc0e8]">Level</div>
                            <div className="text-lg font-semibold">{wordIndex + 1}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-[#bfc0e8]">Time</div>
                            <div className="text-lg font-mono font-bold">{formatTime(timeLeft)}</div>
                            <button className="ml-2 px-3 py-1 rounded-xl bg-[#2b2040]/70 hover:bg-[#2b2040] text-sm" onClick={resetLevel}>
                                Reset
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-3 py-1 rounded-xl bg-[#3b2a63]/70 text-sm" onClick={shufflePool}>
                                Shuffle
                            </button>
                            <button className="px-3 py-1 rounded-xl bg-[#2a4a3f]/60 text-sm" onClick={useHint} disabled={hintsUsed >= 2}>
                                Hint ({2 - hintsUsed})
                            </button>
                            <button className="px-3 py-1 rounded-xl bg-[#4a2432]/60 text-sm" onClick={skipWord}>
                                Skip
                            </button>
                        </div>
                    </section>

                    <section className="mb-6">
                        <div className="text-sm text-[#bfc0e8] mb-2">Your Answer</div>
                        <div className="min-h-[56px] flex flex-wrap items-center gap-2 p-3 rounded-xl bg-[#0b1224]/50 border border-[#2b1f3a]">
                            {Array.from({ length: targetWord.letters.length }).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`w-12 h-12 flex items-center justify-center rounded-lg text-lg font-semibold cursor-pointer select-none ${placed[idx] ? "bg-[#e7d0ff]/20 text-[#e7d0ff]" : "bg-[#ffffff12] text-[#bfc0e8]"
                                        }`}
                                    onClick={() => placed[idx] && handleRemove(idx)}
                                >
                                    {placed[idx] || ""}
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="mb-6">
                        <div className="text-sm text-[#bfc0e8] mb-2">Letter Pool</div>
                        <div className="flex flex-wrap gap-3 p-3 rounded-xl bg-[#061224]/40 border border-[#1e1830]">
                            {letters.map((l, i) => (
                                <button
                                    key={i}
                                    onClick={() => handlePick(l, i)}
                                    className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ffffff10] text-lg font-bold hover:scale-105 transform active:scale-95 transition"
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </section>

                    <section className="flex items-center justify-between">
                        <div className="text-sm text-[#bfc0e8]">Hint: {targetWord.hint}</div>
                        <div className="flex items-center gap-3">
                            <button onClick={checkAnswer} className="px-4 py-2 rounded-2xl bg-[#7a4edb] text-white font-semibold">
                                Check
                            </button>
                            <button onClick={() => { setPlaced(targetWord.letters); }} className="px-4 py-2 rounded-2xl bg-[#2b8a7e] text-white font-semibold">
                                Auto-fill (cheat)
                            </button>
                        </div>
                    </section>

                    {message && <div className="mt-4 text-sm font-medium">{message}</div>}
                </main>

                <footer className="mt-6 text-sm text-[#bfc0e8]">Tip: Tap letters or use keyboard (A–Z) to pick. Recommended for tablets & desktop.</footer>
            </div>
        </div>
    );
}

function prepareWord(raw) {
    const base = raw.toUpperCase().replace(/[^A-Z]/g, "");
    const letters = base.split("");
    // provide a small hint by category or meaning (simple hardcoded mapping)
    const hint = hintFor(base);
    return { base, letters, hint };
}


function hintFor(word) {
    const map = {
        GRAVITY: "Force that pulls objects toward each other",
        NEURON: "Basic nerve cell",
        PHOTOS: "Prefix related to light (" + "photo-" + ")",
        ELECTRO: "Prefix relating to electricity",
        MOLECULE: "Smallest unit of a compound",
        CALCIUM: "An alkaline earth metal and bone mineral",
        PLANETS: "Orbital bodies around a star",
        GENOME: "All genetic material of an organism",
        RNA: "Genetic molecule similar to DNA",
        ENZYME: "Biological catalyst",
        QUARK: "Fundamental particle in physics",
        ATOMOS: "Ancient root meaning 'indivisible'",
    };
    return map[word] || "Science term";
}


function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}


function formatTime(sec) {
    const m = Math.floor(sec / 60)
        .toString()
        .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}