
import React from "react"
import styles from "./styles.module.css"

class Icon extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {

        const { $width, $height } = this.props

        const style = {
            width: $width,
            height: $height,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#2193b0",
            background: "linear-gradient(to top, #6dd5ed, #2193b0)"
        }

        return (
            <div style={style}>
                <h1 className={styles.text}>Icon</h1>
            </div>
        )
    }
}

export default Icon