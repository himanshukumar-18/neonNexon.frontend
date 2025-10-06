import React, { useEffect, useState, useRef } from "react";

const ALL_ELEMENTS = [
    { atomic: 1, symbol: "H", name: "Hydrogen" },
    { atomic: 2, symbol: "He", name: "Helium" },
    { atomic: 3, symbol: "Li", name: "Lithium" },
    { atomic: 4, symbol: "Be", name: "Beryllium" },
    { atomic: 5, symbol: "B", name: "Boron" },
    { atomic: 6, symbol: "C", name: "Carbon" },
    { atomic: 7, symbol: "N", name: "Nitrogen" },
    { atomic: 8, symbol: "O", name: "Oxygen" },
    { atomic: 11, symbol: "Na", name: "Sodium" },
    { atomic: 12, symbol: "Mg", name: "Magnesium" },
    { atomic: 14, symbol: "Si", name: "Silicon" },
    { atomic: 15, symbol: "P", name: "Phosphorus" },
    { atomic: 16, symbol: "S", name: "Sulfur" },
    { atomic: 17, symbol: "Cl", name: "Chlorine" },
    { atomic: 19, symbol: "K", name: "Potassium" },
    { atomic: 20, symbol: "Ca", name: "Calcium" },
    { atomic: 26, symbol: "Fe", name: "Iron" },
    { atomic: 29, symbol: "Cu", name: "Copper" },
    { atomic: 47, symbol: "Ag", name: "Silver" },
    { atomic: 79, symbol: "Au", name: "Gold" },
];

function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

