
import React from "react"

import Layout from '../components/Layout'

import "./Home.css"

class Home extends React.Component {

    render() {
        return (
            <Layout>
                <h2>Home</h2>
                <div style={{margin: "20px 0"}}>
                    <p className="base_color">文字文字</p>
                </div>
            </Layout>
        )
    }
}

export default Home