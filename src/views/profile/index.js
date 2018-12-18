import React from 'react'
import Template from '../../component/template'
import ProfileLink from './profileLink'
import { _email, _auth } from '../../redux'

export default class Profile extends React.Component {
  render() {
    return (
    <Template className="flex-centered__row flex-wrap" flex row>
      <div className="padding-10">
        <figure className="image is-128x128">
          <img className="is-rounded anime-big" src="https://intern.my/wp-content/uploads/2017/12/WiseSight-Round-Logo-200x186.png" />
        </figure>
      </div>
      <div className="padding-10">
        <div className="flex-centered__row flex-wrap">
          <ProfileLink href={"mailto:" + _email()}>
            {_email() || "you are not login"}
          </ProfileLink>
        </div>
      </div>
    </Template>
    )
  }
}