export default function PuzzelGame({ pairCount = 10 }) {
    const count = Math.min(pairCount, ALL_ELEMENTS.length);
    const [selected, setSelected] = useState(() => pickRandomElements(count));
    const [slots, setSlots] = useState(Array(count).fill(null));
    const [moves, setMoves] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(150); // 2.5 minutes medium
    const [running, setRunning] = useState(true);
    const [message, setMessage] = useState("");
    const [checkResults, setCheckResults] = useState(Array(count).fill(null)); // null/true/false
    const [selectedElementId, setSelectedElementId] = useState(null); // mobile selection
    const timerRef = useRef(null);

    useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [running]);

    useEffect(() => {
        if (timeLeft <= 0) {
            setRunning(false);
            setMessage("Time's up! Try reshuffle to play again.");
        }
    }, [timeLeft]);

    useEffect(() => {
        // if all slots filled, optionally auto-check
        if (slots.every(Boolean)) {
            checkPlacement();
        }
    }, [slots]);

    function pickRandomElements(n) {
        return shuffle(ALL_ELEMENTS).slice(0, n).map((e) => ({ ...e, id: `el-${e.atomic}` }));
    }

    function reset(preserveTime = false) {
        const newSel = pickRandomElements(count);
        setSelected(newSel);
        setSlots(Array(count).fill(null));
        setMoves(0);
        setScore(0);
        setMessage("");
        setCheckResults(Array(count).fill(null));
        setSelectedElementId(null);
        setRunning(true);
        setTimeLeft(preserveTime ? timeLeft : 150);
    }

    function onDragStart(e, elId) {
        e.dataTransfer.setData("text/plain", elId);
        // for Firefox
        if (e.dataTransfer.setDragImage) {
            const crt = document.createElement("div");
            crt.style.padding = "4px 8px";
            crt.style.borderRadius = "6px";
            crt.style.background = "rgba(255,255,255,0.08)";
            crt.style.color = "white";
            crt.style.fontWeight = "600";
            crt.textContent = elId;
            document.body.appendChild(crt);
            e.dataTransfer.setDragImage(crt, 10, 10);
            setTimeout(() => document.body.removeChild(crt), 0);
        }
    }

    function onDropToSlot(e, index) {
        e.preventDefault();
        const elId = e.dataTransfer.getData("text/plain");
        if (!elId) return;
        placeElement(elId, index);
    }

    function onDragOver(e) {
        e.preventDefault();
    }

    function placeElement(elId, index) {
        const element = selected.find((s) => s.id === elId);
        if (!element) return;

        setSlots((prev) => {
            const copy = prev.slice();
            // remove element from any existing slot
            for (let i = 0; i < copy.length; i++) {
                if (copy[i]?.id === element.id) copy[i] = null;
            }
            copy[index] = element;
            return copy;
        });

        setMoves((m) => m + 1);
        setMessage("");
        setCheckResults(Array(count).fill(null));
        // if placed by tap, deselect
        setSelectedElementId(null);
    }

    function onSourceClick(elId) {
        // mobile friendly: pick an element to place
        setSelectedElementId((prev) => (prev === elId ? null : elId));
    }

    function onSlotClick(index) {
        // If user has selected an element (mobile), place it
        if (selectedElementId) {
            placeElement(selectedElementId, index);
            return;
        }
        // otherwise if slot has element, remove it back to source
        setSlots((prev) => {
            const copy = prev.slice();
            if (copy[index]) {
                copy[index] = null;
                setMoves((m) => m + 1);
            }
            return copy;
        });
        setCheckResults(Array(count).fill(null));
    }

    function checkPlacement() {
        // compute correct ascending order
        const sorted = selected.slice().sort((a, b) => a.atomic - b.atomic);

        const results = slots.map((s, idx) => {
            if (!s) return false;
            return s.atomic === sorted[idx].atomic;
        });

        setCheckResults(results.map((r) => (r ? true : false)));
        const allCorrect = results.every((v) => v === true);
        if (allCorrect) {
            setRunning(false);
            setScore((sc) => sc + Math.max(10, 100 - moves));
            setMessage(`Brilliant — all in correct order! Score +${Math.max(10, 100 - moves)}.`);
        } else {
            setScore((sc) => Math.max(0, sc - 2));
            setMessage("Some items are out of order — keep trying or use a hint.");
        }
    }

    function hint() {
        // place the correct element into the first incorrect/empty slot
        const sorted = selected.slice().sort((a, b) => a.atomic - b.atomic);
        // find first index needing help
        let idx = -1;
        for (let i = 0; i < sorted.length; i++) {
            const s = slots[i];
            if (!s || s.atomic !== sorted[i].atomic) {
                idx = i;
                break;
            }
        }
        if (idx === -1) return; // all good

        const needed = sorted[idx];
        // remove it from any existing slot
        setSlots((prev) => {
            const copy = prev.slice();
            for (let i = 0; i < copy.length; i++) {
                if (copy[i]?.id === needed.id) copy[i] = null;
            }
            copy[idx] = needed;
            return copy;
        });

        setMoves((m) => m + 1);
        setScore((sc) => Math.max(0, sc - 5));
        setMessage("Hint used — a correct element was placed (−5 points)");
        setCheckResults(Array(count).fill(null));
    }

    // derive source pool (elements not currently placed)
    const placedIds = slots.filter(Boolean).map((s) => s.id);
    const source = selected.filter((s) => !placedIds.includes(s.id));

    return (
        <div className="min-h-screen w-full p-4 pt-50 bg-gradient-to-br from-[#0f1530] to-[#1a1330] text-white flex flex-col items-center">
            <div className="w-full max-w-7xl">
                <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#e7d0ff]">Periodic Order — Drag & Drop</h1>
                        <p className="text-sm md:text-base text-[#bfc0e8] mt-1">Drag or tap elements into ascending atomic-number order. Medium challenge • {count} elements</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="px-3 py-2 rounded-lg bg-[#111228] border border-[#3b2a4f] text-sm text-[#dfe6ff] shadow-lg text-center">
                            <div className="text-xs">Time</div>
                            <div className="text-lg font-semibold">{Math.max(0, timeLeft)}s</div>
                        </div>

                        <div className="px-3 py-2 rounded-lg bg-[#111228] border border-[#3b2a4f] text-sm text-[#dfe6ff] shadow-lg text-center">
                            <div className="text-xs">Moves</div>
                            <div className="text-lg font-semibold">{moves}</div>
                        </div>

                        <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 text-sm font-semibold shadow-lg text-center">
                            <div className="text-xs">Score</div>
                            <div className="text-lg">{score}</div>
                        </div>
                    </div>
                </header>

                <main>
                    {/* Source pool */}
                    <section className="mb-6">
                        <h2 className="text-sm text-[#dfe6ff] mb-2">Available Elements</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {source.map((el) => (
                                <button
                                    key={el.id}
                                    draggable
                                    onDragStart={(e) => onDragStart(e, el.id)}
                                    onClick={() => onSourceClick(el.id)}
                                    className={`flex flex-col items-center justify-center rounded-lg p-3 h-24 border-2
                    ${selectedElementId === el.id ? 'ring-4 ring-pink-500' : ''}
                    bg-gradient-to-br from-purple-800 to-pink-700 hover:scale-105 transform transition`}
                                >
                                    <div className="text-xl font-bold">{el.symbol}</div>
                                    <div className="text-xs text-[#dfe6ff]">{el.name}</div>
                                </button>
                            ))}
                        </div>
                    </section>

                    {/* Target slots */}
                    <section className="mb-6">
                        <h2 className="text-sm text-[#dfe6ff] mb-2">Place in ascending order (left → right)</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {slots.map((slot, idx) => {
                                const result = checkResults[idx];
                                return (
                                    <div
                                        key={idx}
                                        onDrop={(e) => onDropToSlot(e, idx)}
                                        onDragOver={onDragOver}
                                        onClick={() => onSlotClick(idx)}
                                        className={`h-28 rounded-lg p-2 flex items-center justify-center relative cursor-pointer select-none border-2
                      ${result === null ? 'border-[#2a2540] bg-[#0b0b12]' : result === true ? 'border-green-400 bg-green-900/20' : 'border-red-500 bg-red-900/20'}
                      `}
                                        aria-label={`Slot ${idx + 1}`}
                                    >
                                        {slot ? (
                                            <div className="text-center">
                                                <div className="text-lg font-bold">{slot.symbol}</div>
                                                <div className="text-xs text-[#dfe6ff]">{slot.name}</div>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-[#9ea5c8]">Drop here ({idx + 1})</div>
                                        )}

                                        {/* small index label */}
                                        <div className="absolute top-1 left-2 text-[10px] text-[#bfc0e8]">{idx + 1}</div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center gap-3 mb-6">
                        <button
                            onClick={() => { setSelected(pickRandomElements(count)); setSlots(Array(count).fill(null)); setMoves(0); setScore(0); setMessage(''); setCheckResults(Array(count).fill(null)); setRunning(true); setTimeLeft(150); }}
                            className="px-4 py-2 rounded-lg bg-[#1f1b2b] border border-[#2d2342] hover:opacity-90 transition"
                        >
                            Reshuffle
                        </button>

                        <button
                            onClick={() => { setRunning((r) => !r); setMessage(''); }}
                            className="px-4 py-2 rounded-lg bg-[#2d2540] border border-[#402a59] hover:opacity-90 transition"
                        >
                            {running ? 'Pause' : 'Resume'}
                        </button>

                        <button onClick={checkPlacement} className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 transition">
                            Check
                        </button>

                        <button onClick={hint} className="px-4 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 transition">
                            Hint (−5 pts)
                        </button>

                        <div className="ml-auto text-sm text-[#dfe6ff]">{message}</div>
                    </div>

                    {/* small legend */}
                    <div className="p-3 rounded-lg bg-[#0b0b12] border border-[#23182b] text-sm text-[#bfc0e8]">
                        Tips: You can drag (desktop) or tap a tile then tap a slot (mobile). Use hints if you're stuck — they cost points.
                    </div>
                </main>
            </div>
        </div>
    );
}
