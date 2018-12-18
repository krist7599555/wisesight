import React from 'react'
import { LoadingOverlay, Loader } from 'react-overlay-loader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import HorizonInput from '../../component/horizontalform'
import { resetPassword } from '../../redux'
import Tempalate from '../../component/template';
import queryString from 'query-string'
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
    let {name, value} = evt.target;
    this.setState({
      [name]: value
    });
  }
  submit(evt) {
    evt.preventDefault();
    this.setState({loading: true});
    let token = queryString.parse(this.props.location.search).token  || "NO_TOKEN_FROM_QUERY"; //this.params.token;
    let password = this.state.password;
    try {
      resetPassword({token, password})
        .then((respond) => {
          this.setState({errorMsg: "password have been reset"})
        })
        .catch(error => {
          let msg = _.get(error, 'response.data.msg') || _.get(error, 'response.data') || "error";
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
    let invalidEvent = str => evt => {
      let {pattern, value} = evt.target
      evt.target.setCustomValidity(RegExp(pattern).test(value) ? "" : str);
    }
    return (
      <Tempalate img>
      <form onSubmit={submit}>
        <hr/>
        <HorizonInput>
          <label className="label">new password</label>
          <input className="input" name="password" type="password" pattern=".{8,}" onInvalid={invalidEvent("length must more than 8")} onChange={update} required />
        </HorizonInput>
        <HorizonInput>
          <label className="label">confirm new password</label>
          <input className="input" name="password_2" minLength='8' type="password" onInvalid={invalidEvent("password not same as above")} onChange={update} pattern={password} required/>
        </HorizonInput>

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
        <Loader fullPage loading={this.state.loading}/>

      </form>
      </Tempalate>
    )
  }
}


