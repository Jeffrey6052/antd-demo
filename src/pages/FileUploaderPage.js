
import React, { useState } from "react"
import { Button, Input } from 'antd'

import Layout from '../components/Layout'
import TokenizedFileUploader from "../utils/TokenizedFileUploader"

class FileUploaderPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            front_image: null,
            back_image: null,
            name: null,
            age: null
        }
        this.uploader = new TokenizedFileUploader()
    }

    selectFile(name) {
        this.uploader.chooseFile({
            name: name,
            onSelect: (file) => this.setState({
                [name]: file.name
            })
        })
    }

    deleteFile(name) {
        this.uploader.deleteFile(name)
        this.setState({
            [name]: null
        })
    }

    submitForm() {
        this.uploader.submit({
            url: "/api/test/upload",
            data: {
                name: this.state.name,
                age: this.state.age
            },
            onProgress: (e) => {
                const percent = e.loaded / e.total * 100
                console.log("onProgress", percent)
            },
            onSuccess: (response) => {
                console.log("onSuccess", response)
            },
            onFailure: (status, response) => {
                console.log("onFailure", status, response)
            }
        })
    }

    uploadSingleFile() {
        const uploader = new TokenizedFileUploader()
        uploader.chooseFile({
            onSelect: (file) => {
                uploader.submit({
                    url: "/api/test/upload",
                    data: {
                        name: file.name
                    },
                    onProgress: (e) => {
                        const percent = e.loaded / e.total * 100
                        console.log("onProgress", percent)
                    },
                    onSuccess: (response) => {
                        console.log("onSuccess", response)
                    },
                    onFailure: (status, response) => {
                        console.log("onFailure", status, response)
                    }
                })
            }
        })
    }

    render() {

        let frontImageDeleteBtn = null
        if (this.state.front_image) {
            frontImageDeleteBtn = <span onClick={() => this.deleteFile("front_image")} className="space-10">删除</span>
        }

        let backImageDeleteBtn = null
        if (this.state.back_image) {
            backImageDeleteBtn = <span onClick={() => this.deleteFile("back_image")} className="space-10">删除</span>
        }

        return (
            <Layout>
                <h4>测试单文件上传</h4>
                <div className="code-box-demo">
                    <Button type="primary" onClick={() => this.uploadSingleFile()}>上传文件</Button>
                </div>

                <hr />

                <h4>测试多文件上传</h4>
                <div className="code-box-demo">
                    <div className="margin-10">
                        <Button type="primary" onClick={() => this.selectFile("front_image")}>上传身份证正面图片</Button>
                        <span className="space-10">{this.state.front_image}</span>
                        {frontImageDeleteBtn}
                    </div>
                    <div className="margin-10">
                        <Button type="primary" onClick={() => this.selectFile("back_image")}>上传身份证背面图片</Button>
                        <span className="space-10">{this.state.back_image}</span>
                        {backImageDeleteBtn}
                    </div>
                    <div className="margin-10">
                        <Input addonBefore="姓名" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
                    </div>
                    <div className="margin-10">
                        <Input addonBefore="年龄" value={this.state.age} onChange={(e) => this.setState({ age: e.target.value })} />
                    </div>
                    <div className="margin-10">
                        <Button type="primary" onClick={() => this.submitForm()}>确认</Button>
                    </div>
                </div>
            </Layout >
        )
    }
}

export default FileUploaderPage