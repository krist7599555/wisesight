import React from "react";
import { Link } from "react-router-dom";
import { validate } from "./validate";
import { Loader } from "react-overlay-loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HorizonInput from "../../../../component/horizontalform";
import { register } from "../../../../redux";
import _ from "lodash";

export default class From extends React.Component {
  constructor({ onFinish, prefill }) {
    super();
    this.update = this.update.bind(this);
    this.submit = this.submit.bind(this);
    this.state = {
      onFinish: onFinish,
      errorMsg: ""
    };
  }
  update(evt) {
    let { type, name, value } = evt.target;
    this.setState({
      [name]: value
    });
    validate.bind(this)(evt); // evt.target.setCustomValidity
  }
  submit(evt) {
    evt.preventDefault();
    this.setState({ loading: true });
    let { email, password, onFinish } = this.state;
    register({ email, password })
      .then(respond => {
        onFinish(email);
      })
      .then(console.log)
      .catch(error => {
        let msg = _.get(error, "response.data.msg") || "error";
        this.setState({ errorMsg: msg });
        return msg;
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }
  render() {
    let { password, errorMsg } = this.state;
    let invalidEvent = str => evt => {
      let { pattern, value } = evt.target;
      evt.target.setCustomValidity(RegExp(pattern).test(value) ? "" : str);
    };
    return (
      <form onSubmit={this.submit}>
        <hr />

        {/* EMAIL */}
        <HorizonInput>
          <label className="label">email</label>
          <input
            className="input"
            name="email"
            type="email"
            onChange={this.update}
            required
          />
        </HorizonInput>

        {/* PASSWORD 1 */}
        <HorizonInput>
          <label className="label">password</label>
          <input
            className="input"
            name="password"
            type="password"
            onChange={this.update}
            required
          />
        </HorizonInput>

        {/* PASSWORD 2 */}
        <HorizonInput>
          <label className="label">confirm password</label>
          <input
            className="input"
            name="password_2"
            minLength="8"
            type="password"
            onChange={this.update}
            pattern={password}
            onInvalid={invalidEvent("password is not the same")}
            required
          />
        </HorizonInput>

        {/* BUTTON */}
        <HorizonInput>
          <label className="label" />
          <button className="button is-dark" type="submit" value="submit">
            <span className="icon">
              <FontAwesomeIcon icon="angle-double-right" />
            </span>
            <span>submit</span>
          </button>
          <Link
            className="is-inline navbar-item anime-x is-sie-7"
            to="/forgot-password"
          >
            Forgot Password
          </Link>
          <span className="help is-danger">{errorMsg}</span>
        </HorizonInput>

        {/* SPINNER */}
        <Loader fullPage loading={this.state.loading} />
      </form>
    );
  }
}
