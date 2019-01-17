import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'
import TeamProfileForm from './components/team-profile-form'

class EditTeam extends Component {

  constructor(props) {

    super(props);
    extendObservable(this,
                     { team: null });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    let teamLocal;

    if (this.props.match.params.t_id) {
      Api.getTeamInfo(this.props.match.params.t_id)
        .then(team => {
          teamLocal = team;
          return Api.getSports();
        })
        .then(sports => {
          teamLocal.sportName = sports.find(s => s.id == teamLocal.sport_id).name;
          this.team = teamLocal;
        })
        .catch(err => { console.log(err); });
    } else {
      this.props.history.push('/dashboard/directory');
    }
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = () => {
    this.refs.teamProfileForm.wrappedInstance.trySubmit();
  }

  onCancel = () => {
    this.props.history.push('/dashboard/directory/team-management/' + this.props.match.params.t_id +
                            '/team-directory')
  }

  submitForm = (team, pictureForm) => {
    $('#save-confirmation').foundation('open');
    const forUpdate = Object.assign({}, team);
    delete forUpdate.team_picture_url;
    delete forUpdate.athletes;
    delete forUpdate.coaches;
    delete forUpdate.id;
    delete forUpdate.sportName;

    Api.updateTeam(forUpdate, team.id)
      .then(team => {
        if (pictureForm) {
          Api.uploadTeamProfilePic(pictureForm, team.id)
            .then(result => {
              this.showConfirmation();
            })
            .catch(err => {
              // console.log(err)
              this.showApiError();
            });
        } else {
          this.showConfirmation();
        }
      })
      .catch(err => {
        // console.log(err)
        this.showApiError();
      });
  }

  showApiError = () => {
    this.refs.saveConfirmation.showApiError();
  }

  showConfirmation = () => {
    this.refs.saveConfirmation.showConfirmation();
  }

  render() {

    return (
      <div className="edit-team" ref="me">
        <UtilBar title="Edit Team"
                 onCancel={this.onCancel}
                 onSave={this.onSave}
                 noAutoPopup={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <TeamProfileForm onSubmit={this.submitForm}
                             onSuccess={this.showConfirmation}
                             onApiError= {this.showApiError}
                             team={this.team}
                             ref="teamProfileForm"/>
          </div>
        </div>

        <SaveConfirmation userType="coach"
                          msg="Your change has been saved successfully."
                          apiMsg="There is problem processing your request, pleaes try again later."
                          onClose={this.onCancel}
                          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(EditTeam))
