import React from 'react';

import { Button } from 'antd'

import { Link } from "react-router-dom";

import Layout from '../components/Layout'

export function ButtonContent(props) {

  const getTitle = () => {
    return props.title || "default title"
  }

  const onDownloadClick = () => {
    if (props.onDownloadClick) {
      props.onDownloadClick()
    } else {
      window.alert("onDownloadClick not set")
    }
  }

  return (
    <div>
      <h2>Button Demos</h2>
      <p>{getTitle()}</p>

      <h4>基本样式</h4>
      <div className="code-box-demo">
        <Button type="primary">Primary</Button>
        <Button>Default</Button>
        <Button type="dashed">Dashed</Button>
        <Button type="danger">Danger</Button>
        <Button type="link">Link</Button>
      </div>

      <h4>其它</h4>
      <div className="code-box-demo">
        <Button type="primary" icon="search" size="large" onClick={() => onDownloadClick()}>Download</Button>
      </div>

      <div>
        <span className="layout-link">
          <Link to="/">Home</Link>
        </span>
      </div>
    </div>
  )
}

export default function ButtonPage(props) {
  return (
    <Layout>
      <ButtonContent {...props} />
    </Layout>
  )
}