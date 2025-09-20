import { useState, useEffect } from "react"
import { motion } from "framer-motion"


const quizData = [
  { q: "What is H2O commonly known as?", a: "Water", options: ["Oxygen", "Water", "Hydrogen", "Helium"], level: "easy" },
  { q: "Who proposed the theory of relativity?", a: "Albert Einstein", options: ["Isaac Newton", "Galileo", "Albert Einstein", "Nikola Tesla"], level: "medium" },
  { q: "What is the chemical symbol for Gold?", a: "Au", options: ["Ag", "Go", "Au", "Gd"], level: "easy" },
  { q: "Which planet is known as the Red Planet?", a: "Mars", options: ["Earth", "Jupiter", "Mars", "Venus"], level: "easy" },
  { q: "What is the square root of 256?", a: "16", options: ["14", "15", "16", "18"], level: "medium" },
  { q: "Which gas is essential for photosynthesis?", a: "Carbon Dioxide", options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], level: "easy" },
  { q: "What is the hardest natural substance on Earth?", a: "Diamond", options: ["Iron", "Diamond", "Quartz", "Graphite"], level: "hard" },
  { q: "What is the powerhouse of the cell?", a: "Mitochondria", options: ["Nucleus", "Chloroplast", "Mitochondria", "Ribosome"], level: "easy" },
  // 👉 add 100+ mixed questions here
]

// ✅ Shuffle function
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5)
}

export default function Quiz() {
  const [questions, setQuestions] = useState([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)

  // ✅ Generate daily random quiz
  useEffect(() => {
    const today = new Date().toDateString()
    const seed = today.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const shuffled = shuffleArray([...quizData])
    const dailyQuiz = shuffled.slice(0, 10)
    setQuestions(dailyQuiz)
  }, [])

  const handleAnswer = (option) => {
    setSelected(option)
    if (option === questions[currentQ].a) {
      setScore(score + 1)
    }
  }

  const nextQuestion = () => {
    setSelected(null)
    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    }
  }

  return (
    <div className="min-h-screen justify-center bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-purple-400 mb-6">📚 Daily Quiz</h1>

      {questions.length > 0 ? (
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl rounded-2xl bg-[#1e293b]/80 border border-purple-600 shadow-xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4">
            Q{currentQ + 1}. {questions[currentQ].q}
          </h2>

          <div className="grid gap-3">
            {questions[currentQ].options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`px-4 py-3 rounded-xl transition w-full text-left ${selected
                  ? option === questions[currentQ].a
                    ? "bg-green-600"
                    : option === selected
                      ? "bg-red-600"
                      : "bg-[#334155]"
                  : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selected && (
            <div className="mt-6 flex justify-between items-center">
              <span className="text-lg font-bold">
                {selected === questions[currentQ].a ? "✅ Correct!" : "❌ Wrong!"}
              </span>
              <button
                onClick={nextQuestion}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-xl"
              >
                {currentQ === questions.length - 1 ? "Finish" : "Next →"}
              </button>
            </div>
          )}
        </motion.div>
      ) : (
        <p>Loading questions...</p>
      )}

      {/* Score */}
      {currentQ === questions.length - 1 && selected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 text-2xl font-bold text-green-400"
        >
          🎉 You scored {score}/{questions.length}
        </motion.div>
      )}
    </div>
  )
}
