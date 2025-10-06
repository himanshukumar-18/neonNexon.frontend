import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Check, RefreshCw, Eye } from "lucide-react";

const COLORS = {
    bgFrom: "#0f1530",
    bgTo: "#1a1330",
    accent: "#e7d0ff",
    sub: "#bfc0e8",
};

const DEFAULT_WORDS = [
    "ATOM",
    "CELL",
    "FORCE",
    "ENERGY",
    "GRAVITY",
    "MOLECULE",
    "PHOTON",
    "QUARK",
    "VOLT",
    "LASER",
];

const DIRECTIONS = [
    [0, 1], // right
    [1, 0], // down
    [0, -1], // left
    [-1, 0], // up
    [1, 1], // down-right
    [1, -1], // down-left
    [-1, 1], // up-right
    [-1, -1], // up-left
];

function createEmptyGrid(size) {
    return Array.from({ length: size }, () => Array.from({ length: size }, () => ""));
}

function randomInt(max) {
    return Math.floor(Math.random() * max);
}

function placeWords(words, size) {
    // Attempt to place all words into grid. Returns grid and placed word metadata.
    const grid = createEmptyGrid(size);
    const placed = [];

    const canPlace = (r, c, dr, dc, word) => {
        for (let i = 0; i < word.length; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            if (nr < 0 || nr >= size || nc < 0 || nc >= size) return false;
            const ch = grid[nr][nc];
            if (ch && ch !== word[i]) return false;
        }
        return true;
    };

    const place = (r, c, dr, dc, word) => {
        for (let i = 0; i < word.length; i++) {
            const nr = r + dr * i;
            const nc = c + dc * i;
            grid[nr][nc] = word[i];
        }
    };

    for (const rawWord of words) {
        const word = rawWord.toUpperCase();
        let attempts = 0;
        let success = false;
        while (attempts < 200 && !success) {
            const dir = DIRECTIONS[randomInt(DIRECTIONS.length)];
            const dr = dir[0];
            const dc = dir[1];
            const r = randomInt(size);
            const c = randomInt(size);
            if (canPlace(r, c, dr, dc, word)) {
                place(r, c, dr, dc, word);
                placed.push({ word, start: [r, c], dir: [dr, dc] });
                success = true;
            }
            attempts++;
        }
        // If failed to place after many attempts, try reversed word
        if (!success) {
            const rev = word.split("").reverse().join("");
            let att2 = 0;
            while (att2 < 300 && !success) {
                const dir = DIRECTIONS[randomInt(DIRECTIONS.length)];
                const dr = dir[0];
                const dc = dir[1];
                const r = randomInt(size);
                const c = randomInt(size);
                if (canPlace(r, c, dr, dc, rev)) {
                    place(r, c, dr, dc, rev);
                    placed.push({ word, start: [r, c], dir: [dr, dc], reversed: true });
                    success = true;
                }
                att2++;
            }
        }
        // If still not placed, skip — the grid will still be filled with other words.
    }

    // Fill empty cells with random letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (!grid[r][c]) grid[r][c] = alphabet[randomInt(alphabet.length)];
        }
    }

    return { grid, placed };
}

