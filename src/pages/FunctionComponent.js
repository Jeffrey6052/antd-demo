import React, { useState, useEffect } from "react"
import Layout from "../components/Layout"

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

    useEffect(
        () => {
            // console.log(`props.color effect active. ${inspect(props.color)}`)

            return () => {
                // console.log(`props.color effect leave. ${inspect(props.color)}`)
            };
        },
        [props.color],
    );

    useEffect(
        () => {
            // console.log(`age effect active. ${age}`)

            return () => {
                // console.log(`age effect leave. ${age}`)
            };
        },
        [age],
    );

    useEffect(
        () => {
            // console.log(`name effect active. ${name}`)

            return () => {
                // console.log(`name effect leave. ${name}`)
            };
        },
        [name],
    );

    return (
        <Layout>

            <h1>name = {inspect(name)}</h1>
            <p>age = {inspect(age)}</p>
            <p>props.color = {inspect(props.color)}</p>

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

        </Layout>
    )
}