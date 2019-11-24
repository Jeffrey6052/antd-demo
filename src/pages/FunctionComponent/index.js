
import React, {
    useState,
    useEffect,
    useReducer,
    useCallback,
    useMemo,
    useRef
} from "react"

import Layout from "../../components/Layout"

import Child from "./Child"

import { Context, Reducer, DefaultState, getGameResult } from "./gameBoardContext"

const inspect = require('object-inspect')

export default () => {
    const [color, setColor] = useState(10000)

    const [gameBoard, dispatch] = useReducer(Reducer, DefaultState)

    const gameResultCB = useCallback(getGameResult.bind(this, gameBoard, "callback"), [gameBoard])

    const gameResultMemo = useMemo(() => getGameResult(gameBoard, "memo"), [gameBoard])

    const childRef = useRef()

    useEffect(() => {
        const timer = window.setInterval(() => {
            setColor(prevColor => prevColor + 1)
        }, 1000)

        return () => {
            window.clearInterval(timer)
        }
    }, [])

    const addScore = (team) => {
        dispatch({
            type: "updateScore",
            team: team,
            score: 1
        })
    }

    const updateChildState = () => {
        if (!childRef.current) {
            return
        }

        childRef.current.changeVal(Date.now())
    }

    return (
        <Layout>
            <Context.Provider value={gameBoard}>
                <h2> Index Component</h2>
                <p>gameBoard = {inspect(gameBoard)}</p>
                <p>gameResultCB() = {inspect(gameResultCB())}</p>
                <p>gameResultMemo = {inspect(gameResultMemo)}</p>
                <p>color = {inspect(color)}</p>

                <div>
                    <span className="demo-button">
                        <button type="button" onClick={() => addScore("A")}>scoreA + 1</button>
                    </span>
                    <span className="demo-button">
                        <button type="button" onClick={() => addScore("B")}>scoreB + 1</button>
                    </span>
                    <span className="demo-button">
                        <button type="button" onClick={() => updateChildState()}>修改子组件input值</button>
                    </span>
                </div>
                <hr />
                <Child color={color} addScore={addScore} ref={childRef} />
            </Context.Provider>
        </Layout>
    )
}
