
import React from "react"
import PropTypes from 'prop-types'

import WebMakerContext from "./context"
import { EditorMode } from "./constants"

import WebMakerLayout from "./layout"

class WebMaker extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            mode: props.mode,
            width: props.width,
            height: props.height,
            backgroundColor: props.backgroundColor,
            meshes: props.meshes
        }

        this.clock = 0
        this.timer = null
    }

    componentDidMount() {
        this.startAnimation()
    }

    componentWillUnmount() {
        this.stopAnimation()
    }

    startAnimation(){
        this.timer = window.setInterval(() => {

            this.setState({
                width: 1024 + Math.sin(this.clock * 0.01) * 100,
                height: 768 + Math.sin(this.clock * 0.01) * 100
            })

            this.clock += 1
        }, 50)
    }

    stopAnimation(){
        window.clearInterval(this.timer)
    }

    render() {

        const { mode, width, height, backgroundColor, meshes } = this.state

        const contextValue = {
            mode,
            width,
            height,
            backgroundColor,
            meshes
        }

        return (
            <WebMakerContext.Provider value={contextValue}>
                <WebMakerLayout />
            </WebMakerContext.Provider>
        )
    }

}

WebMaker.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    mode: PropTypes.oneOf([EditorMode.Writeable, EditorMode.ReadOnly]).isRequired,
    meshes: PropTypes.arrayOf(PropTypes.object).isRequired
}

export {
    EditorMode
}

export default WebMaker