
import React from "react"

import { List, Icon } from 'antd'

import { ComponentKeys } from "../componentLoader"

import styles from "./styles.module.css"

class ComponentList extends React.PureComponent {

    onDragStart(event, componentKey) {
        event.stopPropagation()
        event.dataTransfer.effectAllowed = "move"
        event.dataTransfer.setData("componentKey", componentKey)
    }

    renderComponentItem(componentKey) {

        const itemProps = {
            draggable: true,
            onDragStart: (e) => this.onDragStart(e, componentKey),
            className: styles.item,
            key: componentKey
        }

        return (
            <List.Item className={styles.list}>
                <div {...itemProps} >
                    <Icon type="ant-design" />
                    <div className={styles.item_text}>{componentKey}</div>
                </div>
            </List.Item>
        )
    }

    render() {
        const listProps = {
            grid: { gutter: 4, column: 3 },
            dataSource: ComponentKeys,
            renderItem: (componentKey) => this.renderComponentItem(componentKey)
        }

        return (
            <div className={styles.list_wrap}>
                <List {...listProps} />
            </div>
        )
    }
}

export default ComponentList