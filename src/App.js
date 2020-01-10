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

import HomePage from "./pages/Home"
import Demo1Page from "./pages/Demo1"
import Demo2Page from "./pages/Demo2"
import ButtonPage from "./pages/Button"
import ObjModel3DPage from "./pages/ObjModel3D"
import GlbModel3DPage from "./pages/GlbModel3D"
import FunctionComponent from "./pages/FunctionComponent"
import BitDemo from "./pages/BitDemo"
import StyledComponent from "./pages/StyledComponent"
import ModelManagePage from "./pages/ModelManagePage"
import FileUploaderPage from "./pages/FileUploaderPage"
import ReactJsonViewPage from "./pages/ReactJsonViewPage"
import TablePage from "./pages/TablePage"
import ProxyPage from "./pages/ProxyPage"
import ElectricalSymbolPage from "./pages/ElectricalSymbol"
import CircuitDiagramPage from "./pages/CircuitDiagram"
import SvgJsPage from "./pages/SvgJs"
import WebMakerPage from "./pages/WebMaker"

import "./utils/KeyboardWatch"

function App() {
    return (
        <ConfigProvider locale={zhCN}>
            <Router>
                <Switch>
                    <Route path="/glb_model_3d">
                        <GlbModel3DPage />
                    </Route>
                    <Route path="/obj_model_3d">
                        <ObjModel3DPage />
                    </Route>
                    <Route path="/demo1">
                        <Demo1Page />
                    </Route>
                    <Route path="/demo2">
                        <Demo2Page />
                    </Route>
                    <Route path="/button">
                        <ButtonPage />
                    </Route>
                    <Route path="/function_component">
                        <FunctionComponent />
                    </Route>
                    <Route path="/bit_demo">
                        <BitDemo />
                    </Route>
                    <Route path="/styled_component">
                        <StyledComponent />
                    </Route>
                    <Route path="/model_manage">
                        <ModelManagePage />
                    </Route>
                    <Route path="/file_uploader">
                        <FileUploaderPage />
                    </Route>
                    <Route path="/react-json-view">
                        <ReactJsonViewPage />
                    </Route>
                    <Route path="/table">
                        <TablePage />
                    </Route>
                    <Route path="/proxy">
                        <ProxyPage />
                    </Route>
                    <Route path="/electrical_symbol">
                        <ElectricalSymbolPage />
                    </Route>
                    <Route path="/circuit_diagram">
                        <CircuitDiagramPage />
                    </Route>
                    <Route path="/svg_js">
                        <SvgJsPage />
                    </Route>
                    <Route path="/web_maker">
                        <WebMakerPage />
                    </Route>
                    <Route path="/">
                        <HomePage />
                    </Route>
                </Switch>
            </Router>
        </ConfigProvider>
    )
}

export default App
