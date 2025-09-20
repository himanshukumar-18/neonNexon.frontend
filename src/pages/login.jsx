import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { loginUser } from "../features/auth/loginSlice";
import { GlobalLoader } from "../index.js"
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error, success, user } = useSelector((state) => state.auth);

    const [form, setForm] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(form));
        navigate("/");
    };

    useEffect(() => {
        if (success && user) {
            alert(`🎉 Welcome back, ${user.name}!`);
        }
    }, [success, user, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] text-white px-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-indigo-400 to-violet-500 bg-clip-text text-transparent">
                    Welcome Back 👋
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg bg-gray-900/70 border border-white/20 focus:ring-2 focus:ring-indigo-400 outline-none"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 py-2 rounded-lg font-semibold shadow-lg transition"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}
                </form>

                <p className="text-center text-gray-300 mt-6">
                    Don’t have an account?{" "}
                    <a href="/register" className="text-indigo-400 hover:underline">
                        Register
                    </a>
                </p>
            </div>


        {
            loading && (
                <GlobalLoader />
            )
        }
        </div>
    );
}
