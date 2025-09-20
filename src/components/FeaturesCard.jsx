import React from 'react'

const FeaturesCard = ({title, description}) => {
    return (
        <>
            <div className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-xl duration-150 hover:scale-105 transition">
                <h3 className="text-xl font-semibold text-indigo-400">{title}</h3>
                <p className="text-gray-300 mt-2">
                    {description}
                </p>
            </div>
        </>
    )
}

export default FeaturesCard

// Dashboard
// Track your progress and achievements in real-time.