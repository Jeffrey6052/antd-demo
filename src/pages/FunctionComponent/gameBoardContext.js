
import React from "react"

export const Context = React.createContext()

export const DefaultState = {
    scoreA: 0,
    scoreB: 0
}

function updateScore(state, team, score) {
    const validTeams = new Set(["A", "B"])
    if (!validTeams.has(team)) {
        return
    }

    const scoreKey = `score${team}`

    return {
        ...state,
        [scoreKey]: state[scoreKey] + score
    }
}

export function getGameResult(state, flag) {
    // console.log("getGameResult with flag", flag)
    if (state.scoreA > state.scoreB) {
        return "A Win"
    } else if (state.scoreA < state.scoreB) {
        return "B Win"
    } else {
        return "Draw"
    }
}

export function Reducer(state, action) {
    switch (action.type) {
        case 'updateScore':
            return updateScore(state, action.team, action.score)
        default:
            return state
    }
}