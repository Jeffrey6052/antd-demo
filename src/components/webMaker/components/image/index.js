
import React from "react"
import styles from "./styles.module.css"

class Image extends React.PureComponent {

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
            background: "#12c2e9",
            background: "linear-gradient(to top, #12c2e9, #c471ed, #f64f59)"
        }

        return (
            <div style={style}>
                <h1 className={styles.text}>Image</h1>
            </div>
        )
    }
}

export default Image