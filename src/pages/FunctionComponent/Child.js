import React, { useState, useContext } from "react"
import Layout from "../../components/Layout"
import { Context } from "./gameBoardContext"

const inspect = require('object-inspect')

export default (props) => {
    const [name, setName] = useState("jeffrey")
    const [age, setAge] = useState(30)
    const [app3d, setApp3d] = useState({
        scene: null,
        renderer: null,
        camera: null,
        controls: null
    })

    const ctxValue = useContext(Context)

    return (
        <Layout>

            <h2>Child Component</h2>

            <p>gameBoard = {inspect(ctxValue)}</p>
            <p>props.color = {inspect(props.color)}</p>
            <p>name = {inspect(name)}</p>
            <p>age = {inspect(age)}</p>

            <div>
                <span className="demo-button">
                    <button type="button" onClick={() => setName("Jeffrey")}>Jeffrey</button>
                </span>
                <span className="demo-button">
                    <button type="button" onClick={() => setName("May")}>May</button>
                </span>
                <span className="demo-button">
                    <button type="button" onClick={() => setName("Peter")}>Peter</button>
                </span>
            </div>

            <div>
                <span className="demo-button">
                    <button type="button" onClick={() => setAge(10)}>年龄=10</button>
                </span>
                <span className="demo-button">
                    <button type="button" onClick={() => setAge(prevAge => prevAge + 1)}>年龄+1</button>
                </span>
                <span className="demo-button">
                    <button type="button" onClick={() => setAge(prevAge => prevAge - 1)}>年龄-1</button>
                </span>
            </div>

            <div>
                <span className="demo-button">
                    <button type="button" onClick={() => props.addScore("A")}>scoreA + 1</button>
                </span>
                <span className="demo-button">
                    <button type="button" onClick={() => props.addScore("B")}>scoreB + 1</button>
                </span>
            </div>

        </Layout>
    )
}