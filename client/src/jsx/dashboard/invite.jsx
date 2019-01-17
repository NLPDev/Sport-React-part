import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'

class Invite extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { emails: [''],
                       extraFields: [],
                       numExtra: computed(() => {
                         return this.extraFields.length;
                       }),
                       invitee: computed(() => {
                                  return this.props.match.params.invitee ||
                                         ('coach' == (this.props.user && this.props.user.user_type) ? 'athlete' : 'coach');
                                }),
                       successMsg: '',
                       apiErrMsg: '',
                       pendingInvites: [],
                       formValid: false });

    this.contentByType = {
      athlete: {
        utilTitle: "Invite Athletes",
        heading: "Invite one or more athletes to join the team:",
        emailPlaceholder: "Athlete's email address",
        addMore: "Add more"
      },
      coach: {
        utilTitle: "Invite Coach",
        heading: "Invite coach",
        emailPlaceholder: "Coach's email address",
        addMore: "Add another coach"
      }
    }

  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    if(!this.props.user) {
      Api.getUser()
        .then(user => this.props.setUser(user))
        .catch(err => this.props.history.push('/login'));
    }
    $(ReactDOM.findDOMNode(this.refs.invite_form)).foundation();

    this.initValidation();

  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  initValidation = () => {
    $(ReactDOM.findDOMNode(this.refs.invite_form))
      .on("forminvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        this.formValid = false;
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        this.formValid = true;
      })
      .on("submit", ev => {
        ev.preventDefault();
        if (this.formValid) {
          $('#save-confirmation').foundation('open');
          Api.sendInvitation(this.emails.map(email => {
                                               let recipient = { recipient: email,
                                                                 recipient_type: this.invitee };
                                               if (this.props.match.params.t_id) {
                                                 recipient.team_id = this.props.match.params.t_id;
                                               }
                                               return recipient;
                                             }))
            .then(result => {
              this.refs.saveConfirmation.showConfirmation();
            })
            .catch(err => {
              const errObj = JSON.parse(err.responseText);
              if(errObj.athlete) {
                this.apiErrMsg = errObj.athlete;
              }
              if(errObj.detail) {
                this.apiErrMsg = errObj.detail;
              }
              this.refs.saveConfirmation.showApiError();
            });
        }
      });
  }

  turnOffValidation = () => {
    $(ReactDOM.findDOMNode(this.refs.invite_form))
      .off("forminvalid.zf.abide")
      .off('submit');
  }

  onSend = (ev) => {
    ev.preventDefault();
    if(this.emails.length > 1) {
      this.successMsg = "Your invitations have been sent successfully."
    } else {
      this.successMsg = "Your invitation has been sent successfully."
    }

    $(ReactDOM.findDOMNode(this.refs.invite_form)).submit();
  }

  onCancel = () => {
    if(this.props.match.params.t_id) {
      this.props.history.push('/dashboard/directory/team-management/' + this.props.match.params.t_id + '/team-directory')
    } else {
      this.props.history.push('/dashboard/' +
      ((this.props.location.state && this.props.location.state.from) || ''))
    }

  }

  updateEmail = (email, index) => {

    this.emails[index] = email;
    if (index > 1) {
      this.refs['email' + index].value = email;
    }
  }

  addEmailFields = () => {

    const curIndex = this.numExtra + 1;

    this.emails.push('');
    this.extraFields.push(<label key={curIndex}>Email
                            <input type="email" placeholder={this.invitee && this.contentByType[this.invitee].emailPlaceholder}
                                   ref={i => { this.refs['email' + curIndex] = i;
                                               this.turnOffValidation();
                                               Foundation.reInit('abide');
                                               this.initValidation() }}
                                   onChange={e => { this.updateEmail(e.target.value, curIndex) }}/>
                            <span className="form-error">Please enter a valid email address.</span>
                          </label>);
  }

  render() {

    return (
      <div className="invite" ref="me">
        <UtilBar title={this.invitee && this.contentByType[this.invitee].utilTitle}
            onCancel={this.onCancel}
            onSave={this.onSend}
            noAutoPopup={true}
            btnText='Send'/>
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <form data-abide noValidate ref='invite_form'>
              <h2 className="section-heading">
                {this.invitee && this.contentByType[this.invitee].heading}
              </h2>
              <p className="api-error label">There is error in your form.</p>
              <label>Email
                <input type="email"
                       placeholder={this.invitee && this.contentByType[this.invitee].emailPlaceholder}
                       required
                       value={this.emails[0]}
                       onChange={e => { this.updateEmail(e.target.value, 0) }}/>
                <span className="form-error">Please enter a valid email address.</span>
              </label>
              {this.extraFields}
              <div className="add-wrap" onClick={this.addEmailFields}>
                <span className="psr-icons icon-add"></span>
                <span>{this.invitee && this.contentByType[this.invitee].addMore}</span>
              </div>
              <button type="submit"
                      className="button expanded theme"
                      value="Next"
                      onClick={this.onSend}>Send</button>
            </form>
          </div>
        </div>

        <SaveConfirmation userType={this.props.user && this.props.user.user_type}
          msg={this.successMsg}
          apiMsg={this.apiErrMsg}
          onClose={this.onCancel}
          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(Invite))
