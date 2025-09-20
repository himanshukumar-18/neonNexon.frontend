// Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Reusable Card
const Card = ({ children }) => (
  <div className="bg-[#0f172a]/60 backdrop-blur-lg border border-purple-400/20 shadow-xl rounded-2xl w-full">
    {children}
  </div>
);

const CardContent = ({ children }) => (
  <div className="p-6">{children}</div>
);

const Dashboard = () => {
  const [data, setData] = useState([]);

  // Real-time chart updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) => {
        const newPoint = {
          time: new Date().toLocaleTimeString().slice(3, 8),
          value: Math.floor(Math.random() * 100) + 20,
        };
        return [...prev.slice(-9), newPoint]; // Keep last 10
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-50 w-full bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#312e81] p-6">
      <h1 className="text-indigo-300 text-3xl font-bold mb-6 text-center">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {/* Active Users */}
        <Card>
          <CardContent>
            <h2 className="text-indigo-200 text-xl font-semibold">
              Active Users
            </h2>
            <p className="text-4xl font-bold text-green-400 mt-4">
              {Math.floor(Math.random() * 500) + 100}
            </p>
          </CardContent>
        </Card>

        {/* Quizzes Completed */}
        <Card>
          <CardContent>
            <h2 className="text-indigo-200 text-xl font-semibold">
              Quizzes Completed
            </h2>
            <p className="text-4xl font-bold text-yellow-400 mt-4">
              {Math.floor(Math.random() * 2000) + 500}
            </p>
          </CardContent>
        </Card>

        {/* Games Played */}
        <Card>
          <CardContent>
            <h2 className="text-indigo-200 text-xl font-semibold">
              Games Played
            </h2>
            <p className="text-4xl font-bold text-pink-400 mt-4">
              {Math.floor(Math.random() * 1500) + 200}
            </p>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card className="md:col-span-2 lg:col-span-3">
          <CardContent>
            <h2 className="text-indigo-200 text-xl font-semibold mb-4">
              Live Engagement
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <XAxis dataKey="time" stroke="#a5b4fc" />
                <YAxis stroke="#a5b4fc" />
                <Tooltip
                  contentStyle={{
                    background: "rgba(30, 41, 59, 0.8)",
                    borderRadius: "12px",
                    border: "1px solid #6366f1",
                  }}
                  labelStyle={{ color: "#e0e7ff" }}
                  itemStyle={{ color: "#facc15" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#f472b6"
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
