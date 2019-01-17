import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Route, Switch, Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'

import Api from '../api'
import Profile from './profile'
import EditProfile from './edit-profile'
import AddAchievement from './add-achievement'
import EditAchievement from './edit-achievement'
import AddGoal from './add-goal'
import EditGoal from './edit-goal'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user) });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
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

  render() {

    return (
      <div className={"content-container profile " + (this.user ? this.user.user_type : "")}>
        <div className="row expanded">
          <div className="column show-for-large sidebar-container">
            <Sidebar curActive="Profile" history={this.props.history}/>
          </div>

          <div className="column content-right">
            <Header pageTitle="Profile" curActive="Profile" history={this.props.history} showProfile={true}/>

            <CSSTransitionGroup className="transition-container"
                                transitionName='dashboard-transition'
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={300} >
              <Switch key={this.props.location.pathname} location={this.props.location}>
                <Route exact path='/profile' component={Profile} />
                <Route exact path='/profile/edit/' component={EditProfile} />
                <Route exact path='/profile/add-achievement/:from' component={AddAchievement} />
                <Route exact path='/profile/edit-achievement/:award_id/:from' component={EditAchievement} />
                <Route exact path='/profile/add-goal' component={AddGoal} />
                <Route exact path='/profile/edit-goal/:g_id/:from' component={EditGoal} />
               </Switch>
             </CSSTransitionGroup>

          </div>

        </div>
        <Footer />
      </div>
    )
  }
}))
