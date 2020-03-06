import React from 'react'

import 'antd/dist/antd.css'
import './App.css'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'

import moment from 'moment'
import 'moment/locale/zh-cn'

moment.locale('zh-cn')

import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom"

import D3SpritePage from "./pages/d3SpritePage"

import "./utils/KeyboardWatch"

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <Router>
                <Switch>
                    <Route path="/">
                        <D3SpritePage />
                    </Route>
                </Switch>
            </Router>
        </ConfigProvider>
    )
}

export default App
