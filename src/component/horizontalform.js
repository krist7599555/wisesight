import React from 'react'

export default class HorizontalForm extends React.Component {
  render() {
    let {children, className} = this.props
    const childs = children instanceof Array ? children : [children]
    return (
      <div className="field is-horizontal">
        <div className="field-label is-normal">
          {childs.slice(0, 1)}
        </div>
        <div className="field-body">
          <div className="field">
            <div className="control">
              {childs.slice(1, childs.length)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}