import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'

class EmptyPopup extends Component {

  constructor() {

    super();
    // this.onClose = this.onClose.bind(this);
  }

  // openModal() {
  //   $(ReactDOM.findDOMNode(this.refs.signupConfirmation)).css("display", "flex").hide().fadeIn();
  // }
  //
  // showConfirmation() {
  //   $(ReactDOM.findDOMNode(this.refs.spinner)).fadeOut(() =>
  //     $(ReactDOM.findDOMNode(this.refs.confirmationContent)).fadeIn())
  // }

  // closeModal() {
  //   $(ReactDOM.findDOMNode(this.refs.signupConfirmation)).fadeOut();
  // }

  // onClose(e) {
  //
  //   e.preventDefault();
  //   this.closeModal();
  //   this.props.onNext();
  // }

  render() {

    return (
      <div className={ "reveal empty-popup text-center " + this.props.userType } ref="me" id="empty-popup">
        <div className="flex-container">
          <div className="content-box">
            <div className="popup-content">
              <p>{this.props.msg}</p>
              <Link to={this.props.actionLink} className="button theme" data-close="">Let's&nbsp;go</Link>
              {'link' == this.props.emptyType ?
              <div className="dismiss" data-close="">No, thanks</div>
              : ''}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default EmptyPopup
