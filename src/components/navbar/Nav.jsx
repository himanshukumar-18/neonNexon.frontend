import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Welcome, Button } from "../../index.js"
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/loginSlice.js";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth.login);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loginUser())
    }, [])

     const handleLogout = () => {
        dispatch({ type: 'login/logout' }); 
        navigate('/');
    };

    return (
        <nav className="fixed w-full top-0 z-50">
            <Welcome />
            <div className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    {/* Logo */}
                    <NavLink
                        to="/"
                        className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent"
                    >
                        NeonNexus
                    </NavLink>

                    {/* Desktop Links */}
                    <ul className="hidden md:flex space-x-8 font-medium text-gray-200">
                        {[
                            { name: "Home", path: "/" },
                            { name: "Dashboard", path: "/dashboard" },
                            { name: "Game", path: "/game" },
                            { name: "Quiz", path: "/quiz" },
                            { name: "Awareness", path: "/awareness" },
                        ].map((item) => (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `px-2 py-1 rounded-md transition ${isActive
                                            ? "text-indigo-300 font-semibold border-b-2 border-indigo-400"
                                            : "hover:text-indigo-300"
                                        }`
                                    }
                                >
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>

                    {/* Auth Buttons (Desktop) */}
                    {
                            user ? (
                                <div className="hidden md:flex items-center space-x-4">
                                    <span className="text-gray-200">Hello 👋, {user.name}</span>
                                     <button
                            onClick={handleLogout}
                            className="bg-red-500 px-4 py-1 rounded hover:bg-red-600 transition"
                        >
                            Logout
                        </button>
                                </div>
                            ) : (
                                <div className="hidden md:flex items-center space-x-4">
                        <NavLink
                            to="/login"
                            className="px-4 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-700 text-white text-sm font-medium shadow-md transition"
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/register"
                            className="px-4 py-2 rounded-lg bg-pink-600/80 hover:bg-pink-700 text-white text-sm font-medium shadow-md transition"
                        >
                            Register
                        </NavLink>
                    </div>
                            )
                    }

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-gray-200 text-2xl focus:outline-none"
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? "✕" : "☰"}
                    </button>
                </div>

                {/* Mobile Dropdown */}
                {menuOpen && (
                    <div className="md:hidden px-6 pb-4 backdrop-blur-lg bg-black/30 border-t border-white/20">
                        <ul className="space-y-3 font-medium text-gray-200">
                            {[
                                { name: "Home", path: "/" },
                                { name: "Dashboard", path: "/dashboard" },
                                { name: "Game", path: "/game" },
                                { name: "Quiz", path: "/quiz" },
                                { name: "Awareness", path: "/awareness" },
                            ].map((item) => (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `block px-3 py-2 rounded-lg transition ${isActive
                                                ? "bg-indigo-600/40 text-indigo-200"
                                                : "hover:bg-white/10 hover:text-indigo-300"
                                            }`
                                        }
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4 flex flex-col space-y-2 border-t border-white/20 pt-4">
                            <NavLink
                                to="/login"
                                className="px-3 py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-700 text-white text-sm font-medium text-center shadow-md transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                Login
                            </NavLink>
                            <NavLink
                                to="/register"
                                className="px-3 py-2 rounded-lg bg-pink-600/80 hover:bg-pink-700 text-white text-sm font-medium text-center shadow-md transition"
                                onClick={() => setMenuOpen(false)}
                            >
                                Register
                            </NavLink>
                        </div>
                    </div>
                )}
            </div>
        </nav>

    );
};

export default Navbar;
