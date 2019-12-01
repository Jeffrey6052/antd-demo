import React from 'react';
import Layout from '../../components/Layout'

import moment from 'moment'

import {
    DatePicker,
    message,
    Row,
    Col
} from 'antd'

const ModelManagePage = () => {

    return (
        <Layout>
            <ModelManage />
        </Layout>
    )
}

class ModelManage extends React.Component {

    state = {
        date: null,
    }

    handleChange = date => {
        message.info(`您选择的日期是: ${date ? date.format('YYYY-MM-DD') : '未选择'}`);
        this.setState({ date });
    }

    render() {
        const { date } = this.state
        return (
            <React.Fragment>
                <div className="margin-20">
                    <h3>basic span=8</h3>
                </div>
                <div className="margin-20">
                    <Row justify="space-around">
                        <Col span={8}>
                            <div className="box01">
                                A
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="box01">
                                B
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="box01">
                                C
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="box01">
                                D
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="box01">
                                E
                            </div>
                        </Col>
                        <Col span={8}>
                            <div className="box01">
                                F
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="margin-20">
                    <h3>type="flex" justify="space-between"</h3>
                </div>
                <div className="margin-20">
                    <Row type="flex" justify="space-between">
                        <Col span={6}>
                            <div className="box01">
                                G
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="box01">
                                H
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="box01">
                                I
                            </div>
                        </Col>
                    </Row>
                </div>

                <div className="margin-20">
                    <h3>type="flex" justify="space-around"</h3>
                </div>
                <div className="margin-20">
                    <Row type="flex" justify="space-around">
                        <Col span={6}>
                            <div className="box01">
                                G
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="box01">
                                H
                            </div>
                        </Col>
                        <Col span={6}>
                            <div className="box01">
                                I
                            </div>
                        </Col>
                    </Row>
                </div>


                <div className="margin-20">
                    <h3>gutter=[8, 16]</h3>
                </div>
                <div className="margin-20">
                    <Row gutter={[8, 16]}>
                        <Col span={8} >
                            <div className="box02">K1</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K2</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K3</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K4</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K5</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K6</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K7</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K8</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K9</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K10</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K11</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K12</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K13</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K14</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K15</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K16</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K17</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K18</div>
                        </Col>
                        <Col span={8} >
                            <div className="box02">K19</div>
                        </Col>
                    </Row>
                </div>

                <div className="margin-20">
                    <h3>gutter=[8, 16] 响应式</h3>
                </div>
                <div className="margin-20">
                    <Row gutter={[8, 16]}>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K1</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K2</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K3</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K4</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K5</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K6</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K7</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K8</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K9</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K10</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K11</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K12</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K13</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K14</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K15</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K16</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K17</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K18</div>
                        </Col>
                        <Col xs={12} sm={8} lg={6} xxl={4} >
                            <div className="box02">K19</div>
                        </Col>
                    </Row>
                </div>


                <div className="margin-20">
                    <h3>DatePicker</h3>
                </div>
                <div className="margin-20">
                    <DatePicker onChange={this.handleChange} />
                    <div style={{ marginTop: 20 }}>
                        当前日期：{date ? date.format('YYYY-MM-DD') : '未选择'}
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default ModelManagePage