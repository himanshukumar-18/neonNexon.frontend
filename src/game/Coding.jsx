import React, { useEffect, useRef, useState } from "react";

// CodingPuzzle React component
// - Tailwind CSS utility classes assumed
// - Matches the same color schema and aesthetic as other pages
// - Gameplay: arrange scrambled code blocks into the correct order to build a working function
// - Medium difficulty: 4-7 blocks. Drag & drop to reorder, run-check, hints, timer, and scoring

const PUZZLES = [
    {
        id: "factorial",
        title: "Factorial (JavaScript)",
        difficulty: "Medium",
        blocks: [
            { id: "b1", code: "function factorial(n) {", order: 1 },
            { id: "b2", code: "  if (n === 0) return 1;", order: 2 },
            { id: "b3", code: "  return n * factorial(n - 1);", order: 3 },
            { id: "b4", code: "}", order: 4 },
        ],
        hint: "Use recursion: base case n === 0 returns 1.",
    },
    {
        id: "fizzbuzz",
        title: "FizzBuzz Printer (JavaScript)",
        difficulty: "Medium",
        blocks: [
            { id: "b1", code: "for (let i = 1; i <= n; i++) {", order: 1 },
            { id: "b2", code: "  if (i % 15 === 0) console.log('FizzBuzz');", order: 2 },
            { id: "b3", code: "  else if (i % 3 === 0) console.log('Fizz');", order: 3 },
            { id: "b4", code: "  else if (i % 5 === 0) console.log('Buzz');", order: 4 },
            { id: "b5", code: "  else console.log(i);", order: 5 },
            { id: "b6", code: "}", order: 6 },
        ],
        hint: "Check divisibility by 15 first to catch FizzBuzz.",
    },
    {
        id: "isPrime",
        title: "Prime Checker (JavaScript)",
        difficulty: "Medium",
        blocks: [
            { id: "b1", code: "function isPrime(n) {", order: 1 },
            { id: "b2", code: "  if (n <= 1) return false;", order: 2 },
            { id: "b3", code: "  for (let i = 2; i <= Math.sqrt(n); i++) {", order: 3 },
            { id: "b4", code: "    if (n % i === 0) return false;", order: 4 },
            { id: "b5", code: "  }", order: 5 },
            { id: "b6", code: "  return true;", order: 6 },
            { id: "b7", code: "}", order: 7 },
        ],
        hint: "Test divisors up to sqrt(n) for efficiency.",
    },
];

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function Coding() {
    const [puzzleIndex, setPuzzleIndex] = useState(0);
    const puzzle = PUZZLES[puzzleIndex % PUZZLES.length];
    const [blocks, setBlocks] = useState(() => shuffle(puzzle.blocks));
    const [draggingId, setDraggingId] = useState(null);
    const [message, setMessage] = useState("");
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [hintsUsed, setHintsUsed] = useState(0);
    const timerRef = useRef(null);

    useEffect(() => {
        setBlocks(shuffle(puzzle.blocks));
        setTimeLeft(120);
        setHintsUsed(0);
        setMessage("");
    }, [puzzleIndex]);

    useEffect(() => {
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    setMessage("Time's up — puzzle failed.");
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current);
    }, [puzzleIndex]);

    function onDragStart(e, id) {
        setDraggingId(id);
        e.dataTransfer.effectAllowed = "move";
    }

    function onDragOver(e, id) {
        e.preventDefault();
        if (id === draggingId) return;
        const from = blocks.findIndex((b) => b.id === draggingId);
        const to = blocks.findIndex((b) => b.id === id);
        if (from === -1 || to === -1) return;
        const copy = [...blocks];
        const [moved] = copy.splice(from, 1);
        copy.splice(to, 0, moved);
        setBlocks(copy);
    }

    function checkSolution() {
        const isCorrect = blocks.every((b, i) => b.order === i + 1);
        if (isCorrect) {
            setMessage("Correct! You assembled the program.");
            setScore((s) => s + Math.max(20, 100 - hintsUsed * 20));
            setTimeout(() => setPuzzleIndex((p) => p + 1), 900);
        } else {
            setMessage("Not correct yet — check the order.");
            setScore((s) => Math.max(0, s - 5));
        }
    }

    function autoSolve() {
        setBlocks([...puzzle.blocks].sort((a, b) => a.order - b.order));
        setMessage("Auto-filled (cheat).");
        setScore((s) => Math.max(0, s - 20));
    }

    function useHint() {
        if (hintsUsed >= 2) return;
        // Reveal the next block that should be at position 'hintsUsed'
        const correctBlock = puzzle.blocks.find((b) => b.order === hintsUsed + 1);
        setBlocks((prev) => {
            const copy = [...prev];
            const idx = copy.findIndex((x) => x.id === correctBlock.id);
            if (idx > -1) {
                copy.splice(idx, 1);
                copy.splice(hintsUsed, 0, correctBlock);
            }
            return copy;
        });
        setHintsUsed((h) => h + 1);
        setScore((s) => Math.max(0, s - 15));
    }

    function shuffleBlocks() {
        setBlocks((b) => shuffle(b));
        setMessage("");
    }

    function nextPuzzle() {
        setPuzzleIndex((i) => i + 1);
    }

    return (
        <div className="min-h-screen w-full p-6 pt-50 bg-gradient-to-br from-[#0f1530] to-[#1a1330] flex flex-col items-center text-[#e7d0ff]">
            <div className="w-full max-w-7xl">
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight">Coding Puzzle 💻</h1>
                        <p className="text-sm text-[#bfc0e8] mt-1">Arrange scrambled code blocks to make a working program.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-[#bfc0e8]">Score</div>
                        <div className="text-xl font-bold">{score}</div>
                    </div>
                </header>

                <main className="bg-[#071026]/60 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
                    <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div>
                            <div className="text-sm text-[#bfc0e8]">Puzzle</div>
                            <div className="text-lg font-semibold">{puzzle.title} • {puzzle.difficulty}</div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-[#bfc0e8]">Time</div>
                            <div className="text-lg font-mono font-bold">{formatTime(timeLeft)}</div>
                            <button className="ml-2 px-3 py-1 rounded-xl bg-[#2b2040]/70 hover:bg-[#2b2040] text-sm" onClick={shuffleBlocks}>
                                Shuffle
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="px-3 py-1 rounded-xl bg-[#3b2a63]/70 text-sm" onClick={useHint} disabled={hintsUsed >= 2}>
                                Hint ({2 - hintsUsed})
                            </button>
                            <button className="px-3 py-1 rounded-xl bg-[#4a2432]/60 text-sm" onClick={autoSolve}>
                                Auto-fill
                            </button>
                            <button className="px-3 py-1 rounded-xl bg-[#2a4a3f]/60 text-sm" onClick={nextPuzzle}>
                                Next
                            </button>
                        </div>
                    </section>

                    <section className="mb-6">
                        <div className="text-sm text-[#bfc0e8] mb-2">Assemble the blocks (drag & drop)</div>
                        <div className="space-y-2">
                            {blocks.map((b) => (
                                <div
                                    key={b.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, b.id)}
                                    onDragOver={(e) => onDragOver(e, b.id)}
                                    className="cursor-grab select-none bg-[#ffffff08] border border-[#2b1f3a] rounded-lg p-3 font-mono text-sm"
                                >
                                    <pre className="whitespace-pre-wrap">{b.code}</pre>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="flex items-center justify-between">
                        <div className="text-sm text-[#bfc0e8]">Hint: {puzzle.hint}</div>
                        <div className="flex items-center gap-3">
                            <button onClick={checkSolution} className="px-4 py-2 rounded-2xl bg-[#7a4edb] text-white font-semibold">
                                Check
                            </button>
                            <button onClick={() => { setBlocks(shuffle(puzzle.blocks)); setMessage('Reset puzzle.'); }} className="px-4 py-2 rounded-2xl bg-[#2b8a7e] text-white font-semibold">
                                Reset
                            </button>
                        </div>
                    </section>

                    {message && <div className="mt-4 text-sm font-medium">{message}</div>}

                    <details className="mt-4 text-xs text-[#bfc0e8] bg-[#00000010] rounded-md p-3">
                        <summary className="cursor-pointer font-medium">How this works</summary>
                        <p className="mt-2">Drag blocks to reorder them. When blocks are in the correct sequence, pressing Check awards points and advances to the next puzzle. Hints will place 1 block in the correct spot (max 2 hints).</p>
                    </details>
                </main>

                <footer className="mt-6 text-sm text-[#bfc0e8]">Tip: Best on desktop or tablet — try touching & dragging blocks on mobile.</footer>
            </div>
        </div>
    );
}

function formatTime(sec) {
    const m = Math.floor(sec / 60)
        .toString()
        .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}
