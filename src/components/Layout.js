
import React from "react"

import {
    Link
} from "react-router-dom";

class Layout extends React.Component {

    render() {
        return (
            <div>
                <div style={{padding: "10px", borderBottom: "1px solid #ccc", marginBottom: "20px"}}>
                        <span className="layout-link">
                            <Link to="/">Home</Link>
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