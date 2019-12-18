import React from 'react';

import Layout from '../../components/Layout'

import SVG from 'svg.js'

class SvgJsPage extends React.Component {

    render() {
        return (
            <Layout>
                <h3>svg.js测试</h3>

                <SvgJs />
            </Layout>
        )
    }
}

export class SvgJs extends React.Component {

    componentDidMount() {
        
        const draw = SVG(this.refDraw).size(600, 400).viewbox(0, 0, 300, 200)

        // draw.rect(10, 10).move(280, 180).attr({ fill: '#f06' })

        const pattern = draw.pattern(50, 50, function (add) {
            add.rect(50, 50).fill('#f06')
            add.rect(25, 25).fill('#0f9')
            add.rect(25, 25).move(25, 25).fill('#eee')
        })

        draw.rect(300, 200).move(0, 0).radius(10).fill(pattern)

        const text = draw.text(function (add) {
            add.tspan("Dragon----- - - - ->")
        })

        text.font({ fill: '#111' })
            .path('M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80')
            .animate(1000, '<>')
            .plot('M10 80 C 40 150, 65 150, 95 80 S 150 10, 180 80')
            .loop(true, true)
    }

    render() {
        return (
            <div ref={ref => (this.refDraw = ref)} ></div>
        )
    }
}

export default SvgJsPage