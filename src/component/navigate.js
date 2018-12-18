import React, {Fragment} from 'react'
import { Link } from 'react-router-dom';
import _ from 'lodash'
import NavigateLogin from './navigate.login'


export default class Navigate extends React.Component {
  constructor() {
    super()
    this.state = {
      open: false,
      auth: false
    }
  }
  toggle() {
    this.setState({
      open: !this.state.open
    })
  }
  render() {
    let toggle = this.toggle.bind(this)
    let open = this.state.open
    let icon_style = {
      transform: "scale(1.4)",
      marginLeft: "1rem",
      marginRight: "1rem",
    }
    return (
      <nav className="navbar is-transparent transition-fade-up">
        <div className="navbar-brand">
          <Link className="navbar-item" to="/">
            <img className="is-rounded anime-big" src="https://wisesight.com/wp-content/themes/seed/img/logo.png"/>
          </Link>
          <div className={"navbar-burger burger " + (open ? "is-active" : "")} onClick={toggle}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <div className={"navbar-menu chula-ch " + (open ? "is-active" : "")}>
          <div className="navbar-start transition-fade-up">
            <Link className="navbar-item anime-x" to="/">Home</Link>
            <Link className="navbar-item anime-x" to="/profile">Profile</Link>
            <Link className="navbar-item anime-x" to="/register">Register</Link>
          </div>
          <div className="navbar-end">
            <NavigateLogin></NavigateLogin>
          </div>
        </div>
      </nav>
    )

  }
}