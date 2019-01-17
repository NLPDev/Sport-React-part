import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import SetHeight from '../components/set-height'
import Api from '../api'

class ForgetPassword extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { email: '' });
    this.setEmail = this.setEmail.bind(this);
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    $(ReactDOM.findDOMNode(this.refs.form))
      .on("forminvalid.zf.abide", (ev,frm) => {
        return;
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        Api.requestPasswordReset(this.email)
          .then(result => {
            this.showConfirmation();
          })
          .catch(err => {
            try {
              const errObj = JSON.parse(err.responseText);
              $(ReactDOM.findDOMNode(this.refs.apiError)).text(errObj.email[0]).fadeIn();

          } catch (e) {
            console.log(e)
          }
        });
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  showConfirmation(){
    const confirmation = $(ReactDOM.findDOMNode(this.refs.confirmation));
    const formContainer = $(ReactDOM.findDOMNode(this.refs.formContainer));

    confirmation.height(formContainer.outerHeight());

    formContainer.fadeOut(function(){
      confirmation.fadeIn();
    })
  }


  setEmail(e) {
    this.email = e.target.value;
  }

  render() {
    return (
      <div className="content-container forget-password align-center align-middle" ref="me">
        <div className="wrapper">
          <div className="logo text-center"><span className="psr-icons icon-logo"></span></div>
          <div className="row align-center align-bottom content">
            <div className="column large-6 content-box">
              <div className="main-content-container" ref="formContainer">
                <form data-abide noValidate ref="form">
                  <label>Email
                    <input type="email" placeholder="name@mail.com" required value={this.email}
                           onChange={this.setEmail}/>
                    <span className="form-error">Please enter a valid email.</span>
                    <span className="api-error" ref="apiError">This email does not exist.</span>
                  </label>
                  <button type="submit" className="button expanded theme" value="Submit"
                          >Submit</button>
                </form>
              </div>
              <div className="confirmation" ref="confirmation">
                <p>A email has been sent to you. Please follow the instructions to reset your password</p>
              </div>
              <p className="page-link"><Link to="/login" className="link-text">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SetHeight(observer(ForgetPassword))
