import React from 'react';
const ProfileLink = ({children, href}) => (
  <div className="is-fullwidth">
    <div className="notification margin-5 padding-11 anime-x">
      <a href={href}>{children}</a>
    </div>
  </div>  
)
export default ProfileLink;