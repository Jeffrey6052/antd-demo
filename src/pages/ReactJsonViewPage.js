
import React from "react"

import ReactJson from 'react-json-view'

import Layout from '../components/Layout'

class ReactJsonViewPage extends React.Component {

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

    handleInputChange(edit) {
        // console.log("newObject", edit.updated_src)
        this.setState({
            jsonObject: edit.updated_src
        })
    }

    render() {

        return (
            <Layout>
                <h2>ReactJsonViewPage</h2>

                <div className="code-box-demo">
                    <h4>展示</h4>
                    <div className="jowo-react-json-view icon-hidden">
                        <ReactJson
                            src={this.state.jsonObject}
                            name={false}
                            enableClipboard={false}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            collapseStringsAfterLength={20}
                        />
                    </div>
                </div>

                <div className="code-box-demo">
                    <h4>编辑</h4>
                    <div className="jowo-react-json-view icon-hidden">
                        <ReactJson
                            src={this.state.jsonObject}
                            onEdit={(edit) => this.handleInputChange(edit)}
                            onAdd={(edit) => this.handleInputChange(edit)}
                            onDelete={(edit) => this.handleInputChange(edit)}
                            name={false}
                            enableClipboard={false}
                            displayObjectSize={false}
                            displayDataTypes={false}
                            collapseStringsAfterLength={20}
                        />
                    </div>
                </div>
            </Layout>
        )
    }
}

export default ReactJsonViewPage