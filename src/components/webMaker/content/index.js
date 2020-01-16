
import React from "react"
import PropTypes from 'prop-types'
import { Layout } from 'antd'

import WebMakerContext from "../context"
import { EditorMode } from "../constants"
import StageEditor from "./stageEditor"

class WebMakerContent extends React.PureComponent {

    static contextType = WebMakerContext;

    render() {

        const { mode, width, height, backgroundColor, meshes } = this.context

        const wrapStyle = {
            position: "relative",
            width: "100%",
            height: "100%",
        }

        const editorProps = {
            mode,
            width,
            height,
            backgroundColor,
            meshes
        }

        return (
            <Layout.Content>
                <div style={wrapStyle}>
                    <StageEditor {...editorProps} />
                </div>
            </Layout.Content >
        )
    }
}

// WebMakerContent.propTypes = {
//     width: PropTypes.number.isRequired,
//     height: PropTypes.number.isRequired,
//     backgroundColor: PropTypes.string.isRequired,
//     mode: PropTypes.oneOf([EditorMode.Writeable, EditorMode.ReadOnly]).isRequired,
//     meshes: PropTypes.arrayOf(PropTypes.object).isRequired
// }

export default WebMakerContent