export default function WordSearchPage({ words = DEFAULT_WORDS, gridSize = 12 }) {
    const [size, setSize] = useState(gridSize);
    const [gridData, setGridData] = useState(() => placeWords(words, size));
    const [found, setFound] = useState([]);
    const [selection, setSelection] = useState(null); // {start:[r,c], end:[r,c], cells: [[r,c], ...]}
    const containerRef = useRef(null);
    const [hint, setHint] = useState(null);

    useEffect(() => {
        // Rebuild grid when words or size change
        setGridData(placeWords(words, size));
        setFound([]);
        setSelection(null);
    }, [words, size]);

    const startSelection = (r, c) => {
        setSelection({ start: [r, c], end: [r, c], cells: [[r, c]] });
    };

    const updateSelection = (r, c) => {
        if (!selection) return;
        const [sr, sc] = selection.start;
        const dr = Math.sign(r - sr);
        const dc = Math.sign(c - sc);
        // Determine line from start to current
        const cells = [];
        let len = Math.max(Math.abs(r - sr), Math.abs(c - sc)) + 1;
        for (let i = 0; i < len; i++) {
            const nr = sr + dr * i;
            const nc = sc + dc * i;
            if (nr < 0 || nr >= size || nc < 0 || nc >= size) break;
            cells.push([nr, nc]);
        }
        setSelection({ start: [sr, sc], end: [r, c], cells });
    };

    const endSelection = () => {
        if (!selection) return setSelection(null);
        const word = selection.cells.map(([r, c]) => gridData.grid[r][c]).join("");
        const rev = word.split("").reverse().join("");
        const match = gridData.placed.find(p => p.word === word || p.word === rev);
        if (match && !found.includes(match.word)) {
            setFound(prev => [...prev, match.word]);
            // visual feedback could be added
        }
        setSelection(null);
    };

    const handleCellMouseDown = (r, c) => startSelection(r, c);
    const handleCellMouseEnter = (r, c) => updateSelection(r, c);
    const handleCellMouseUp = () => endSelection();

    // Touch handlers for mobile
    const handleTouchStart = (e, r, c) => {
        e.preventDefault();
        startSelection(r, c);
    };
    const handleTouchMove = (e) => {
        if (!selection) return;
        const touch = e.touches[0];
        const rect = containerRef.current.getBoundingClientRect();
        const cellSize = rect.width / size;
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        const c = Math.floor((x / rect.width) * size);
        const r = Math.floor((y / rect.width) * size); // using rect.width to keep cells square
        if (r >= 0 && r < size && c >= 0 && c < size) updateSelection(r, c);
    };
    const handleTouchEnd = () => endSelection();

    const reset = () => {
        setGridData(placeWords(words, size));
        setFound([]);
        setSelection(null);
        setHint(null);
    };

    const giveHint = () => {
        const notFound = gridData.placed.map(p => p.word).filter(w => !found.includes(w));
        if (notFound.length === 0) return setHint(null);
        const pick = notFound[randomInt(notFound.length)];
        setHint(pick);
        // Optionally highlight a random letter of the word or show first letter
    };

    const allFound = gridData.placed.every(p => found.includes(p.word));

    return (
        <div className="min-h-screen flex items-center justify-center p-4 pt-50" style={{ background: `linear-gradient(135deg, ${COLORS.bgFrom}, ${COLORS.bgTo})` }}>
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-6xl mx-auto"
            >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left panel: title + controls */}
                    <div className="col-span-1 bg-opacity-30 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-white/6 flex flex-col gap-4">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-extrabold" style={{ color: COLORS.accent }}>Word Search 🔍</h1>
                            <p className="text-sm mt-1" style={{ color: COLORS.sub }}>Find hidden STEM words in the grid — tap or drag to select. Responsive, accessible, and playful.</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-2">
                            <button onClick={reset} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-sm font-medium hover:scale-105 transition-transform" style={{ color: COLORS.accent }}>
                                <RefreshCw size={16} /> Restart
                            </button>
                            <button onClick={giveHint} className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-sm font-medium hover:scale-105 transition-transform" style={{ color: COLORS.accent }}>
                                <Eye size={16} /> Hint
                            </button>
                            <div className="ml-auto text-sm text-white/60 self-center">Found <span className="font-semibold" style={{ color: COLORS.accent }}>{found.length}</span> / {gridData.placed.length}</div>
                        </div>

                        <div className="mt-3">
                            <h3 className="text-sm font-semibold" style={{ color: COLORS.accent }}>Words</h3>
                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                {gridData.placed.map(p => (
                                    <div key={p.word} className={`px-2 py-1 rounded-full text-xs border ${found.includes(p.word) ? 'bg-white/10 border-white/20 line-through opacity-70' : 'bg-white/3 border-white/6'}`} style={{ color: COLORS.accent }}>
                                        {p.word}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-4 text-sm text-white/60">
                            <p><span className="font-semibold" style={{ color: COLORS.accent }}>Tip:</span> Press and drag (or touch) across letters in a straight line to select words. Diagonals allowed.</p>
                        </div>
                    </div>

                    {/* Center: grid */}
                    <div className="col-span-1 lg:col-span-2 bg-opacity-20 backdrop-blur-md p-4 rounded-2xl shadow-inner border border-white/6 flex flex-col">
                        <div className="flex items-center gap-4 justify-between mb-3">
                            <div className="text-sm text-white/60">Grid size</div>
                            <div className="flex items-center gap-2">
                                <input type="range" min="8" max="18" value={size} onChange={e => setSize(parseInt(e.target.value))} className="w-36" />
                                <div className="w-10 text-right text-sm font-medium" style={{ color: COLORS.accent }}>{size}×{size}</div>
                            </div>
                        </div>

                        <div
                            ref={containerRef}
                            onMouseLeave={() => setSelection(null)}
                            onMouseUp={handleCellMouseUp}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            className="w-full flex justify-center items-center"
                        >
                            <div
                                className="relative"
                                style={{ width: 'min(720px, 92vw)', aspectRatio: '1 / 1' }}
                                onMouseDown={(e) => e.preventDefault()}
                            >
                                {/* SVG overlay for selection highlighting */}
                                <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${size}, 1fr)`, gridTemplateRows: `repeat(${size}, 1fr)` }}>
                                    {gridData.grid.map((row, r) => row.map((cell, c) => {
                                        const isSelected = selection && selection.cells.some(([rr, cc]) => rr === r && cc === c);
                                        const isFound = gridData.placed.some(p => {
                                            const coords = []; // reconstruct coords of placed word
                                            const [sr, sc] = p.start;
                                            const [dr, dc] = p.dir;
                                            for (let i = 0; i < p.word.length; i++) coords.push([sr + dr * i, sc + dc * i]);
                                            return coords.some(([rr, cc]) => rr === r && cc === c) && found.includes(p.word);
                                        });

                                        return (
                                            <div
                                                key={`${r}-${c}`}
                                                onMouseDown={() => handleCellMouseDown(r, c)}
                                                onMouseEnter={() => handleCellMouseEnter(r, c)}
                                                onTouchStart={(e) => handleTouchStart(e, r, c)}
                                                className={`flex items-center justify-center select-none border border-white/5 cursor-pointer text-xs sm:text-sm md:text-base lg:text-lg font-bold`}
                                                style={{
                                                    WebkitUserSelect: 'none',
                                                    userSelect: 'none',
                                                    background: isFound ? 'linear-gradient(90deg, rgba(231,208,255,0.06), rgba(191,192,232,0.03))' : 'transparent',
                                                    color: isFound ? COLORS.accent : COLORS.sub,
                                                    transition: 'transform 120ms, background 200ms',
                                                    transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                                                }}
                                            >
                                                {cell}
                                            </div>
                                        );
                                    }))}
                                </div>

                                {/* Selection visual line (optional) */}
                                {selection && (
                                    <svg className="absolute inset-0 pointer-events-none" viewBox={`0 0 ${size} ${size}`} preserveAspectRatio="none">
                                        {(() => {
                                            const s = selection.start; const e = selection.end;
                                            const stroke = 0.25;
                                            const cx = (s[1] + 0.5);
                                            const cy = (s[0] + 0.5);
                                            const ex = (e[1] + 0.5);
                                            const ey = (e[0] + 0.5);
                                            return (
                                                <line x1={cx} y1={cy} x2={ex} y2={ey} stroke={COLORS.accent} strokeWidth={stroke} strokeLinecap="round" opacity={0.9} />
                                            );
                                        })()}
                                    </svg>
                                )}

                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between gap-4">
                            <div className="text-sm text-white/60">{allFound ? <div className="flex items-center gap-2"><Check size={16} /> All words found — nice!</div> : <div>Keep searching — {gridData.placed.length - found.length} left</div>}</div>

                            <div className="flex items-center gap-2">
                                {hint && <div className="px-3 py-1 rounded-full border border-white/10" style={{ color: COLORS.accent }}>Hint: {hint}</div>}
                                <button onClick={() => setSize(prev => Math.max(8, prev - 1))} className="px-3 py-1 rounded-xl border">-</button>
                                <button onClick={() => setSize(prev => Math.min(18, prev + 1))} className="px-3 py-1 rounded-xl border">+</button>
                            </div>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}
