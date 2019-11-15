import React from 'react';

import Layout from '../components/Layout'

import Button from 'antd/es/button'

function ButtonPage() {
  return (
    <Layout>
      <h2>Button Demos</h2>

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
        <Button type="primary" icon="search" size="large">Download</Button>
      </div>

    </Layout>
  )
}

export default ButtonPage