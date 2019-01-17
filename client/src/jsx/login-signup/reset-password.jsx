import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import SetHeight from '../components/set-height'
import Api from '../api'

class ResetPassword extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { password: ''});
    this.setPassword = this.setPassword.bind(this);
  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    $(ReactDOM.findDOMNode(this.refs.form))
      .on("forminvalid.zf.abide", (ev,frm) => {

      })
      .on("formvalid.zf.abide", (ev,frm) => {

        Api.resetPassword(this.password, this.props.match.params.token)
          .then(result => {
            this.showConfirmation();
            console.log(result);
          })
          .catch(e => { console.log(e); });
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  setPassword(e) {

    this.password = e.target.value;
  }

  showConfirmation(){
    const confirmation = $(ReactDOM.findDOMNode(this.refs.confirmation));
    const formContainer = $(ReactDOM.findDOMNode(this.refs.formContainer));

    confirmation.height(formContainer.outerHeight());

    formContainer.fadeOut(function(){
      confirmation.fadeIn();
    })
  }

  render() {
    return (
      <div className="content-container reset-password align-center align-middle" ref="me">
        <div className="wrapper">
          <div className="logo text-center" onClick={this.showConfirmation.bind(this)}><span className="psr-icons icon-logo"></span></div>
          <div className="row align-center align-bottom content">
            <div className="column large-6 content-box">
              <div className=" main-content-container" ref="formContainer">
                <form data-abide noValidate ref="form">
                  <label>password
                    <input type="password" id="password" value={this.password}
                           placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" required
                           onChange={this.setPassword}/>
                    <span className="form-error">This field is required.</span>
                  </label>
                  <label>Confirm password
                    <input type="password" data-equalto="password" placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" required/>
                    <span className="form-error">Passwords are supposed to match</span>
                  </label>
                  <button type="submit" className="button expanded theme" value="Submit">Submit</button>
                </form>
              </div>
              <div className="confirmation" ref="confirmation">
                <p>Your password has been reset sucessfully.</p>
              </div>
              <p className="page-link"><Link to="/login" className="link-text">Log in</Link></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SetHeight(observer(ResetPassword))
