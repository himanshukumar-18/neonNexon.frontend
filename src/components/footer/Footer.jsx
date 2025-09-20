import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="bg-gradient-to-b from-[#0f172a] via-[#1e1b4b] to-[#3b0764] bg-opacity-90 backdrop-blur-md text-gray-300 py-10 px-6 md:px-20">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

                {/* About */}
                <div>
                    <h2 className="text-xl font-bold text-purple-400 mb-4">NeonNexus</h2>
                    <p className="text-sm leading-relaxed text-gray-400">
                        Making STEM learning fun, interactive, and meaningful
                        through games, quizzes, and awareness programs.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><a href="/" className="hover:text-purple-400 transition">Home</a></li>
                        <li><a href="/dashboard" className="hover:text-purple-400 transition">Dashboard</a></li>
                        <li><a href="/game" className="hover:text-purple-400 transition">Game</a></li>
                        <li><a href="/quiz" className="hover:text-purple-400 transition">Quiz</a></li>
                        <li><a href="/awareness" className="hover:text-purple-400 transition">Awareness</a></li>
                    </ul>
                </div>

                {/* Connect */}
                <div>
                    <h3 className="text-lg font-semibold text-purple-300 mb-4">Connect</h3>
                    <ul className="space-y-2">
                        <li><a href="mailto:info@gamifylearn.com" className="hover:text-purple-400 transition">info@gamifylearn.com</a></li>
                        <li><a href="#" className="hover:text-purple-400 transition">Twitter</a></li>
                        <li><a href="#" className="hover:text-purple-400 transition">LinkedIn</a></li>
                        <li><a href="#" className="hover:text-purple-400 transition">Instagram</a></li>
                    </ul>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-10 border-t border-purple-900/40 pt-6 text-center text-sm text-gray-400">
                © 2025 NeonNexus. All rights reserved.
            </div>
        </footer>


    );
};

export default Footer;
