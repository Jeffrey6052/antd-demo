
import React from "react"

class Mesh extends React.PureComponent {

    render() {
        const { style } = this.props

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }

}

export default Mesh