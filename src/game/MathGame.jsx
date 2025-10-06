import React, { useEffect, useState, useRef } from 'react';

/*
Math Challenge ➕
- Fast-paced arithmetic game (mental math speed)
- Responsive for all screen sizes using Tailwind CSS
- Uses your app color scheme: dark navy background + purple/pink gradients + accents
- Features: timer, combos, lives, streaks, difficulty levels, keyboard input, touch-friendly
- Drop this file into a React app using Tailwind and export default component.
*/

const OPS = ['+', '−', '×', '÷'];

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateProblem(level) {
    // level: 'easy' | 'medium' | 'hard' affects ranges and operators
    let a, b, op;
    if (level === 'easy') {
        op = OPS[rand(0, 1)]; // +, −
        a = rand(1, 20);
        b = rand(1, 20);
    } else if (level === 'medium') {
        op = OPS[rand(0, 2)]; // +, −, ×
        a = rand(1, 50);
        b = rand(1, 12);
    } else {
        op = OPS[rand(0, 3)]; // +, −, ×, ÷
        a = rand(2, 200);
        b = rand(2, 20);
    }

    // for division, ensure clean division for simplicity
    if (op === '÷') {
        const prod = a * b;
        // set numerator to prod to make integer result
        return { a: prod, b, op, answer: a };
    }

    let answer;
    switch (op) {
        case '+':
            answer = a + b;
            break;
        case '−':
            answer = a - b;
            break;
        case '×':
            answer = a * b;
            break;
        default:
            answer = a + b;
    }

    return { a, b, op, answer };
}

