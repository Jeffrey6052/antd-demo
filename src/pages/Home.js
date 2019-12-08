
import React from "react"

import Layout from '../components/Layout'

import "./Home.css"

class Home extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            jsonObject: {
                name: "jeffrey",
                age: 12,
                description: "这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本，这里是长文本。"
            }
        }
    }

    render() {

        return (
            <Layout>
                <h2>Home</h2>
                <div style={{ margin: "20px 0" }}>
                    <p className="base_color">文字文字</p>
                </div>
            </Layout>
        )
    }
}

export default Home