import React, {Fragment} from 'react'
import Navigate from './navigate'
// import Footer from './footer'
export default class Template extends React.Component {
  constructor() {
    super();
  }
  render() {
    let {img, flex, row, className, children} = this.props;
    return (
      <div>
        <Navigate />
        <div className='section'>
          <div className='box'>
            {
              img && 
              <figure className='image'>
                <img alt='wisesight-logo' src='https://wisesight.com/wp-content/uploads/2018/07/logo-primary-tagline.jpg' />
              </figure>
            }
            {
              flex ?
                <div className={className + ' flex-centered + ' + (row ? "flex-centered__row" : "")} >
                  {children}
                </div>
              : <Fragment>
                  {children}
                </Fragment>
            }
          </div>
        </div>
      </div>
    )
  }
}