// InfiniteSlider.jsx
import React, { useEffect, useRef } from "react";

const Welcome = () => {
    const sliderRef = useRef(null);
    const positionRef = useRef(0);
    const speed = 1; // Pixels per frame

    const message = "🚀 Welcome to NeonNexus! Play games, take quizzes, and learn STEM in a fun way! 🌟 ";

    useEffect(() => {
        const slider = sliderRef.current;
        if (!slider) return;

        // Duplicate content for seamless scrolling
        slider.innerHTML += slider.innerHTML;

        let animationFrameId;

        const animate = () => {
            positionRef.current -= speed;

            // Reset position when half of the scroll width is passed
            if (positionRef.current <= -slider.scrollWidth / 2) {
                positionRef.current = 0;
            }

            slider.style.transform = `translateX(${positionRef.current}px)`;
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationFrameId);
    }, []);

    return (
        <div
            style={{
                overflow: "hidden",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(8px)",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                width: "100%",
            }}
        >
            <div
            className="py-2"
                id="slider"
                ref={sliderRef}
                style={{
                    display: "inline-block",
                    whiteSpace: "nowrap",
                }}
            >
                <span
                    style={{
                        fontWeight: "bold",
                        fontSize: ".9rem",
                        color: "white",
                        paddingRight: "50px",
                    }}
                >
                    {message}
                </span>
            </div>
        </div>
    );
};

export default Welcome;
