import React from "react";
import { FeaturesCard, Button } from "../index.js"

const Home = () => {
    return (
        <div className="bg-gradient-to-br from-gray-900 via-indigo-950 to-violet-900 text-gray-100 min-h-screen flex flex-col justify-center pt-20 sm:pt-0">
            {/* Hero Section */}
            <section className="pt-28 pb-16 px-6 text-center max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-6xl font-extrabold text-indigo-400 mb-6 drop-shadow-lg w-full">
                    Learn Smarter, Play Harder 🎮
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                    A gamified platform to make STEM learning fun, interactive, and meaningful for every student.
                </p>
                <div>
                    <Button route={"/game"} />
                </div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-6 max-w-7xl mx-auto pb-16">
                <div>
                    <FeaturesCard
                        title="Dashboard"
                        description="Track your progress and achievements in real-time."
                    />
                </div>
                <div>
                    <FeaturesCard
                        title="Games"
                        description="Play interactive games that boost your STEM skills."
                    />
                </div>
                <div>
                    <FeaturesCard
                        title="Quizzes"
                        description="Challenge yourself with fun, timed quizzes."
                    />
                </div>
                <div>
                    <FeaturesCard
                        title="Clean Environment"
                        description="Learn eco-friendly habits while having fun!"
                    />
                </div>
            </section>
        </div>
    );
};

export default Home;
