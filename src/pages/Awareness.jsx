// Awareness.jsx
import React from "react";

const Awareness = () => {
  const topics = [
    {
      title: "🌱 Environment",
      desc: "Learn how small actions like reducing plastic use and planting trees make a big impact.",
      color: "from-green-400 to-emerald-600",
    },
    {
      title: "💻 Cyber Safety",
      desc: "Stay safe online by using strong passwords, avoiding scams, and respecting digital privacy.",
      color: "from-blue-400 to-indigo-600",
    },
    {
      title: "🧠 Mental Health",
      desc: "Understand the importance of stress management, good sleep, and talking about your feelings.",
      color: "from-purple-400 to-pink-600",
    },
    {
      title: "🍎 Healthy Habits",
      desc: "Adopt practical daily habits like drinking water, eating fruits, and staying active.",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-6 pt-50">
      <h1 className="text-indigo-300 text-3xl font-bold mb-6 text-center">
        🌟 Awareness Zone
      </h1>
      <p className="text-indigo-200 text-lg mb-10 text-center">
        Practical knowledge to help you stay aware, safe, and responsible in everyday life.
      </p>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {topics.map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 shadow-lg bg-gradient-to-r ${item.color} text-white hover:scale-105 transform transition-all duration-300`}
            >
              <h2 className="text-2xl font-semibold mb-2">{item.title}</h2>
              <p className="text-lg opacity-90">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Tip Section */}
        <div className="mt-10 bg-white/10 backdrop-blur-lg border border-purple-400/20 rounded-2xl p-6 text-center text-indigo-200">
          <h2 className="text-xl font-semibold mb-2">💡 Daily Awareness Tip</h2>
          <p>
            “Turn off lights and fans when not in use — it saves energy and helps
            the planet 🌍”
          </p>
        </div>
      </div>
    </div>
  );
};

export default Awareness;
