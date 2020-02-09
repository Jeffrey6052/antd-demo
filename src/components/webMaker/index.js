
import React from "react"
import lodash from "lodash"
import crypto from 'crypto'
import PropTypes from 'prop-types'

import WebMakerContext from "./context"
import { EditorMode } from "./constants"

import WebMakerLayout from "./layout"

import { getComponent, ComponentKeys } from "./componentLoader"

class WebMaker extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            mode: props.mode,
            width: props.width,
            height: props.height,
            backgroundColor: props.backgroundColor,
            meshes: props.defaultMeshes || [],
            selectedMeshes: new Set([])
        }

        this.addMesh = this.addMesh.bind(this)
        this.setMeshes = this.setMeshes.bind(this)

        this.setSelectedMeshes = this.setSelectedMeshes.bind(this)
        this.addSelectedMeshes = this.addSelectedMeshes.bind(this)
        this.deleteSelectedMeshes = this.deleteSelectedMeshes.bind(this)
        this.setBackgroundColor = this.setBackgroundColor.bind(this)
        this.setStageSize = this.setStageSize.bind(this)

        this.clock = 0
        this.timer = null
    }

    componentDidMount() {

        window.setTimeout(() => {
            this.setRandomMeshes(50)
        }, 10)

        // this.startAnimation()
    }

    componentWillUnmount() {
        // this.stopAnimation()
    }

    setRandomMeshes(num) {

        const { width, height } = this.state

        const meshes = []

        for (let i = 0; i < num; i++) {
            const componentKey = lodash.sample(ComponentKeys)
            const sampleX = Math.round(width * Math.random())
            const sampleY = Math.round(height * Math.random())

            const newMesh = this.createMesh(componentKey, sampleX, sampleY)

            meshes.push(newMesh)
        }

        this.setMeshes(meshes)
    }

    startAnimation() {
        this.timer = window.setInterval(() => {

            const width = 1024 + Math.sin(this.clock * 0.01) * 100
            const height = 768 + Math.sin(this.clock * 0.01) * 100

            this.setState({
                width: width,
                height: height
            })

            this.clock += 1
        }, 50)
    }

    stopAnimation() {
        window.clearInterval(this.timer)
    }

    createMesh(componentKey, x, y) {

        const component = getComponent(componentKey)

        if (!component) {
            return
        }

        const idcode = crypto.randomBytes(10).toString('hex')
        const namecode = crypto.randomBytes(3).toString('hex')

        const defaultName = componentKey
        const defaultWidth = 100
        const defaultHeight = 100
        const defaultRotate = 0

        const properties = {
            $id: idcode,
            $name: `${defaultName}-${namecode}`,
            $x: Math.floor(x - defaultWidth * 0.5),
            $y: Math.floor(y - defaultHeight * 0.5),
            $width: defaultWidth,
            $height: defaultHeight,
            $rotate: defaultRotate
        }

        const specs = {
            properties: properties
        }

        const mesh = {
            componentKey: componentKey,
            specs: specs
        }

        return mesh
    }

    addMesh(componentKey, x, y) {

        const mesh = this.createMesh(componentKey, x, y)

        if (!mesh) {
            return
        }

        this.setState((preState) => ({
            meshes: [...preState.meshes, mesh]
        }))
    }

    setMeshes(newMeshes) {
        this.setState({ meshes: newMeshes })
    }

    setSelectedMeshes(meshIds) {

        const { selectedMeshes } = this.state

        const addMeshes = meshIds.filter(meshId => !selectedMeshes.has(meshId))
        const delMeshes = lodash.difference(Array.from(selectedMeshes), meshIds)

        if (addMeshes.length) {
            this.addSelectedMeshes(addMeshes)
        }
        if (delMeshes.length) {
            this.deleteSelectedMeshes(delMeshes)
        }
    }

    addSelectedMeshes(meshIds) {

        if (!meshIds.length) {
            return
        }

        this.setState((prevState) => {
            const newSet = new Set(prevState.selectedMeshes)
            meshIds.forEach(meshId => newSet.add(meshId))
            return {
                selectedMeshes: newSet
            }
        })
    }

    deleteSelectedMeshes(meshIds) {

        if (!meshIds.length) {
            return
        }

        this.setState((prevState) => {
            const newSet = new Set(prevState.selectedMeshes)
            meshIds.forEach(meshId => newSet.delete(meshId))
            return {
                selectedMeshes: newSet
            }
        })
    }

    setBackgroundColor(color) {
        this.setState({ backgroundColor: color })
    }

    setStageSize(width, height) {
        this.setState({ width, height })
    }

    render() {

        const contextValue = {
            ...this.state,
            addMesh: this.addMesh,
            setMeshes: this.setMeshes,
            setSelectedMeshes: this.setSelectedMeshes,
            addSelectedMeshes: this.addSelectedMeshes,
            deleteSelectedMeshes: this.deleteSelectedMeshes,
            setBackgroundColor: this.setBackgroundColor,
            setStageSize: this.setStageSize
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
    backgroundColor: PropTypes.object.isRequired,
    mode: PropTypes.oneOf([EditorMode.Writeable, EditorMode.ReadOnly]).isRequired,
    defaultMeshes: PropTypes.arrayOf(PropTypes.object)
}

export {
    EditorMode
}

export default WebMaker