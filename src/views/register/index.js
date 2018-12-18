import React from 'react'
import Form from './components/form'
import VerifyEmail from './components/verify'
import Template from '../../component/template'

export default class Register extends React.Component {
  constructor() {
    super();
    this.state = {
      page: 1
    }
  }
  render() {
    let {page, email} = this.state
    let next_page = (email) => this.setState({page: this.state.page + 1, email});
    return (
      <div>
        <Template img>
          {
            {
              1: <Form onFinish={next_page} prefill={true}></Form>,
              2: <VerifyEmail email={email} />
            }[page]
          }
        </Template>
      </div>

    )
  }
}