
import React, { useState, useEffect } from "react"
import FunctionComponent from "./FunctionComponent"

export default () => {
    const [color, setColor] = useState(10000)

    useEffect(() => {

        // console.log("Outer Effect active")

        const timer = window.setInterval(() => {
            setColor(prevColor => prevColor + 1)
        }, 1000)

        return () => {
            // console.log("Outer Effect leave")
            window.clearInterval(timer)
        }
    }, [])

    return (
        <FunctionComponent color={color} />
    )

}