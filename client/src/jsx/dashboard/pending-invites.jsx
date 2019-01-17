import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import Select from '../components/select'
import TwoStepConfirmation from '../components/two-step-confirmation'

const SiglePending = (props) => (
        <div className="pending-invite">
          <div className="row align-middle">
            <div className="small-7 column ">
              <div className="underline">{props.email}</div>
              <div><small>{`Sent on ${props.dateSent.substr(0, 10)}`}</small></div>
            </div>
            <div className="small-5 column text-right">
              <span onClick={props.resendPrompt} className="psr-icons icon-resend"></span>
              <span onClick={props.removePrompt} className="psr-icons icon-trash"></span>
            </div>
          </div>
        </div>)

const TeamPendings = (props) => (
        <div className="content-section">
          <h3 className="group-heading">{props.name}</h3>
          {props.pendings.map(pending =>
                                <SiglePending email={pending.recipient}
                                              dateSent={pending.date_sent}
                                              resendPrompt={ () => { props.resendPrompt(pending); } }
                                              removePrompt={ () => { props.removePrompt(pending); } } />)}
        </div>)

class PendingInvite extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       curType: 'All',
                       allPending: [],
                       teamsPendings: [],
                       individualPendings: [],
                       curPending: null
                     });

  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    if (this.user) {
      this.retrievePendings();
    } else {
      const disposer = observe(this,
                               'user',
                               change => {
                                 if (change.newValue) {
                                   this.retrievePendings();
                                   disposer();
                                 }
                               });
    }
  }

  retrievePendings = () => {

    Api.getPendingInvites()
      .then(invites => {

        this.allPending = invites;

        this.teamsPendings = invites.filter(pending => pending.team_id > 0)
                               .reduce((acc, p) => {

                                 let team = acc.find(tp => tp.team_id == p.team_id);
                                 if (team) {
                                   team.pendings.push(p);
                                 } else {
                                   let name = '';

                                   team = this.user.team_ownerships.find(t => t.id == p.team_id);

                                   if (team) {
                                     name = team.name;
                                   } else {
                                     team = this.user.team_memberships.find(t => t.id == p.team_id);

                                     if (team) {
                                       name = team.name;
                                     }
                                   }
                                   acc.push({name, team_id: p.team_id, pendings: [p]})
                                 }
                                 return acc;
                               }, []);

        this.individualPendings = invites.filter(pending => !pending.team_id);
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  resendPrompt = (pending) => {
    this.curPending = pending;

    $('#resend-confirmation').foundation('open');
  }

  resendInvite = () => {
    this.refs.resendConfirmation.showSpinner();

    Api.resendInvite(this.curPending.id)
      .then(sendResult => {

        this.refs.resendConfirmation.showConfirmation();
        this.retrievePendings();
      })
      .catch(err => {

        this.refs.resendConfirmation.showApiError();
      });
  }

  removePrompt = (pending) => {
    this.curPending = pending;

    $('#remove-confirmation').foundation('open');
  }

  removeInvite = () => {
    this.refs.removeConfirmation.showSpinner();

    Api.cancelPendingInvite(this.curPending.id)
      .then(result => {

        this.refs.removeConfirmation.showConfirmation();
        this.retrievePendings();
      })
      .catch(err => {

        this.refs.removeConfirmation.showApiError();
      });
  }

  clearPrompt = () => {
    $('#clear-confirmation').foundation('open');
  }

  clearAll = () => {
    this.refs.clearConfirmation.showSpinner();

    Api.cancelAllPendingInvite(this.allPending.map(p => ({ id: p.id })))
      .then(result => {

        this.refs.clearConfirmation.showConfirmation();
        this.retrievePendings();
      })
      .catch(err => {

        this.refs.clearConfirmation.showApiError();
      });
  }

  changeFilter = (type) => {
    this.curType = type;
  }

  render() {

    return (
      <div className="pending-invites" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <h2 className="content-heading">Manage your pending invites here.</h2>
            {'coach' == (this.user && this.user.user_type) && this.teamsPendings.length && this.individualPendings.length ?
              <div className="sports-filter">
                <Select choices={['All', 'Team', 'Athlete']}
                        onSelected={this.changeFilter}
                        index={['All', 'Team', 'Athlete'].findIndex(c => c == this.curType)}/>
              </div> : null
            }
            {'coach' == (this.user && this.user.user_type) && ('All' == this.curType || 'Team' == this.curType) &&
             this.teamsPendings.length ?
              <div>
                <h2 className="gray-heading">Athletes and coaches invited to your teams:</h2>
                {this.teamsPendings.map(tp => <TeamPendings name={tp.name}
                                                            pendings={tp.pendings}
                                                            resendPrompt={this.resendPrompt}
                                                            removePrompt={this.removePrompt} />)}
              </div>
              : null }
            {('All' == this.curType || 'Athlete' == this.curType) && this.individualPendings.length ?
              <div className="content-section">
                <h2 className="gray-heading">
                  {'coach' == (this.user && this.user.user_type) ?
                    'Individual athlete invites:' : 'Coaches invites:'
                  }
                </h2>
                {this.individualPendings.map(pending =>
                                               <SiglePending email={pending.recipient}
                                                             dateSent={pending.date_sent}
                                                             resendPrompt={() => { this.resendPrompt(pending); }}
                                                             removePrompt={() => { this.removePrompt(pending); }}/>)}
              </div> : null }
            { 0 == this.allPending.length ?
              <p className="text-center">You're all up to date! Currently you have no pending invites.</p> :
              <div className="text-center link-text"
                   role="button"
                   onClick={this.clearPrompt} >Clear all pending invites</div> }
          </div>
        </div>

        <TwoStepConfirmation userType={this.props.user && this.props.user.user_type}
                             id="resend-confirmation"
                             title="Re-send invite"
                             msg="Are you sure? <br/>You can only re-send an invite once per week."
                             btnText="Yes, re-send it"
                             cancelBtnText="Cancel"
                             onProceed={this.resendInvite}
                             successMsg="Your invitation has been re-sent successfully."
                             apiMsg="We have problem processing your request, please try again later."
                             ref="resendConfirmation" />
        <TwoStepConfirmation userType={this.props.user && this.props.user.user_type}
                             id="remove-confirmation"
                             title="Remove invite"
                             msg="Are you sure?"
                             btnText="Yes, remove"
                             cancelBtnText="Cancel"
                             onProceed={this.removeInvite}
                             successMsg="Your invitation has been removed successfully."
                             apiMsg="We have problem processing your request, please try again later."
                             ref="removeConfirmation" />
        <TwoStepConfirmation userType={this.props.user && this.props.user.user_type}
                             id="clear-confirmation"
                             title="Clear all pending invites"
                             msg="Are you sure?"
                             btnText="Yes, clear all"
                             cancelBtnText="Cancel"
                             onProceed={this.clearAll}
                             successMsg="Your pending invites have been cleared successfully."
                             apiMsg="We have problem processing your request, please try again later."
                             ref="clearConfirmation" />
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(PendingInvite))
