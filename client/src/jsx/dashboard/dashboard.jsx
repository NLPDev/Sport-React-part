import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Route, Switch, IndexRoute, Redirect } from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'

import Header from '../components/header'
import Sidebar from '../components/sidebar'
import DashboardMenu from './components/dashboard-menu'
import Footer from '../components/footer'
import DashboardRoot from './dashboard-root'
import Overview from './overview'
import Technical from './technical-tactical'
import TechnicalAssessment from './assessments/technical'
import TechnicalHistory from './assessments/technical-history'
import Physical from './physical'
import Mental from './mental'
import TeamsOfAthlete from './teams-of-athlete'
import Status from './status'
import AddStatus from './add-status'
import EditStatus from './edit-status'
// import Fundamental from './fundamental'
// import FundamentalAssessment from './assessments/fundamental'
// import FundamentalHistory from './assessments/fundamental-history'
import PhysicalAssessment from './assessments/physical'
import PhysicalHistory from './assessments/physical-history'
import MentalAssessment from './assessments/mental'
import MentalHistory from './assessments/mental-history'
import Directory from './directory'
import AthleteManagement from './athlete-management'
import AddSport from './add-sport'
import Invite from './invite'
import PendingInvites from './pending-invites'
import Api from '../api'
import CreateTeam from './create-team'
import TeamManagement from './team-management'
import TeamTechnicalAssess from './assessments/team-technical'
import TeamPhysicalAssess from './assessments/team-physical'
import TeamLeadershipAssess from './assessments/team-leadership'
import EditTeam from './edit-team'
import TeamAthleteManagement from './team-athlete'

class DashBoard extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       curSport: '',
                       assDefs: null,
                       assessments: null });
  }

  componentDidMount() {

  }

  componentWillMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    if (!this.props.user) {
      Api.getUser()
        .then(user => {

          this.props.setUser(user);

          this.checkRoute();
        })
        .catch(err => {
          this.props.history.push('/login');
        })
    } else {
      this.checkRoute();
    }

  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  checkRoute = () => {

    const subRoute = this.props.match.url.match(/\/dashboard\/([\w-]*)\/?/);
    let getAss = true;

    if (subRoute && subRoute.length > 1) {
      if ('coach' == this.props.user.user_type) {
        if (this.props.match.url.indexOf('new-assessment') < 0) {
          if (['technical-tactical', 'physical', 'leadership'].find(r => r == subRoute[1])) {
            this.props.history.push('/dashboard/directory');
            getAss = false;
          }
        }
      } else {
        if ('directory' == subRoute[1]) {
          this.props.history.push('/dashboard/overview');
          getAss = false;
        }
      }
    }
    if (getAss) {
      this.retrieveAssessments();
    }
  }

  retrieveAssessments = () => {

    Promise.all([Api.listAssessment(), Api.retrieveAssessments()])
      .then(([assessmentDefs, assessments]) => {
              this.assDefs = assessmentDefs;
              this.assessments = assessments;
            })
      .catch(err => { console.log(err) });
  }

  refreshAssessment = () => {

    Api.retrieveAssessments()
      .then(assessments => { this.assessments = assessments; });
  }

  render() {

    return (

      <Provider assDefs={this.assDefs}
                assessments={this.assessments}
                refreshAssessment={this.refreshAssessment}>
        <div className={"content-container dashboard " + (this.user ? this.user.user_type : "")} >
          <div className="row expanded">
            <div className="column show-for-large sidebar-container">
              <Sidebar curActive="Dashboard" history={this.props.history}/>
            </div>
            <div className="column content-right">
              <Header pageTitle="Dashboard" curActive="Dashboard" history={this.props.history} showProfile={true}/>
              <Route path='/dashboard/:subMenu?'
                     render={(props) => <DashboardMenu {...props} curSport={this.curSport}
                                                       ref={r => { this.menu = r}}/>}  />
              <Route render={({location}) => {

                let switchKey = location.pathname;

                if (location.pathname.indexOf('dashboard/directory/athlete-management') > 0) {
                  switchKey = '/dashboard/directory/athlete-management';
                } else if (location.pathname.indexOf('dashboard/directory/team-management') > 0){
                  switchKey = '/dashboard/directory/team-management';
                }
                return (
                  <CSSTransitionGroup className="transition-container" transitionName='dashboard-transition'
                                      transitionEnterTimeout={500}
                                      transitionLeaveTimeout={300} >
                    <Switch key={switchKey} location={location}>
                      <Route exact path='/dashboard/overview'
                             render={(props) => <Overview {...props} setSport={this.setSport} /> } />
                      <Route path='/dashboard/technical-tactical/:sport/new-assessment/:a_id?'
                             component={TechnicalAssessment} />
                      <Route exact path='/dashboard/technical-tactical/:sport/history/:date' component={TechnicalHistory} />
                      <Route exact path='/dashboard/technical-tactical/:sport?' component={Technical} />
                      <Route exact path='/dashboard/physical/new-assessment/:cat_id?/:a_id?'
                             component={PhysicalAssessment} />
                      <Route exact path='/dashboard/physical/:cat_id/history/:date' component={PhysicalHistory} />
                      <Route exact path='/dashboard/physical/:cat_id?' component={Physical} />
                      <Route exact path='/dashboard/leadership/new-assessment/:catIndex?/:aId?'
                             component={MentalAssessment} />
                      <Route exact path='/dashboard/leadership/:catIndex/history/:date' component={MentalHistory} />
                      <Route exact path='/dashboard/leadership' component={Mental} />
                      <Route exact path='/dashboard/team' component={TeamsOfAthlete} />
                      <Route exact path='/dashboard/my-status/add' component={AddStatus} />
                      <Route exact path='/dashboard/my-status/edit/:precompete_id' component={EditStatus} />
                      <Route exact path='/dashboard/my-status' component={Status} />
                      <Route path='/dashboard/directory/athlete-management/:a_id/:action?'
                             component={AthleteManagement} />
                      <Route path='/dashboard/directory/team-management/:t_id/athlete/:a_id/:action?'
                             component={TeamAthleteManagement} />
                      <Route exact path='/dashboard/directory/create-team' component={CreateTeam} />
                      <Route exact path='/dashboard/directory/team-management/:t_id/invite/:invitee'
                             component={Invite} />
                      <Route exact path='/dashboard/directory/team-management/:t_id/technical-tactical/new-assessment/:a_id/:s_id'
                             component={TeamTechnicalAssess} />
                      <Route exact path='/dashboard/directory/team-management/:t_id/physical/new-assessment/:a_id/:ass_id'
                             component={TeamPhysicalAssess} />
                      <Route exact path='/dashboard/directory/team-management/:t_id/leadership/new-assessment/:a_id/:ass_id'
                             component={TeamLeadershipAssess} />
                      <Route exact path='/dashboard/directory/team-management/:t_id/edit'
                             component={EditTeam} />
                      <Route path='/dashboard/directory/team-management/:t_id'
                             component={TeamManagement} />
                      <Route exact path='/dashboard/directory' component={Directory} />
                      <Route exact path='/dashboard/invite-to-team/:t_id' component={Invite} />
                      <Route exact path='/dashboard/invite' component={Invite} />
                      <Route exact path='/dashboard/pending-invites' component={PendingInvites} />
                      <Route exact path='/dashboard/add-sport' component={AddSport} />
                      <Route exact path="/dashboard" component={DashboardRoot} />
                    </Switch>
                  </CSSTransitionGroup>)}} />

             </div>
          </div>
          <Footer />
        </div>
      </Provider>
    )
  }
}

export default inject('user', 'setUser')(observer(DashBoard))
