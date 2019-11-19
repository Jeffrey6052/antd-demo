
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
                        <Link to="/obj_model_3d">3D模型（obj格式）</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/glb_model_3d">3D模型（glb格式）</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/about">About</Link>
                    </span>
                    <span className="layout-link">
                        <Link to="/button">Button</Link>
                    </span>
                </div>

                {this.props.children}

            </div>
        )
    }

}

export default Layout