export default function MathChallenge({ defaultLevel = 'medium' }) {
    const [level, setLevel] = useState(defaultLevel);
    const [problem, setProblem] = useState(() => generateProblem(level));
    const [input, setInput] = useState('');
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [lives, setLives] = useState(3);
    const [timeLeft, setTimeLeft] = useState(60); // 60s rounds
    const [running, setRunning] = useState(true);
    const [message, setMessage] = useState('Solve as many as you can!');
    const [highscore, setHighscore] = useState(0);
    const [comboTimer, setComboTimer] = useState(null);
    const inputRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        setProblem(generateProblem(level));
    }, [level]);

    useEffect(() => {
        if (running) {
            timerRef.current = setInterval(() => setTimeLeft(t => t - 1), 1000);
        }
        return () => clearInterval(timerRef.current);
    }, [running]);

    useEffect(() => {
        if (timeLeft <= 0 || lives <= 0) {
            setRunning(false);
            setMessage('Round over — great attempt!');
            setHighscore(prev => Math.max(prev, score));
        }
    }, [timeLeft, lives]);

    useEffect(() => {
        // focus input for quick typing
        if (inputRef.current) inputRef.current.focus();
    }, []);

    function submitAnswer() {
        if (!running) return;
        if (input.trim() === '') return;
        const numeric = Number(input.replace(',', '.'));
        if (Number.isNaN(numeric)) return;

        if (numeric === problem.answer) {
            // correct
            const gained = 10 + (streak * 2) + (level === 'hard' ? 5 : level === 'medium' ? 2 : 0);
            setScore(s => s + gained);
            setStreak(s => s + 1);
            setMessage(`Correct! +${gained}`);
            // quick combo window (short time to extend streak)
            if (comboTimer) clearTimeout(comboTimer);
            const t = setTimeout(() => setStreak(0), 3000);
            setComboTimer(t);
            // small bonus time on correct answer
            setTimeLeft(tl => Math.min(9999, tl + 2));
        } else {
            // incorrect
            setLives(l => l - 1);
            setStreak(0);
            setScore(s => Math.max(0, s - 5));
            setMessage(`Wrong — answer was ${problem.answer}`);
        }

        setInput('');
        setProblem(generateProblem(level));
    }

    function handleKey(e) {
        if (e.key === 'Enter') {
            submitAnswer();
        }
    }

    function resetRound(newLevel = level) {
        setLevel(newLevel);
        setProblem(generateProblem(newLevel));
        setInput('');
        setScore(0);
        setStreak(0);
        setLives(3);
        setTimeLeft(60);
        setRunning(true);
        setMessage('Solve as many as you can!');
        if (comboTimer) clearTimeout(comboTimer);
    }

    function skipProblem() {
        // penalty
        setScore(s => Math.max(0, s - 2));
        setStreak(0);
        setProblem(generateProblem(level));
        setMessage('Skipped (-2)');
    }

    return (
        <div className="min-h-screen w-full p-4 pt-50 bg-gradient-to-br from-[#0f1530] to-[#1a1330] text-white flex flex-col items-center">
            <div className="w-full max-w-7xl">
                <header className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                    <div className="text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-[#e7d0ff]">Math Challenge ➕</h1>
                        <p className="text-sm md:text-base text-[#bfc0e8] mt-1">Solve fast-paced math problems to boost calculation speed. Type answers and press Enter.</p>
                    </div>

                    <div className="flex gap-3 items-center">
                        <div className="px-3 py-2 rounded-lg bg-[#111228] border border-[#3b2a4f] text-sm text-[#dfe6ff] shadow-lg text-center">
                            <div className="text-xs">Time</div>
                            <div className="text-lg font-semibold">{Math.max(0, timeLeft)}s</div>
                        </div>

                        <div className="px-3 py-2 rounded-lg bg-[#111228] border border-[#3b2a4f] text-sm text-[#dfe6ff] shadow-lg text-center">
                            <div className="text-xs">Lives</div>
                            <div className="text-lg font-semibold">{lives}</div>
                        </div>

                        <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-pink-600 to-purple-600 text-sm font-semibold shadow-lg text-center">
                            <div className="text-xs">Score</div>
                            <div className="text-lg">{score}</div>
                        </div>
                    </div>
                </header>

                <main>
                    <div className="mb-6 rounded-2xl p-6 bg-gradient-to-br from-purple-800 to-pink-700 shadow-2xl border border-pink-500">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-center sm:text-left flex-1">
                                <div className="text-sm text-[#e7d0ff]">Problem</div>
                                <div className="mt-2 text-4xl md:text-5xl font-bold text-white">{problem.a} <span className="mx-2 text-pink-200">{problem.op}</span> {problem.b} =</div>
                                <div className="mt-2 text-sm text-[#dfe6ff]">Streak: <span className="font-semibold">{streak}</span> • Highscore: {highscore}</div>
                            </div>

                            <div className="w-full sm:w-64">
                                <input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKey}
                                    className="w-full text-center text-2xl py-3 rounded-lg bg-[#0b0b12] border border-[#2d2342] focus:outline-none"
                                    placeholder="Type answer"
                                    inputMode="numeric"
                                />

                                <div className="mt-3 flex gap-2">
                                    <button onClick={submitAnswer} className="flex-1 px-3 py-2 rounded-lg bg-pink-600 hover:bg-pink-500">Submit</button>
                                    <button onClick={skipProblem} className="px-3 py-2 rounded-lg bg-[#1f1b2b]">Skip</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <label className="text-sm text-[#dfe6ff]">Difficulty:</label>
                        <div className="flex gap-2">
                            <button onClick={() => resetRound('easy')} className={`px-3 py-1 rounded-lg ${level === 'easy' ? 'bg-pink-500' : 'bg-[#1f1b2b]'}`}>Easy</button>
                            <button onClick={() => resetRound('medium')} className={`px-3 py-1 rounded-lg ${level === 'medium' ? 'bg-pink-500' : 'bg-[#1f1b2b]'}`}>Medium</button>
                            <button onClick={() => resetRound('hard')} className={`px-3 py-1 rounded-lg ${level === 'hard' ? 'bg-pink-500' : 'bg-[#1f1b2b]'}`}>Hard</button>
                        </div>

                        <div className="ml-auto flex gap-2">
                            <button onClick={() => { setRunning(r => !r); setMessage(''); }} className="px-3 py-1 rounded-lg bg-[#2d2540]">{running ? 'Pause' : 'Resume'}</button>
                            <button onClick={() => resetRound(level)} className="px-3 py-1 rounded-lg bg-[#1f1b2b]">Reset</button>
                        </div>
                    </div>

                    <div className="mb-4 text-sm text-[#dfe6ff]">{message}</div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {/* Quick answer buttons for touch users */}
                        {[...Array(18)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setInput(String(i))}
                                className="px-2 py-2 rounded-lg bg-[#111228] text-sm"
                            >
                                {i}
                            </button>
                        ))}
                    </div>

                    <div className="mt-6 p-3 rounded-lg bg-[#0b0b12] border border-[#23182b] text-sm text-[#bfc0e8]">
                        Tips: Use Enter to submit. Correct answers give small time bonuses. Maintain streaks to earn bonuses. Skipping and wrong answers cost points.
                    </div>
                </main>
            </div>
        </div>
    );
}
