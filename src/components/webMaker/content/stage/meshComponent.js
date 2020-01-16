
import React from "react"

class MeshComponent extends React.PureComponent {

    render() {
        const { style } = this.props

        return (
            <div style={style}>
                {this.props.children}
            </div>
        )
    }

}

export default MeshComponent