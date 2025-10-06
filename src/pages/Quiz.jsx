import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { RefreshCw, Check, X } from "lucide-react";
import { GlobalLoader } from "../index.js"

const COLORS = {
  bgFrom: "#0f1530",
  bgTo: "#1a1330",
  accent: "#e7d0ff",
  sub: "#bfc0e8",
  correct: "#50fa7b",
  wrong: "#ff5555",
};

// Offline fallback questions (50+ STEM questions)
const LOCAL_QUESTIONS = [
  { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "NaCl", "O2"], answer: "H2O" },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: "Mars" },
  { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
  { question: "Which gas do plants use for photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Helium"], answer: "Carbon Dioxide" },
  { question: "What is the center of an atom called?", options: ["Electron", "Proton", "Nucleus", "Neutron"], answer: "Nucleus" },
  { question: "Which force keeps us on the ground?", options: ["Magnetism", "Gravity", "Friction", "Electricity"], answer: "Gravity" },
  { question: "Which organ pumps blood through the body?", options: ["Lungs", "Heart", "Brain", "Kidneys"], answer: "Heart" },
  { question: "What planet is closest to the sun?", options: ["Earth", "Mercury", "Venus", "Mars"], answer: "Mercury" },
  { question: "What is the boiling point of water in Celsius?", options: ["90°C", "100°C", "120°C", "80°C"], answer: "100°C" },
  { question: "Which gas do humans exhale?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], answer: "Carbon Dioxide" },
  { question: "Which planet has rings?", options: ["Mars", "Saturn", "Earth", "Venus"], answer: "Saturn" },
  { question: "The speed of light is approximately?", options: ["3,00,000 km/s", "3,00,000 m/s", "30,000 km/s", "300 km/s"], answer: "3,00,000 km/s" },
  { question: "Which blood cells help fight infections?", options: ["Red Blood Cells", "White Blood Cells", "Platelets", "Plasma"], answer: "White Blood Cells" },
  { question: "Which element has the atomic number 1?", options: ["Oxygen", "Hydrogen", "Helium", "Carbon"], answer: "Hydrogen" },
  { question: "What is the largest planet in our solar system?", options: ["Jupiter", "Saturn", "Earth", "Mars"], answer: "Jupiter" },
  { question: "Which organ is responsible for breathing?", options: ["Heart", "Lungs", "Kidneys", "Liver"], answer: "Lungs" },
  { question: "What is the freezing point of water?", options: ["0°C", "100°C", "-10°C", "32°C"], answer: "0°C" },
  { question: "Which planet is known as the Morning Star?", options: ["Mars", "Venus", "Jupiter", "Mercury"], answer: "Venus" },
  { question: "Which metal is liquid at room temperature?", options: ["Mercury", "Iron", "Gold", "Silver"], answer: "Mercury" },
  { question: "Who developed the theory of relativity?", options: ["Newton", "Einstein", "Galileo", "Tesla"], answer: "Einstein" },
  { question: "What is HCl commonly known as?", options: ["Hydrochloric Acid", "Sulfuric Acid", "Nitric Acid", "Acetic Acid"], answer: "Hydrochloric Acid" },
  { question: "Which gas is essential for breathing?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Oxygen" },
  { question: "What type of energy comes from moving water?", options: ["Solar", "Hydro", "Wind", "Geothermal"], answer: "Hydro" },
  { question: "Which planet is famous for its red color?", options: ["Mars", "Venus", "Jupiter", "Saturn"], answer: "Mars" },
  { question: "The process by which plants make food is called?", options: ["Respiration", "Photosynthesis", "Digestion", "Transpiration"], answer: "Photosynthesis" },
  { question: "What is the symbol for gold?", options: ["Au", "Ag", "Gd", "Go"], answer: "Au" },
  { question: "Which organ stores bile?", options: ["Liver", "Gallbladder", "Kidney", "Pancreas"], answer: "Gallbladder" },
  { question: "Which planet is known for its blue color?", options: ["Earth", "Neptune", "Mars", "Saturn"], answer: "Neptune" },
  { question: "Which type of blood cells carry oxygen?", options: ["White Blood Cells", "Red Blood Cells", "Platelets", "Plasma"], answer: "Red Blood Cells" },
  { question: "What is the pH of water?", options: ["7", "6", "8", "5"], answer: "7" },
  { question: "Which gas is most abundant in the Earth's atmosphere?", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"], answer: "Nitrogen" },
  { question: "Which planet is known as the Gas Giant?", options: ["Jupiter", "Mars", "Earth", "Venus"], answer: "Jupiter" },
  { question: "Which scientist is known as the father of modern physics?", options: ["Newton", "Einstein", "Galileo", "Faraday"], answer: "Newton" },
  { question: "Which part of the cell contains DNA?", options: ["Nucleus", "Mitochondria", "Cytoplasm", "Ribosome"], answer: "Nucleus" },
  { question: "Which gas do plants release during photosynthesis?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], answer: "Oxygen" },
  { question: "The smallest unit of life is?", options: ["Atom", "Molecule", "Cell", "Organ"], answer: "Cell" },
  { question: "What is the process of water changing to vapor?", options: ["Condensation", "Evaporation", "Precipitation", "Transpiration"], answer: "Evaporation" },
  { question: "Which planet has the shortest day?", options: ["Jupiter", "Earth", "Mars", "Venus"], answer: "Jupiter" },
  { question: "Which organ detoxifies chemicals in the body?", options: ["Kidney", "Liver", "Heart", "Lungs"], answer: "Liver" },
  { question: "Which force opposes motion?", options: ["Gravity", "Friction", "Magnetism", "Electricity"], answer: "Friction" },
  { question: "Which planet has the most moons?", options: ["Saturn", "Jupiter", "Earth", "Mars"], answer: "Saturn" },
  { question: "Which vitamin is produced when sunlight hits our skin?", options: ["Vitamin A", "Vitamin B", "Vitamin C", "Vitamin D"], answer: "Vitamin D" },
  { question: "The study of living organisms is called?", options: ["Physics", "Biology", "Chemistry", "Geology"], answer: "Biology" },
  { question: "Which is the hardest natural substance?", options: ["Gold", "Iron", "Diamond", "Silver"], answer: "Diamond" },
  { question: "Which planet spins on its side?", options: ["Uranus", "Neptune", "Mars", "Earth"], answer: "Uranus" },
  { question: "Which energy source is renewable?", options: ["Coal", "Oil", "Wind", "Natural Gas"], answer: "Wind" },
  { question: "Which organ produces insulin?", options: ["Pancreas", "Liver", "Kidney", "Heart"], answer: "Pancreas" },
  { question: "The chemical formula of table salt is?", options: ["NaCl", "KCl", "CaCO3", "H2O"], answer: "NaCl" },
  { question: "Which planet is known for its Great Red Spot?", options: ["Mars", "Jupiter", "Saturn", "Venus"], answer: "Jupiter" },
  { question: "What type of bond is formed when electrons are shared?", options: ["Ionic", "Covalent", "Metallic", "Hydrogen"], answer: "Covalent" },
  { question: "Which gas is used in balloons to make them float?", options: ["Oxygen", "Helium", "Nitrogen", "Hydrogen"], answer: "Helium" },
  { question: "Which organ controls the nervous system?", options: ["Heart", "Brain", "Lungs", "Kidneys"], answer: "Brain" },
];

export default function QuizPage({ apiUrl = "https://opentdb.com/api.php?amount=10" }) {
  const [questions, setQuestions] = useState(LOCAL_QUESTIONS);
  const [loading, setLoading] = useState(!!apiUrl);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (apiUrl) {
      axios.get(apiUrl)
        .then(res => setQuestions(res.data))
        .catch(err => console.error("API fetch failed, using offline questions.", err))
        .finally(() => setLoading(false));
    }
  }, [apiUrl]);

  const handleSelect = (option) => {
    setSelected(option);
    const isCorrect = option === questions[currentIndex].answer;
    if (isCorrect) setScore(score + 1);
    setFeedback(isCorrect ? 'correct' : 'wrong');

    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
      setCurrentIndex(prev => prev + 1);
    }, 1200);
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setScore(0);
    setSelected(null);
    setFeedback(null);
  };

  if (loading) return <GlobalLoader />;
  if (currentIndex >= questions.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${COLORS.bgFrom}, ${COLORS.bgTo})` }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-opacity-30 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/10 flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold" style={{ color: COLORS.accent }}>Quiz Completed!</h1>
        <p className="text-lg font-semibold" style={{ color: COLORS.sub }}>Your Score: {score} / {questions.length}</p>
        <button onClick={resetQuiz} className="px-6 py-3 rounded-xl border border-white/20 bg-gradient-to-r from-[#7f5af0]/20 to-[#ff6fd8]/20 hover:scale-105 transition-transform" style={{ color: COLORS.accent }}>
          <RefreshCw size={16} /> Restart
        </button>
      </motion.div>
    </div>
  );

  const q = questions[currentIndex];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${COLORS.bgFrom}, ${COLORS.bgTo})` }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        <div className="bg-opacity-30 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/10 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold" style={{ color: COLORS.accent }}>Question {currentIndex + 1} / 100</h2>
            <div className="text-sm font-semibold" style={{ color: COLORS.accent }}>Score: {score}</div>
          </div>
          <p className="text-lg md:text-xl font-medium" style={{ color: COLORS.sub }}>{q.question}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {q.options.map(option => {
              const isSelected = selected === option;
              let bg = 'bg-white/10';
              if (feedback && isSelected) bg = feedback === 'correct' ? COLORS.correct : COLORS.wrong;
              return (
                <motion.button key={option} onClick={() => handleSelect(option)} whileTap={{ scale: 0.95 }} className={`p-4 rounded-xl border border-white/10 text-left font-medium hover:scale-105 transition-transform`} style={{ background: bg, color: COLORS.accent }}>
                  {option}
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}