
import React from "react"

import {
    Link
} from "react-router-dom";

class Layout extends React.Component {

    render() {

        const { background } = this.props

        let pageStyle = { padding: "10px" }
        if (background) {
            pageStyle.background = background
        }

        return (
            <div style={pageStyle}>
                <div style={{ padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px" }}>
                    <span className="layout-link">
                        <Link to="/">Home</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/obj_model_3d">obj</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/glb_model_3d">glb</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/demo1">demo1</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/demo2">demo2</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/button">button</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/function_component">function_component</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/bit_demo">bit_demo</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/styled_component">styled_component</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/model_manage">model_manage</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/file_uploader">file_uploader</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/react-json-view">react-json-view</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/table">table</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/proxy">proxy</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/electrical_symbol">electrical_symbol</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/circuit_diagram">circuit_diagram</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/svg_js">svg_js</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/web_maker">web_maker</Link>
                    </span>
                </div>

                {this.props.children}

            </div>
        )
    }

}

export default Layout