import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'

class GenericPopup extends Component {

  constructor() {
    super();
  }

  render() {

    return (
      <div className={ "reveal generic-popup text-center " + this.props.userType } ref="me"
            id="generic-popup"
            data-reveal
            data-reset-on-close="true"
            data-animation-in="fade-in"
            data-animation-out="fade-out">
        <div className="flex-container">
          <div className="content-box">
            <div className="popup-content">
              <p>{this.props.msg}</p>
              <Link to={this.props.confirmLink} className="button theme" data-close="">{this.props.confirmBtnText}</Link>
              {this.props.declineBtnText ?
                <div className="dismiss" data-close="">{this.props.declineBtnText}</div>
              : null}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GenericPopup
