import React, { useEffect, useMemo, useState } from "react";

const SYMBOLS = [
    { id: "atom", label: "Atom", icon: "⚛️" },
    { id: "dna", label: "DNA", icon: "🧬" },
    { id: "rocket", label: "Rocket", icon: "🚀" },
    { id: "microscope", label: "Microscope", icon: "🔬" },
    { id: "gear", label: "Gear", icon: "⚙️" },
    { id: "planet", label: "Planet", icon: "🪐" },
    { id: "bolt", label: "Energy", icon: "⚡" },
    { id: "brain", label: "Brain", icon: "🧠" },
    { id: "flask", label: "Flask", icon: "🧪" },
    { id: "magnet", label: "Magnet", icon: "🧲" },
    { id: "electron", label: "Electron", icon: "🔋" },
    { id: "satellite", label: "Satellite", icon: "🛰️" },
];

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function MemoryMatch() {
    const [difficulty, setDifficulty] = useState("medium");
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState(new Set());
    const [moves, setMoves] = useState(0);
    const [timeLeft, setTimeLeft] = useState(120);
    const [isPlaying, setIsPlaying] = useState(false);
    const [message, setMessage] = useState("");
    const [best, setBest] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("memoryMatchBest")) || null;
        } catch (e) {
            return null;
        }
    });

    const pairCount = useMemo(() => {
        if (difficulty === "easy") return 6;
        if (difficulty === "hard") return 12;
        return 8;
    }, [difficulty]);

    useEffect(() => {
        resetGame();
    }, [difficulty]);

    useEffect(() => {
        if (!isPlaying) return;
        if (timeLeft <= 0) {
            setIsPlaying(false);
            setMessage("Time's up — try again!");
            return;
        }
        const t = setInterval(() => setTimeLeft((s) => s - 1), 1000);
        return () => clearInterval(t);
    }, [isPlaying, timeLeft]);

    useEffect(() => {
        if (matched.size === pairCount) {
            setIsPlaying(false);
            setMessage(`You won! Moves: ${moves}`);
            const score = computeScore(moves, timeLeft, pairCount);
            const newBest = best ? (score > best.score ? { score, moves, difficulty, date: new Date().toISOString() } : best) : { score, moves, difficulty, date: new Date().toISOString() };
            setBest(newBest);
            try { localStorage.setItem("memoryMatchBest", JSON.stringify(newBest)); } catch (e) { }
        }
    }, [matched]);

    function initialTimeForDifficulty(d) {
        if (d === "easy") return 90;
        if (d === "hard") return 180;
        return 120;
    }

    function resetGame() {
        const chosen = SYMBOLS.slice(0, pairCount);
        const pairCards = [];
        chosen.forEach((s) => {
            pairCards.push({ uid: `${s.id}-a`, id: s.id, icon: s.icon, label: s.label });
            pairCards.push({ uid: `${s.id}-b`, id: s.id, icon: s.icon, label: s.label });
        });
        const shuffled = shuffleArray(pairCards);
        setCards(shuffled);
        setFlipped([]);
        setMatched(new Set());
        setMoves(0);
        setTimeLeft(initialTimeForDifficulty(difficulty));
        setIsPlaying(false);
        setMessage("");
    }

    function startGame() {
        if (isPlaying) return;
        setIsPlaying(true);
        setMessage("");
    }

    function flipCard(index) {
        if (!isPlaying) startGame();
        if (flipped.includes(index)) return;
        if (matched.has(cards[index].id)) return;
        if (flipped.length === 2) return;

        const next = [...flipped, index];
        setFlipped(next);

        if (next.length === 2) {
            setMoves((m) => m + 1);
            const [i1, i2] = next;
            if (cards[i1].id === cards[i2].id) {
                setTimeout(() => {
                    setMatched((s) => new Set(s).add(cards[i1].id));
                    setFlipped([]);
                }, 500);
            } else {
                setTimeout(() => setFlipped([]), 800);
            }
        }
    }

    function computeScore(moves, timeLeft, pairs) {
        const base = pairs * 100;
        const timeBonus = Math.max(0, Math.floor(timeLeft));
        const movePenalty = Math.max(0, moves * 2);
        return Math.max(0, base + timeBonus - movePenalty);
    }

    function gridColumnsFor(pairs) {
        if (pairs <= 6) return 2;
        if (pairs <= 8) return 4;
        return 6;
    }

    function formatTime(sec) {
        const m = Math.floor(sec / 60).toString().padStart(2, "0");
        const s = (sec % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    }

    return (
        <div className="min-h-screen w-full px-4 pt-50 py-6 sm:px-6 lg:px-12 bg-gradient-to-br from-[#0f1530] to-[#1a1330] flex flex-col items-center text-[#e7d0ff] text-base sm:text-lg">
            <div className="w-full max-w-7xl">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-2 sm:gap-0">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">Memory Match 🧠</h1>
                        <p className="text-xs sm:text-sm md:text-base text-[#bfc0e8] mt-1">Match pairs of STEM symbols and boost your memory skills.</p>
                    </div>
                    <div className="text-right">
                        <div className="text-xs sm:text-sm text-[#bfc0e8]">Best</div>
                        <div className="text-base sm:text-lg md:text-xl font-bold">{best ? `${best.score} pts` : "—"}</div>
                    </div>
                </header>

                <main className="bg-[#071026]/60 rounded-2xl p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
                    <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                            <div className="text-xs sm:text-sm text-[#bfc0e8] mr-1">Difficulty</div>
                            <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rounded-lg bg-[#0b1224]/50 px-2 py-1 text-xs sm:text-sm">
                                <option value="easy">Easy (6 pairs)</option>
                                <option value="medium">Medium (8 pairs)</option>
                                <option value="hard">Hard (12 pairs)</option>
                            </select>
                            <button onClick={resetGame} className="px-2 sm:px-3 py-1 rounded-xl bg-[#3b2a63]/70 text-xs sm:text-sm">New</button>
                        </div>

                        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                            <div className="text-[#bfc0e8]">Time</div>
                            <div className="text-sm sm:text-base font-mono font-bold">{formatTime(timeLeft)}</div>
                            <div className="text-[#bfc0e8]">Moves</div>
                            <div className="text-sm sm:text-base font-bold">{moves}</div>
                            <button onClick={() => setFlipped(cards.map((_, i) => i))} className="px-2 sm:px-3 py-1 rounded-xl bg-[#4a2432]/60 text-xs sm:text-sm">Peek</button>
                        </div>
                    </section>

                    <section className="grid gap-3 sm:gap-4" style={{ gridTemplateColumns: `repeat(${gridColumnsFor(pairCount)}, minmax(0, 1fr))` }}>
                        {cards.map((c, i) => {
                            const isFlipped = flipped.includes(i) || matched.has(c.id);
                            return (
                                <button
                                    key={c.uid}
                                    onClick={() => flipCard(i)}
                                    disabled={isFlipped}
                                    className={`relative aspect-[3/4] rounded-xl p-2 sm:p-3 transform-gpu transition-all duration-300 ${isFlipped ? "scale-100" : "hover:scale-[1.02]"}`}
                                >
                                    <div className={`absolute inset-0 rounded-xl shadow-inner border border-[#2b1f3a] flex items-center justify-center bg-gradient-to-br ${isFlipped ? "from-[#1b1230]/80 to-[#2b1638]/80" : "from-black to-black"}`}>
                                        <div className="text-xl sm:text-2xl md:text-3xl font-bold select-none">{isFlipped ? c.icon : ""}</div>
                                    </div>
                                    <div className={`absolute inset-0 rounded-xl ${isFlipped ? "opacity-0" : "opacity-100"}`}>
                                        <div className="w-full h-full rounded-xl flex items-center justify-center font-mono text-xs sm:text-sm text-[#bfc0e8]">?</div>
                                    </div>
                                </button>
                            );
                        })}
                    </section>

                    <section className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="text-xs sm:text-sm text-[#bfc0e8]">Tip: Flip two cards to find a match — fewer moves = higher score.</div>
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button onClick={startGame} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-[#7a4edb] text-white font-semibold text-xs sm:text-sm">Start</button>
                            <button onClick={() => { setCards(shuffleArray(cards)); setMessage('Shuffled.'); }} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-[#2b8a7e] text-white font-semibold text-xs sm:text-sm">Shuffle</button>
                        </div>
                    </section>

                    {message && <div className="mt-4 text-xs sm:text-sm font-medium">{message}</div>}
                </main>

                <footer className="mt-6 text-xs sm:text-sm text-[#bfc0e8]">Accessible: cards have large icons and keyboard focus — works well on touch devices.</footer>
            </div>
        </div>
    );
}
