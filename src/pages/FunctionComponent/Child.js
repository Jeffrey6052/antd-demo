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

    const ctxValue = useContext(Context)

    const inputRef = useRef()
    const frameRef = useRef()

    useImperativeHandle(ref, () => ({
        changeVal: (newVal) => {
            const dom = inputRef.current

            dom.value = newVal
            // dom.focus()

            setName(`${newVal}`)
        }
    }))


    useEffect(() => {

        let animate3d = () => {
            frameRef.current = requestAnimationFrame(() => animate3d(age))
            render3d()
        }

        let render3d = () => {
            console.log("render3d", age)
        }

        animate3d()

        return () => {
            cancelAnimationFrame(frameRef.current)
        }
    }, [age])

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
