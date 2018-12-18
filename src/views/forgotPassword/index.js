import React from 'react'
import { Loader } from 'react-overlay-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HorizonInput from '../../component/horizontalform'
import { forgotPassword } from '../../redux'
import Tempalate from '../../component/template';
import _ from 'lodash';

export default class From extends React.Component {
  constructor({}) {
    super();
    this.ref_email = React.createRef();
    this.state = {
      errorMsg: ''
    }
  }
  update(evt) {
    let {type, name, value} = evt.target;
    this.setState({
      [name]: value
    });
  }
  submit(evt) {
    evt.preventDefault();
    this.setState({loading: true});
    let {email} = this.state
    console.log("email =", email)
    try {
      forgotPassword({email})
        .then((respond) => {
          console.log('respond =', respond)
          this.setState({errorMsg: respond.data.msg})
        })
        .catch(error => {
          console.log(error.response)
          let msg = _.get(error, 'response.data.msg') || "error";
          this.setState({errorMsg: msg})
          alert(msg);
          return msg
        })
        .finally(() => {
          this.setState({loading: false});
        })
    } catch (args) {
      console.log("CRASH", args)
    }
  }
  render() {
    let update = this.update.bind(this)
    let submit = this.submit.bind(this)
    let {password, errorMsg} = this.state
    return (
      <Tempalate img>
        <form onSubmit={submit}>
          <hr/>

          {/* EMAIL */}
          <HorizonInput>
            <label className="label">email</label>
            <input className="input" name="email" type="email" onChange={update} required/>
          </HorizonInput>

          {/* BUTTON */}
          <HorizonInput>
            <label className="label"></label>
            <button className="button is-dark" type="submit" value="submit"> 
              <span className="icon">
                <FontAwesomeIcon icon="angle-double-right"></FontAwesomeIcon> 
              </span>
              <span>submit</span>
            </button>
            <span className='help is-danger'>{errorMsg}</span>
          </HorizonInput>
          
          {/* SPINNER */}
          <Loader fullPage loading={this.state.loading}/>
        </form>
      </Tempalate>
    )
  }
}


