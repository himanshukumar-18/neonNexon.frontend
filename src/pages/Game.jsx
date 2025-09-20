import { useState } from "react"
import { motion } from "framer-motion"

export default function Game() {
  const [quizResult, setQuizResult] = useState(null)

  const checkAnswer = (answer) => {
    setQuizResult(answer === "Gravity" ? "✅ Correct! 🚀" : "❌ Try Again")
  }

  return (
    <div className="min-h-screen py-50 bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white p-8">
      <h1 className="text-4xl font-bold text-center text-purple-400 mb-12">
        🎮 Fun Learning Games
      </h1>

      {/* Card Grid */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {/* Flashcards */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-purple-600 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              Flashcards 🔥
            </h2>
            <p className="flex-grow">
              Memorize STEM terms using fun flashcards. Flip and learn with ease!
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 transition w-full">
              Start Flashcards
            </button>
          </div>
        </motion.div>

        {/* Puzzle */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-pink-600 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-pink-400 mb-4">
              STEM Puzzle 🧩
            </h2>
            <p className="flex-grow">
              Drag & drop periodic elements into correct order. Challenge your logic!
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 transition w-full">
              Play Puzzle
            </button>
          </div>
        </motion.div>

        {/* Math Challenge */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-yellow-500 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
              Math Challenge ➕
            </h2>
            <p className="flex-grow">
              Solve fast-paced math problems to boost your calculation speed.
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition w-full">
              Start Math Game
            </button>
          </div>
        </motion.div>

        {/* Word Builder */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-blue-500 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">
              Word Builder 🔠
            </h2>
            <p className="flex-grow">
              Rearrange letters to form science-related words.
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition w-full">
              Play Word Builder
            </button>
          </div>
        </motion.div>

        {/* Coding Puzzle */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-green-500 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-green-400 mb-4">
              Coding Puzzle 💻
            </h2>
            <p className="flex-grow">
              Arrange scrambled code blocks to make a working program.
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 transition w-full">
              Play Coding Puzzle
            </button>
          </div>
        </motion.div>

        {/* Memory Match */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-pink-500 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-pink-400 mb-4">
              Memory Match 🧠
            </h2>
            <p className="flex-grow">
              Match pairs of STEM symbols and boost your memory skills.
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 transition w-full">
              Start Memory Match
            </button>
          </div>
        </motion.div>

        {/* Science Explorer */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-red-500 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-red-400 mb-4">
              Science Explorer 🔬
            </h2>
            <p className="flex-grow">
              Explore fun science facts with interactive mini-games.
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition w-full">
              Explore Science
            </button>
          </div>
        </motion.div>

        {/* NEW: Word Search */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-purple-500 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">
              Word Search 🔍
            </h2>
            <p className="flex-grow">
              Find hidden STEM words in a grid and sharpen your vocabulary.
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-purple-500 hover:bg-purple-600 transition w-full">
              Start Word Search
            </button>
          </div>
        </motion.div>

        {/* NEW: Shape Builder */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div className="rounded-2xl bg-[#1e293b]/80 border border-cyan-500 shadow-xl p-6 flex flex-col justify-between h-full">
            <h2 className="text-2xl font-semibold text-cyan-400 mb-4">
              Shape Builder 🔷
            </h2>
            <p className="flex-grow">
              Drag and drop blocks to build correct geometric shapes.
            </p>
            <button className="mt-6 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition w-full">
              Play Shape Builder
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}
