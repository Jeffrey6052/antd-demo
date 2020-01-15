
import React from "react"
import PropTypes from 'prop-types'

import { EditorMode } from "../../constants"

import StageContainer from "../stageContainer"

class StageEditor extends React.PureComponent {

    renderStageContainer() {

        const { mode, width, height, backgroundColor, meshes } = this.props

        const containerProps = {
            mode,
            width,
            height,
            backgroundColor,
            meshes,
        }

        return <StageContainer {...containerProps} />
    }

    renderTopRuler() {
        return null
    }

    renderLeftRuler() {
        return null
    }

    renderRulerResetSpot() {
        return null
    }

    render() {

        const wrapperStyle = {
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            overflow: "hidden",
            backgroundColor: "#f6f6f6"
        }

        const innerStyle = {
            width: "100%",
            height: "100%"
        }

        return (
            <div style={wrapperStyle}>

                <div style={innerStyle}>

                    {this.renderTopRuler()}
                    {this.renderLeftRuler()}
                    {this.renderRulerResetSpot()}

                    {this.renderStageContainer()}
                </div>
            </div>
        )
    }
}

StageEditor.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    backgroundColor: PropTypes.string.isRequired,
    meshes: PropTypes.arrayOf(PropTypes.object).isRequired
}

const generateDefaultMeshes = () => {
    const meshes = [
        {
            componentKey: "icon",
            specs: {
                properties: {
                    $id: "fewu2i2312io21n4i321ojo4213",
                    $name: "icon-t8w2fv",
                    $x: 20,
                    $y: 20,
                    $width: 300,
                    $height: 180,
                    $rotate: 45
                }
            }
        },
        {
            componentKey: "text",
            specs: {
                properties: {
                    $id: "fqwjgojp2412n5ionqwn312podw",
                    $name: "text-t8w2fv",
                    $x: 360,
                    $y: 20,
                    $width: 200,
                    $height: 80,
                    $rotate: 0
                }
            }
        },
        {
            componentKey: "image",
            specs: {
                properties: {
                    $id: "gfw12n5ionqwn312pcd2",
                    $name: "image-fksdj3",
                    $x: 360,
                    $y: 140,
                    $width: 160,
                    $height: 160,
                    $rotate: 0
                }
            }
        }
    ]

    return meshes
}

StageEditor.defaultProps = {
    mode: EditorMode.Writeable,
    width: 1440,
    height: 900,
    backgroundColor: "#FFFFFF",
    meshes: generateDefaultMeshes()
}

export default StageEditor