
import React from "react"
import PropTypes from 'prop-types'

import { loadComponent } from "../../componentLoader"

class Mesh extends React.PureComponent {

    renderComponent(componentKey, properties) {
        const Component = loadComponent(componentKey)

        return <Component {...properties} />
    }

    render() {

        const { componentKey, specs } = this.props

        const { properties } = specs

        console.log("render: mesh", properties.$name)

        const style = {
            position: "absolute",
            width: properties.$width,
            height: properties.$height,
            left: properties.$x,
            top: properties.$y
        }

        const Component = loadComponent(componentKey)

        return (
            <div style={style}>
                <Component {...properties} />
            </div>
        )
    }

}

Mesh.propTypes = {
    componentKey: PropTypes.string.isRequired,
    specs: PropTypes.object.isRequired
}

export default Mesh