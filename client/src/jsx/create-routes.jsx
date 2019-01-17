import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Switch, IndexRoute } from 'react-router-dom'
import { AppContainer } from 'react-hot-loader'
import { CSSTransitionGroup } from 'react-transition-group'
import {extendObservable} from 'mobx'
import {observer, Provider} from 'mobx-react'

import Home from './home'
import Login from './login-signup/login'
import Logout from './login-signup/logout'
import ForgetPassword from './login-signup/forget-password'
import ResetPassword from './login-signup/reset-password'
import SignupLanding from './login-signup/signup-landing'
import SignupAthlete from './login-signup/signup-athlete'
import SignupCoach from './login-signup/signup-coach'
import Settings from './profile/settings'
import SettingsAthlete from './profile/settings-athlete'
import SettingsCoach from './profile/settings-coach'
import ProfileRoute from './profile/profile-route'
// import Profile from './profile/profile'
// import EditProfile from './profile/edit-profile'
import AddAchievement from './profile/add-achievement'
import Dashboard from './dashboard/dashboard'
import ReturnToPlayRoute from './return-to-play/return-to-play-route'
import InviteAccepted from './misc/invite-accepted'
import AcceptInvite from './misc/accept-invite'
import InviteHandler from './misc/invite-handler'
import Api from './api'
// import DashboardRoot from './dashboard/dashboard-root'
import GenerateTeam from './utils/generate-team'

class Routes extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: null });
  }

  setUser = user => {

    this.user = user;
  }

  render() {

    return (
      <Provider user={this.user} setUser={this.setUser}>
        <Router>
          <Route render={({location}) => {
            const routeParts  = location.pathname.split('/');
            let rootPath;
            switch (routeParts[1]) {
              case 'signup':
                rootPath = routeParts[1] + routeParts[2];
                break;
              default:
                rootPath = routeParts[1];
            }

            return (
              <CSSTransitionGroup className="transition-container" transitionName='transition'
                                  transitionEnterTimeout={500}
                                  transitionLeaveTimeout={500} >
                <Switch key={rootPath} location={location}>
                  <Route exact path='/' component={Home} />
                  <Route exact path='/login/:recipient?/:firstName?/:lastName?/:inviteToken?' component={Login} />
                  <Route exact path='/logout' component={Logout} />
                  <Route exact path='/forget-password' component={ForgetPassword} />
                  <Route path='/reset-password/:token' component={ResetPassword} />
                  <Route exact path='/signup' component={SignupLanding} />
                  <Route exact path='/signup' component={SignupLanding} />
                  <Route path='/signup/athlete/accept-invite/:firstName/:lastName/:inviteToken'
                         component={SignupAthlete} />
                  <Route path='/signup/athlete/:step' component={SignupAthlete} />
                  <Route path='/signup/athlete' component={SignupAthlete} />
                  <Route path='/signup/coach/accept-invite/:firstName/:lastName/:inviteToken'
                         component={SignupCoach} />
                  <Route path='/signup/coach/:step' component={SignupCoach} />
                  <Route path='/signup/coach' component={SignupCoach} />
                  <Route exact path='/settings' component={Settings} />
                  <Route path='/settings/athlete/permission/:coachId' component={SettingsAthlete} />
                  <Route path='/settings/athlete' component={SettingsAthlete} />
                  <Route path='/settings/coach' component={SettingsCoach} />
                  {/* <Route exact path='/profile/add-achievement' component={AddAchievement} />
                  <Route exact path='/profile/edit' component={EditProfile} />
                  <Route exact path='/profile' component={Profile} /> */}
                  <Route path='/profile' component={ProfileRoute} />
                  <Route path='/dashboard/:topCat?/:subCat?' component={Dashboard} />
                  <Route path='/athlete-log' component={ReturnToPlayRoute} />
                  <Route path="/accept-invite/:recipient/:firstName/:lastName/:inviteToken"
                         component={AcceptInvite} />
                  <Route path="/invite-accepted/:recipient/:firstName/:lastName/:coachId"
                         component={InviteAccepted} />
                  <Route path="/user-invite/:recipient/:inviter/:firstName/:lastName/:token"
                         component={InviteHandler} />
                  <Route path="/generate-team" component={GenerateTeam} />
                </Switch>
              </CSSTransitionGroup>)}} />
        </Router>
      </Provider>
    )
  }
}

export default observer(Routes)
