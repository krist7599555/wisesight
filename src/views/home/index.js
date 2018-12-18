import React from 'react'
import Template from '../../component/template'
import Content from './content'

export default class Home extends React.Component {
  render() {
    return (
      <Template img>
        <hr />
        <Content />
      </Template>
    )
  }
}
