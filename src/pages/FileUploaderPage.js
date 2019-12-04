
import React from "react"
import Button from 'antd/es/button'

import Layout from '../components/Layout'
import TokenizedFileUploader from "../utils/TokenizedFileUploader"

export default function FileUploaderPage(props) {

    const selectFile = () => {

        const uploader = new TokenizedFileUploader()

        const onSelect = () => {
            submitFile(uploader)
        }

        uploader.chooseFile({ onSelect })
    }

    const submitFile = (uploader) => {
        uploader.submit({
            url: "/api/test/upload",
            data: {
                name: "mypic",
                description: "照片描述..."
            },
            onProgress: (e) => {
                const percent = e.loaded / e.total * 100
                console.log("progress", percent)
            },
            onLoadend: (e) => {
                console.log("onLoadend", e)
            },
            onError: (e) => {
                console.log("onError", e)
            },
            onSuccess: (response) => {
                console.log("onSuccess", response)
            },
            onFailure: (status, response) => {
                console.log("onFailure", status, response)
            }
        })
    }

    return (
        <Layout>

            <h4>测试文件上传</h4>

            <div className="code-box-demo">
                <Button type="primary" onClick={() => selectFile()}>Primary</Button>
            </div>

        </Layout>
    )
}