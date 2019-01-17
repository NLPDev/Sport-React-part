import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'

import SetHeight from '../components/set-height'
import Api from '../api'

class Login extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { email: '',
                       password: '' });
    this.setEmail = this.setEmail.bind(this);
    this.setPassword = this.setPassword.bind(this);
  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    $(ReactDOM.findDOMNode(this.refs.login_form))
      .on("forminvalid.zf.abide", (ev,frm) => {
        return;
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        Api.login(this.email, this.password)
          .then(response => {
            localStorage.setItem('user_id', response.id);
            localStorage.setItem('jwt_token', response.token);

            return Api.getUser();
          })
          .then(user => {
            this.props.setUser(user);

            if (this.props.match.params.inviteToken) {
              Api.acceptInvitation(this.props.match.params.inviteToken)
                .then(response => {
                  this.props.history.push('/invite-accepted/' + this.props.match.params.recipient +
                                          '/' + this.props.match.params.firstName +
                                          '/' +  this.props.match.params.lastName +
                                          '/' + response.requester_id);
                })
                .catch(err => {
                  console.log(err);
                });
              return;
            }

            if (user.payment_status && 'no_card' == user.payment_status) {

              this.props.history.push('/signup/athlete/2');
            } else {
              if (user.profile_complete) {
                if ('coach' == user.user_type) {
                  this.props.history.push('/dashboard/directory')
                } else {
                  this.props.history.push('/profile')
                }
              } else {
                if ('coach' == user.user_type) {
                  this.props.history.push('/signup/coach/2');
                } else {
                  this.props.history.push('/signup/athlete/3');
                }
              }
            }
          })
          .catch(e => {
            // alert(e.responseText)
            $(ReactDOM.findDOMNode(this.refs.apiError)).fadeIn();
          });
      })
      .on("submit", ev => {
        ev.preventDefault();
      });

    $(ReactDOM.findDOMNode(this.refs.email)).focus();
  }

  setEmail(e) {

    this.email = e.target.value;
  }

  setPassword(e) {

    this.password = e.target.value;
  }

  render() {
    return (
      <div className="content-container login align-center align-middle" ref="me">
        <div className="wrapper">
          <div className="logo text-center"><span className="psr-icons icon-logo"></span></div>
          <div className="row align-center align-bottom content">
            <div className="column large-6 content-box">
              <p className="api-error label" ref="apiError">The login credential is not correct.</p>
              <form data-abide noValidate ref="login_form">
                <label>Email
                  <input type="email" placeholder="name@mail.com" required ref='email'
                         onChange={this.setEmail}/>
                  <span className="form-error">Please enter a valid email.</span>
                </label>
                <label>password
                  <input type="password"
                         placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;" required
                         onChange={this.setPassword}/>
                  <span className="form-error">This field is required.</span>
                </label>
                <p><Link to="/forget-password" className="link-text">Forgot password?</Link></p>
                <button type="submit" className="button expanded theme" value="log in">Log in</button>
              </form>
              <p className="page-link">Not a member yet? <Link to="/signup" className="link-text">Sign up</Link></p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default inject('setUser')(SetHeight(observer(Login)))
