
import React from "react"
import styles from "./styles.module.css"

class Text extends React.PureComponent {

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
            background: "#ad5389",
            background: "linear-gradient(to top, #ad5389, #3c1053)"
        }

        return (
            <div style={style}>
                <h1 className={styles.text}>Text</h1>
            </div>
        )
    }
}

export default Text