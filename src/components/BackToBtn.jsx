import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
    const [visible, setVisible] = useState(false);

    // Show button when scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setVisible(true);
            } else {
                setVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    // Scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        visible && (
            <button
                onClick={scrollToTop}
                className="fixed bottom-6 right-6 p-3 rounded-2xl backdrop-blur-md 
                   bg-white/10 border border-white/20 shadow-lg 
                   hover:bg-indigo-500/30 hover:scale-110 
                   text-indigo-300 transition transform duration-300 
                   flex items-center justify-center z-10"
            >
                <ArrowUp className="w-6 h-6" />
            </button>
        )
    );
}

