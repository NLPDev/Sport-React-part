import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'

class SignupConfirmation extends Component {

  constructor() {

    super();
    this.onClose = this.onClose.bind(this);
  }

  openModal() {
    $(ReactDOM.findDOMNode(this.refs.signupConfirmation)).css("display", "flex").hide().fadeIn();
  }

  showConfirmation() {
    $(ReactDOM.findDOMNode(this.refs.spinner)).fadeOut(() =>
      $(ReactDOM.findDOMNode(this.refs.confirmationContent)).fadeIn())
  }

  closeModal() {
    $(ReactDOM.findDOMNode(this.refs.signupConfirmation)).fadeOut();
  }

  onClose(e) {

    e.preventDefault();
    this.closeModal();
    this.props.onNext();
  }

  render() {

    return (
      <div className="confirmation confirmation-lg signup-confirmation text-center align-center" ref="signupConfirmation">
        <div className="content-box">
          <div className="spinner" ref="spinner">
            <span className="psr-icons icon-spinner"></span>
          </div>
          <div className="confirmation-content" ref="confirmationContent">
            <Link to={"/signup/" + this.props.userType + "/profile"}
              className="close-button"
              onClick={this.onClose} aria-label="Close" >
              <span aria-hidden="true" className="psr-icons icon-x"></span>
            </Link>
            <div className="tick-wrap"><span className="psr-icons icon-tick-thin"></span></div>
            <h5>{'coach' == this.props.userType ? "Account Created!" : "Thank you"}</h5>
            {'athlete' == this.props.userType ?
              <p>Your payment has been completed and your receipt has been emailed to you.</p> : null
            }
            <p>Now that you’ve scored that first goal, give 100% finishing up your profile. </p>
            <Link to={"/signup/" + this.props.userType + "/profile"}
            className="button theme"
            onClick={this.onClose}>Let's go</Link>
          </div>
        </div>
      </div>
    )
  }
}

export default SignupConfirmation
