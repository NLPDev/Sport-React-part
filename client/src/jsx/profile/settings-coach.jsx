import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'

import Header from '../components/header'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import CoachGeneral from './settings-coach-general'
import ManageTeam from './settings-coach-manage-team'
import ManageAthlete from './settings-coach-manage-athlete'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'

class SettingsAthlete extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curComp: null,
                       coach: null,
                       curTeam: {},
                       curAthlete: {}});
    this.showComp = this.showComp.bind(this);
    this.showTeam = this.showTeam.bind(this);
    this.showAthlete = this.showAthlete.bind(this);
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    if (!this.props.user) {
      Api.getUser()
        .then(user => {
          this.coach = user;
          this.props.setUser(user);
        })
        .catch(err => {
          this.props.history.push('/login');
        })
    } else {
      this.coach = this.props.user;
    }
    this.curComp = this.refs.general;

  }

  showComp(comp) {
    this.curComp.hide();
    this.refs[comp].show();

    this.curComp = this.refs[comp];
    $('body').scrollTop(0);
  }

  showTeam(team) {
    this.curTeam = team;
    this.showComp('manageTeam');
  }

  showAthlete(athlete) {

    this.curAthlete = athlete;
    this.showComp('manageAthlete');
  }

  saveConfirmation = () => {
    this.refs.saveConfirmation.showConfirmation();
  }

  showApiError = () => {
    this.refs.saveConfirmation.showApiError();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }
  
  render() {
    return (
      <div className="content-container settings coach">
        <div className="row expanded">
          <div className="column show-for-large sidebar-container">
            <Sidebar curActive="Settings" history={this.props.history}/>
          </div>
          <div className="column content-right">
            <Header pageTitle="Settings" curActive="Settings" history={this.props.history} showProfile={true}/>
            <div className="tab-content-container">
              <CoachGeneral ref="general" coach={this.coach}
                            showTeam={this.showTeam}
                            showAthlete={this.showAthlete}
                            history={this.props.history}
                            coach={this.props.user}
                            onSuccess={this.saveConfirmation} />
              <ManageTeam ref="manageTeam" onBack={() => this.showComp('general')}
                          team={this.curTeam} onSuccess={this.saveConfirmation}/>
              <ManageAthlete ref="manageAthlete" onBack={() => this.showComp('general')}
                             athlete={this.curAthlete}
                             onApiError={this.showApiError}
                             onSuccess={() => {
                                            Api.getUser()
                                              .then(user => {
                                                this.props.setUser(user);
                                              })
                                            this.saveConfirmation();
                                            this.showComp('general')
                                       }}/>
            </div>
            <SaveConfirmation userType="coach"
              msg="Your change has been saved successfully."
              apiMsg="Sorry we have problem handling your request, please try again later."
              ref="saveConfirmation"/>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(SettingsAthlete))
