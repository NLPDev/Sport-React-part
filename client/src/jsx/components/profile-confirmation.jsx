import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'

class ProfileConfirmation extends Component {

  constructor() {

    super();
    this.onClose = this.onClose.bind(this);
  }

  openModal() {
    $(ReactDOM.findDOMNode(this.refs.confirmation)).css("display", "flex").hide().fadeIn();
  }

  showConfirmation() {
    $(ReactDOM.findDOMNode(this.refs.spinner)).fadeOut(() =>
      $(ReactDOM.findDOMNode(this.refs.confirmationContent)).fadeIn())
  }

  closeModal() {
    $(ReactDOM.findDOMNode(this.refs.confirmation)).fadeOut();
  }

  onClose(e) {
    this.closeModal();
  }

  render() {

    return (
      <div className="confirmation confirmation-lg profile-confirmation text-center align-center" ref="confirmation">
        <div className="content-box">
          <div className="spinner" ref="spinner">
            <span className="psr-icons icon-spinner"></span>
          </div>
          <div className="confirmation-content" ref="confirmationContent">
            <Link to={'athlete' == this.props.userType ? "/profile" : "/dashboard/directory"}
              className="close-button"
              onClick={this.onClose} aria-label="Close" >
              <span aria-hidden="true" className="psr-icons icon-x"></span>
            </Link>
            <div className="tick-wrap"><span className="psr-icons icon-tick-thin"></span></div>
            <h5>Great job!</h5>
            <p>Come back to your profile at any time to edit or update your information.</p>
            <p>Now, let the fun begin!</p>
            <Link to={'athlete' == this.props.userType ? "/profile" : "/dashboard/directory"}
              className="button theme"
              onClick={this.onClose}>Let's go</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileConfirmation
