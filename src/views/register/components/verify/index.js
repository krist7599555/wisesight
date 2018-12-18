import React from 'react'
import { Loader } from 'react-overlay-loader';
import '../../../../style/loader'
import { resendMail } from '../../../../redux/index'
import Content from './content'

export default class Verify extends React.Component {
  constructor({user}) {
    super()
    this.resend = this.resend.bind(this)
    this.state = {
      loading: false
    }
  }
  resend(evt) {
    this.setState({loading: true})
    resendMail({email: this.props.email})
      .catch(response => console.log(response))
      .finally(() => this.setState({loading: false}))
  }
  render() {
    let {loading} = this.state
    let {email} = this.props
    return (
      <>
        <Loader loading={loading} fullPage />
        <div className='flex-centered transition-fade-up'>
          <div>
            <br />
            <div className='box'>
              <Content email={email} resend={this.resend} />
            </div>
          </div>
        </div>
      </>
    )
  }
}
