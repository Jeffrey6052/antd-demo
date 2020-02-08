
import React from "react"
import { Input, Popover } from 'antd'
import PropTypes from 'prop-types'
import { SketchPicker } from 'react-color'
import tinycolor from "tinycolor2"

import styles from "./picker.module.css"

const HexColorRegex = /^#([0-9A-F]{3}){1,2}$/i

class ColorPicker extends React.PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            inputValue: "",
            inputFocusd: false
        }

        this.onInputChange = this.onInputChange.bind(this)
        this.onInputFocus = this.onInputFocus.bind(this)
        this.onInputBlur = this.onInputBlur.bind(this)
        this.onPickerChange = this.onPickerChange.bind(this)
    }

    onInputChange(event) {

        const targetValue = event.target.value

        const maxLength = targetValue[0] === "#" ? 7 : 6

        const inputValue = targetValue.substring(0, maxLength).toUpperCase()

        this.setState({ inputValue: inputValue })

        const color = tinycolor(inputValue)

        const isValid = color.isValid()

        if (!isValid) {
            return
        }

        this.props.onChange(color.toRgb())
    }

    onInputFocus(event) {
        const { color } = this.props

        const hexColor = tinycolor(color).toHexString().toUpperCase()

        this.setState({ inputFocusd: true, inputValue: hexColor })
    }

    onInputBlur(event) {
        this.setState({ inputFocusd: false })
    }

    onPickerChange(pickerData) {
        this.props.onChange(pickerData.rgb)
    }

    renderPicker() {

        const { color } = this.props

        const rgbColor = tinycolor(color).toString()

        const style = {
            userSelect: "none"
        }

        return (
            <div style={style}>
                <SketchPicker color={rgbColor} onChange={this.onPickerChange} />
            </div>
        )
    }

    renderColorPreview() {

        const { color } = this.props

        const rgbColor = tinycolor(color).toString()

        const style = {
            backgroundColor: rgbColor
        }

        return (
            <Popover content={this.renderPicker()} trigger="click">
                <div className={styles.wrap} onClick={this.openPicker}>
                    <div className={styles.color} style={style}></div>
                </div>
            </Popover>
        )
    }

    render() {

        const { color } = this.props
        const { inputValue, inputFocusd } = this.state

        const hexColor = tinycolor(color).toHexString().toUpperCase()

        const currentValue = inputFocusd ? inputValue : hexColor

        return (
            <Input
                prefix={this.renderColorPreview()}
                value={currentValue}
                onChange={this.onInputChange}
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
            />
        )
    }

}

ColorPicker.propTypes = {
    color: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
}

export default ColorPicker

