import React from 'react';

export default class SampleDragramItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            hover: false
        }
    }

    setHover(hover) {
        this.setState({ hover: hover })
    }

    stopPropagation(e) {
        e.stopPropagation()
    }

    render() {

        return (
            <line
                x1={10}
                y1={230}
                x2={110}
                y2={230}
                strokeWidth="10"
                stroke={"rgba(0, 0, 0, 1)"}
                strokeOpacity="1"
                strokeLinecap='square'
                // onMouseDown={(e) => this.stopPropagation(e, console.log("mouseDown", e))}
                // onMouseUp={(e) => this.stopPropagation(e, console.log("mouseUp", e))}
                // onClick={(e) => this.stopPropagation(e, console.log("mouseUp", e))}
                // onMouseEnter={(e) => this.setHover(true, console.log("mouseEnter", e))}
                // onMouseLeave={(e) => this.setHover(false, console.log("mouseLeave", e))}
            />
        )
    }

}



// cursor: all-scroll