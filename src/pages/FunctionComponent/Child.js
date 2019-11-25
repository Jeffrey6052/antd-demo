import React, {
    useState,
    useContext,
    useRef,
    useImperativeHandle,
    forwardRef,
    useEffect
} from "react"

import { Context } from "./gameBoardContext"

const inspect = require('object-inspect')

const Child = (props, ref) => {
    const [name, setName] = useState("jeffrey")
    const [age, setAge] = useState(30)
    const [app3d, setApp3d] = useState({
        scene: null,
        renderer: null,
        camera: null,
        controls: null
    })

    const ctxValue = useContext(Context)

    const inputRef = useRef()
    const frameRef = useRef()
    const ageRef = useRef()

    useImperativeHandle(ref, () => ({
        changeVal: (newVal) => {
            const dom = inputRef.current

            dom.value = newVal
            dom.focus()
        }
    }))

    useEffect(() => {
        ageRef.current = age
    }, [age])

    useEffect(() => {
        frameRef.current = requestAnimationFrame(animate)
    }, [])

    const render3d = (age) => {
        console.log("render3d", age)
    }

    const animate = () => {
        frameRef.current = requestAnimationFrame(animate)
        render3d(ageRef.current)
    }

    const cleanInput = () => {
        const dom = inputRef.current

        dom.value = ""
        dom.focus()
    }

    return (
        <div>

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

            <div className="demo-button">
                <input ref={inputRef} type="text" />
                <button type="button" onClick={() => cleanInput()} style={{ marginLeft: 4 }}>Clear</button>
            </div>
        </div>
    )
}

export default forwardRef(Child)
