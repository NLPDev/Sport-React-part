import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'
import TeamProfileForm from './components/team-profile-form'

class CreateTeam extends Component {

  constructor(props) {

    super(props);

  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    if(!this.props.user) {
      Api.getUser()
        .then(user => {
          this.props.setUser(user);
        })
        .catch(err => this.props.history.push('/login'));
    } else {
    }
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = () => {
    this.refs.teamProfileForm.wrappedInstance.trySubmit();
  }

  onCancel = () => {
    this.props.history.push('/dashboard/directory')
  }

  submitForm = (team, pictureForm, invitees) => {
    $('#save-confirmation').foundation('open');

    Api.createTeam(team)
      .then(team => {
        if (pictureForm) {
          Api.uploadTeamProfilePic(pictureForm, team.id)
            .then(result => {
              this.sendInvites(invitees, team.id);
            })
            .catch(err => {
              // console.log(err)
              this.showApiError();
            });
        } else {
          this.sendInvites(invitees, team.id);
        }
        
      })
      .catch(err => {
        // console.log(err)
        this.showApiError();
      });
  }

  sendInvites = (invitees, teamId) => {

    const toSend = invitees.reduce((acc, invitee) => {
      if (invitee) acc.push(invitee);

      return acc;
    }, []);

    if (toSend.length) {
      Api.sendInvitation(toSend.map(email => ({ recipient: email,
                                                recipient_type: 'athlete',
                                                team_id: teamId })))
        .then(result => {
          this.refreshUser();
        })
    } else {
      this.refreshUser();
    }
  }

  refreshUser = () => {

    Api.getUser()
      .then(user => {
        this.props.setUser(user);
      })
      .catch(err => console.log(err));
    this.showConfirmation();
  }

  showApiError = () => {
    this.refs.saveConfirmation.showApiError();
  }

  showConfirmation = () => {
    this.refs.saveConfirmation.showConfirmation();
  }

  render() {

    return (
      <div className="create-team" ref="me">
        <UtilBar title="Add New Team"
          onCancel={this.onCancel}
          onSave={this.onSave}
          noAutoPopup={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <TeamProfileForm onSubmit={this.submitForm}
                             onSuccess={this.showConfirmation}
                             onApiError= {this.showApiError}
                             ref="teamProfileForm"/>
          </div>
        </div>

        <SaveConfirmation userType="coach"
                          msg="New team has been created successfully."
                          apiMsg="There is problem processing your request, pleaes try again later."
                          onClose={this.onCancel}
                          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(CreateTeam))
