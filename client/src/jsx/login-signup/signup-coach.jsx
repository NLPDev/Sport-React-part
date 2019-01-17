import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link, BrowserRouter as Router,  Route, Switch, withRouter} from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'

import Header from '../components/header'
import SignupProgress from '../components/signup-progress'
import SignupTypeTabs from '../components/signup-type-tabs'
import Payment from './signup-payment'
import Profile from './signup-profile'
import SignupConfirmation from '../components/signup-confirmation'
import ProfileConfirmation from '../components/profile-confirmation'
import SetHeight from '../components/set-height'
import PersonalInfo from './signup-personal-info'
import SignupProfile from './signup-profile'
import Api from '../api'

class SignupCoach extends Component {

  constructor() {

    super();
    this.appState = extendObservable(this,
                                     { coach: null,
                                       curStep: '',
                                       enabledStep: 'personalInfo',
                                       curShownComp: null });

    this.changeRoute = this.changeRoute.bind(this);
    this.onStepChange = this.onStepChange.bind(this);
    this.showSignupConfirmation = this.showSignupConfirmation.bind(this);
    this.showProfileBlocker = this.showProfileBlocker.bind(this);
    this.showProfileConfirmation = this.showProfileConfirmation.bind(this);
  }

  componentWillMount() {

    $('#terms').remove();
  }

  componentDidMount() {

    this.coach = this.props.user;

    $(ReactDOM.findDOMNode(this.refs.motionContainer)).addClass('in');

    if (this.props.match.params.step && 2 == this.props.match.params.step) {

      Api.getUser()
        .then(user => {
          this.coach = user;
          this.props.setUser(user);
        })
        .catch(err => this.props.history.push('/login'));

      this.refs.profile.wrappedInstance.show();
      this.curShownComp = this.refs.profile;
      this.curStep = 'profile';
      this.enabledStep = 'profile';
      history.replaceState(null, "", "/signup/coach/");
    } else {
      this.curShownComp = this.refs.personalInfo;
      this.curShownComp.wrappedInstance.show();
    }
  }

  changeRoute() {
    $(ReactDOM.findDOMNode(this.refs.motionContainer)).removeClass('in');
  }

  onStepChange(step) {

    this.curStep = step;
    this.curShownComp.wrappedInstance.hide();
    this.refs[step].wrappedInstance.show();
    this.curShownComp = this.refs[step];
    if ('profile' == step) this.enabledStep = 'profile';

    this.scrollToTop();
  }

  scrollToTop = () => {
    let scrollContainer;
    if($(window).width() >= 1024) {
      scrollContainer = this.refs.transition;
    } else {
      scrollContainer = this.refs.content;
    }
    $(ReactDOM.findDOMNode(scrollContainer)).scrollTop(0);
  }

  showSignupConfirmation(user) {
    this.scrollToTop();
    this.coach = user;
    this.props.setUser(user);
    this.refs.signupConfirmation.openModal();
    this.refs.signupConfirmation.showConfirmation();
  }

  showProfileBlocker() {
    this.scrollToTop();
    this.refs.profileConfirmation.openModal();
  }

  checkInvite = () => {

    if (this.props.match.params.inviteToken) {

      Api.acceptInvitation(this.props.match.params.inviteToken)
        .then(response => {
          this.props.history.push('/invite-accepted/coach' +
                                  '/' + this.props.match.params.firstName +
                                  '/' +  this.props.match.params.lastName +
                                  '/' + response.requester_id);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.showProfileConfirmation();
    }
  }

  showProfileConfirmation() {
    this.refs.profileConfirmation.showConfirmation();
  }

  render() {
    return (
      <div className="content-container signup-coach coach full-screen" >
        <Header pageTitle="Sign up for Coaches" fullWidth={true} />
        <div className="row expanded content" ref="content">
          <div className="column small-12 large-6 steps-container">
            <div className="motion-container" ref="motionContainer">
              <SignupProgress userType="coach" step={this.appState.curStep}
                              onStepChange={this.onStepChange} enabledStep={this.enabledStep}/>
              <SignupTypeTabs activeTab="coach" />
              <div className="transition-container" ref="transition">
                <PersonalInfo ref="personalInfo" userType="coach"
                              onNext={this.showSignupConfirmation}/>
                <SignupProfile ref="profile" onSubmit={this.showProfileBlocker}
                               onSuccess={this.checkInvite}/>
              </div>
              <Link to="/signup/athlete" className="arrow-link show-for-large" onClick={this.changeRoute}><span className="psr-icons icon-down-arrow"></span></Link>
            </div>
            <SignupConfirmation userType="coach" ref="signupConfirmation"
                                onNext={() => this.onStepChange('profile')}/>
            <ProfileConfirmation userType="coach" ref="profileConfirmation"/>
          </div>
          <div className="column large-6 show-for-large signup-link coach">For Coaches</div>
        </div>
      </div>
    )
  }
}

export default inject('user', 'setUser')(SetHeight(observer(SignupCoach)))
