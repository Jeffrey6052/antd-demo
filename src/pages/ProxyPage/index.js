import React, { useState, useCallback } from 'react';
import { Button } from 'antd'

import Layout from '../../components/Layout'

const inspect = require("object-inspect")

const SampleChild = (props) => {

    const { proxyState } = props

    const currentAge = proxyState.age

    return (
        <div>
            <h4>SampleChild</h4>
            <p>{inspect(proxyState)}</p>
            <p>currentAge = {currentAge}</p>
            <p>
                <Button onClick={() => proxyState.age = currentAge + 1}>age + 1</Button>
            </p>
        </div>
    )
}

class ProxyPage extends React.Component {

    constructor(props) {
        super(props)

        this.initState()
        this.initProxyState()
    }

    initState() {
        this.state = this.defaultState()
    }

    initProxyState() {
        this.proxyState = new Proxy(this.state, {
            set: (target, prop, newval, receiver) => {
                this.setState({
                    [prop]: newval
                })
                return Reflect.set(target, prop, newval, receiver)
            }
        })
    }

    defaultState() {
        return {
            age: 0
        }
    }

    addAge(num) {
        console.log("addAge", num)
        this.setState((preState) => ({
            age: preState.age + num
        }))
    }

    render() {

        const { proxyState } = this

        return (
            <Layout>
                <div>
                    <h3>ProxyPage</h3>
                    <p>k0: {proxyState.k0}</p>
                    <p>k1: {proxyState.k1}</p>
                    <p>k2: {proxyState.k2}</p>
                    <p>knull: {proxyState.knull}</p>
                    <p>kxxxx: {proxyState.kxxxx}</p>
                    <p>age: {proxyState.age}</p>

                    <hr />

                    <Button onClick={() => proxyState.age = 0}>age(0)</Button>
                    <Button onClick={() => proxyState.age = 10}>age(10)</Button>
                    <Button onClick={() => proxyState.age = 20}>age(20)</Button>

                    <hr />
                    <SampleChild proxyState={proxyState} />

                    <hr />
                    <SampleChild proxyState={proxyState} />

                </div>
            </Layout>
        )
    }
}

export default ProxyPage