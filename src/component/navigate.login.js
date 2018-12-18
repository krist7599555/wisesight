import React, {Fragment} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import _ from 'lodash'
import { login, logout, _auth, _email } from '../redux'
import { Loader } from 'react-overlay-loader'

export default class NavigateLogin extends React.Component {
  constructor() {
    super()
    this.state = {
      show: false,
      loading: false,
      error: '',
      auth: _auth(),
      email: _email()
    }
  }
  press(e) {
    e.preventDefault();
    if (this.state.auth) {
      logout();
    } else if (!this.state.show) {
      this.setState({show: true});
    } else {
      let email = document.getElementById("username").value;
      let password = document.getElementById("password").value;
      this.setState({loading: true})
      login({email, password})
        .catch((error) => {
          let msg = _.get(error, 'response.data.msg') || "error";
          this.setState({error: msg})
        })
        .finally(() => {
          this.setState({loading: false})
        })
    }
    return false;
  }
  render() {
    let {show, error, loading, auth, email} = this.state
    let btn = auth ? "logout" : "login";
    let press = this.press.bind(this)
    let usernameValidate = "[a-zA-Z0-9]+(@.+\..+)?"
    let passwordValidate = "[a-zA-Z0-9]{8,}"
    return (
    <Fragment>
      {
        error && (
          <div className="navbar-item">
            <div className="help is-danger">{error}</div>
          </div>
        )
      }
      <form className="is-flex flex-wrap" onSubmit={press}>
        { auth &&
          <div className="navbar-item">
            <div className="control">
              <p className='is-size-6'>{email}</p>
            </div>
          </div>
        }
        { 
          !auth && show && (
            <Fragment>
              <div className="navbar-item">
                <div className="control">
                  <input className="input" id="username" placeholder="username phone or email" type="email" required pattern={usernameValidate} autoFocus />
                </div>
              </div>
              <div className="navbar-item">
                <div className="control">
                  <input className="input" id="password" placeholder="password" type="password" required pattern={passwordValidate} />
                </div>
              </div>
            </Fragment>
          )
        }
        <div className="navbar-item">
          <div className="control">
            <button className="button is-danger anime-big" type="submit">
              <span className="icon">
                <FontAwesomeIcon icon="sign-in-alt"></FontAwesomeIcon>
              </span>
              <span>{btn}</span>
            </button>
          </div>
        </div>
      </form>
      <Loader loading={loading} fullPage></Loader>
    </Fragment>
    )    
  }

}