
import React from "react"

import Layout from "./layout"

import Header from "./header"
import SiderLeft from "./siderLeft"
import Content from "./content"
import SiderRight from "./siderRight"

class WebMakerPage extends React.PureComponent {

    constructor(props) {
        super(props)
    }

    render() {

        const layoutProps = { Header, SiderLeft, Content, SiderRight }

        return <Layout {...layoutProps} />
    }

}


export default WebMakerPage