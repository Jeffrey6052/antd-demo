
import React, { useState, useEffect, useReducer, useCallback, useMemo, useRef } from "react"
import Child from "./Child"

import { Context, Reducer, DefaultState, getGameResult } from "./gameBoardContext"

const inspect = require('object-inspect')

export default () => {
    const [color, setColor] = useState(10000)

    const [gameBoard, dispatch] = useReducer(Reducer, DefaultState)

    const gameResultCB = useCallback(getGameResult.bind(this, gameBoard, "callback"), [gameBoard])

    const gameResultMemo = useMemo(() => getGameResult(gameBoard, "memo"), [gameBoard])

    const inputEl = useRef(null)

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

    const cleanInput = () => {
        const dom = inputEl.current

        console.log(dom)
        dom.focus()
        dom.value = ""
    }

    return (
        <div>
            <Context.Provider value={gameBoard}>
                <h2> Index Component</h2>
                <p>gameBoard = {inspect(gameBoard)}</p>
                <p>gameResultCB() = {inspect(gameResultCB())}</p>
                <p>gameResultMemo = {inspect(gameResultMemo)}</p>
                <p>color = {inspect(color)}</p>

                <div className="demo-button">
                    <input ref={inputEl} type="text" />
                    <button type="button" onClick={() => cleanInput()} style={{ marginLeft: 4 }}>Clear</button>
                </div>

                <div>
                    <span className="demo-button">
                        <button type="button" onClick={() => addScore("A")}>scoreA + 1</button>
                    </span>
                    <span className="demo-button">
                        <button type="button" onClick={() => addScore("B")}>scoreB + 1</button>
                    </span>
                </div>
                <hr />
                <Child color={color} addScore={addScore} />
            </Context.Provider>
        </div >
    )
}
