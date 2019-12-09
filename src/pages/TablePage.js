import React, { useState, useCallback, useRef } from 'react'

import { Card, Table, Button, Divider, Modal, Form, Input, Radio, message } from 'antd'

import { Link } from "react-router-dom"

import Layout from '../components/Layout'

class AddModalForm extends React.Component {
    render() {
        const { visible, onOk, onCancel, form } = this.props
        const { getFieldDecorator } = form

        return (
            <Modal
                title="增加字段"
                visible={visible}
                onOk={onOk}
                onCancel={onCancel}
            >
                <Form layout="vertical">
                    <Form.Item label="字段名称">
                        {getFieldDecorator('name', {
                            rules: [{ required: true, message: '请输入字段名称' }],
                        })(<Input />)}
                    </Form.Item>
                    <Form.Item label="字段类型">
                        {getFieldDecorator('type')(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item label="默认值">
                        {getFieldDecorator('default')(<Input />)}
                    </Form.Item>
                    <Form.Item label="属性">
                        {getFieldDecorator('attrs')(<Input />)}
                    </Form.Item>
                </Form>
            </Modal>
        )
    }
}

const ConnectedAddModalForm = Form.create({ name: 'add_form' })(AddModalForm)

class AddButton extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            modalShow: false
        }

        this.formRef = null
    }

    handleSubmit() {

        console.log("handleSubmit")

        const { form } = this.formRef.props
        form.validateFields((err, values) => {
            if (err) {
                message.warn("请正确填写表单")
                return
            }

            console.log('Received values of form: ', values)
            form.resetFields()

            // after request success
            this.setModalShow(false)
        })
    }

    handleCancel() {
        this.setModalShow(false)
        console.log("handleCancel")
    }

    setModalShow(value) {
        this.setState({
            modalShow: value
        })
    }

    render() {
        return (
            <React.Fragment>
                <Button type="primary" onClick={() => this.setModalShow(true)}>新增</Button>
                <ConnectedAddModalForm
                    wrappedComponentRef={(ref) => this.formRef = ref}
                    visible={this.state.modalShow}
                    onOk={() => this.handleSubmit()}
                    onCancel={() => this.handleCancel()}
                />
            </React.Fragment >
        )
    }
}

function TableDemo() {
    const dataSource = [
        {
            name: '字段名称',
            type: '字段类型',
            default: '无',
            attrs: '最大长度20',
        },
        {
            name: '字段名称',
            type: '字段类型',
            default: '无',
            attrs: '最大长度20',
        },
        {
            name: '字段名称',
            type: '字段类型',
            default: '无',
            attrs: '最大长度20',
        },
        {
            name: '字段名称',
            type: '字段类型',
            default: '无',
            attrs: '最大长度20',
        },
        {
            name: '字段名称',
            type: '字段类型',
            default: '无',
            attrs: '最大长度20',
        }
    ]

    const columns = [
        {
            title: '字段名称',
            dataIndex: 'name',
            key: 'name',
            align: "left"
        },
        {
            title: '字段类型',
            dataIndex: 'type',
            key: 'type',
            align: "center"
        },
        {
            title: '默认值',
            dataIndex: 'default',
            key: 'default',
            align: "center"
        },
        {
            title: '属性',
            dataIndex: "attrs",
            key: "attrs",
            align: "center"
        },
        {
            title: '操作',
            dataIndex: "operate",
            key: "operate",
            align: "right",
            render: (text, record) => (
                <span>
                    <a onClick={() => { window.alert("todo 修改") }}>修改</a>
                    <Divider type="vertical" />
                    <a onClick={() => { window.alert("todo 删除") }}>删除</a>
                </span>
            )
        }
    ]

    return (
        <Table dataSource={dataSource} columns={columns} pagination={false} />
    )
}

function TableCard() {
    const newBtn = <AddButton />
    const cardCover = <TableDemo />

    return (
        <Card
            hoverable
            title="输入配置项"
            extra={newBtn}
            cover={cardCover}
        >
        </Card>
    )
}

export function Body(props) {

    return (
        <div>
            <div className="margin-20">

            </div>
            <div className="margin-20">
                <TableCard />
            </div>
        </div>
    )
}

export default function TablePage(props) {
    return (
        <Layout>
            <Body {...props} />
        </Layout>
    )
}