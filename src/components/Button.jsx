import React from 'react'
import { Link } from 'react-router-dom'

const Button = ({ route }) => {
    return (
        <>
            <Link
                to={route}
                className="px-6 py-3 rounded-xl font-medium text-white 
             bg-white/10 backdrop-blur-md border border-white/20 
             hover:bg-white/20 hover:border-white/30 
             transition-all duration-300"
            >
                Get Started
            </Link>
        </>
    )
}

export default Button
