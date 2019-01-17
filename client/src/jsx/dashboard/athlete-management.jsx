import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Route, Link, Switch} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject, Provider} from 'mobx-react'

import Api from '../api'
import ContentCard from './components/content-card'
import AthleteOverview from './components/athlete-overview'
import AthleteTechnical from './components/athlete-technical'
import AthletePhysical from './components/athlete-physical'
import AthleteMental from './components/athlete-mental'
import AthleteStatus from './components/athlete-status'
import BarChart from './components/bar-chart'
import RadarChart from './components/radar-chart'
import LineChart from './components/line-chart'
import Select from '../components/select'
import DP from '../utils/data-proc'
import AvatarRed from '../../images/avatar-red.png'

export default inject('user', 'setUser', 'assDefs')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       curComp: 'overview',
                       assessments: null,
                       curSport: '',
                       curSubCat: 0,
                       assDefs: computed(() => this.props.assDefs),
                       linkedAthlete: computed(() =>
                                        this.user &&
                                        this.user.linked_users.find(u => u.id == this.props.match.params.a_id)),
                       allowedSports: computed(() => {
                                        if (this.linkedAthlete) {
                                          return this.linkedAthlete.granted_assessment_top_categories
                                                   .reduce((acc, cat) => {
                                                      if (cat.id < 10000) {
                                                        acc.push(cat.name);
                                                      }
                                                      return acc;
                                                   }, []);
                                        } else {
                                          return [];
                                        }
                                      }),
                       subSports: computed(() => { return DP.getSubSports(this.props.assDefs,
                                                                          this.user,
                                                                          this.props.match.params.a_id)}),
                       subSportChoices: computed(() => { return this.subSports.map(sc => sc.name); }),
                       curSubsport: '',
                       curSubsportIndex: computed(() => {
                                           return this.subSportChoices.findIndex(c => c == this.curSubsport)
                                         }),
                       curSubsportId: 0,
                       curType: 0,
                       forContentCard: computed(() => {
                                         let props = { themeColor: 'red',
                                                       sports: this.allowedSports }
                                         if (this.linkedAthlete) {
                                           props.name = `${this.linkedAthlete.first_name} ${this.linkedAthlete.last_name}`,
                                           props.tagline = this.linkedAthlete.tagline;
                                           props.avatar = this.linkedAthlete.profile_picture_url || AvatarRed;
                                         }
                                         return props;
                                       })
                     });
  }

  componentDidMount() {

    if (this.props.match.params.a_id) {
      Api.retrieveAssessments(this.props.match.params.a_id)
        .then(assessments => {
          this.assessments = assessments;
        })
        .catch(err => { console.log(err) });
    } else {
      this.props.history.push('/dashboard/directory');
    }

    observe(this, 'allowedSports',
            change => { if (change.newValue.length) {
                          this.curSport = change.newValue[0].toLowerCase();
                          if (this.overview) {
                            this.overview.wrappedInstance.setSport(this.curSport);
                          }
                        } });
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  setSport = (ev, sport) => {

    $(ev.target).siblings().removeClass('active');
    $(ev.target).addClass('active');
    this.curSport = sport.toLowerCase();
    this.curType = 0;

    const cat = this.subSports.find(sc => sc.nameTop == sport);

    this.curSubsport = cat.name;
    this.curSubsportId = cat.id;

    if (this.overview) {
      this.overview.wrappedInstance.setSport(this.curSport);
    }
  }

  render() {

    return (
      <Provider assessments={this.assessments} team={null}>
        <div ref="me">
          <div className="breadcrumbs">
            <Link to="/dashboard/directory">Dashboard</Link><span> / </span>
            <span>{this.linkedAthlete ? this.linkedAthlete.first_name + ' ' + this.linkedAthlete.last_name : ''}
            </span>
          </div>
          <div className="row align-center main-content-container">
            <div className="column content-column">
                <h2 className="content-heading">
                  {'Review and assess ' + (this.linkedAthlete ? this.linkedAthlete.first_name : '') + "'s skills."}
                </h2>
                <div className="group-section">
                  <ContentCard {...this.forContentCard}/>
                </div>

                {'overview' == this.curComp ?
                  <div className="group-section">
                  <h3 className="group-heading">Sports</h3>
                  <div className="button-group sports">
                    {this.allowedSports.map((sport, i) =>
                      <button className={"button border" + (0 == i ? " active" : "")}
                              key={i}
                              onClick={(ev) => { this.setSport(ev, sport); }}>{sport}</button>)}
                  </div>
                </div> : null }

              <div className="pill-nav-container">
                <div className="pill-nav">
                    <Link to={'/dashboard/directory/athlete-management/'+ this.props.match.params.a_id + '/overview'}
                          className={'nav-item ' + (this.props.match.params.action == 'overview' ? 'active' : '')}>Overview</Link>
                    <Link to={'/dashboard/directory/athlete-management/' + this.props.match.params.a_id + '/status'}
                      className={"nav-item " + (this.props.match.params.action == 'status' ? 'active' : '')}>Status & Goals</Link>
                    <Link to={'/dashboard/directory/athlete-management/'+ this.props.match.params.a_id + '/' +
                      (this.props.match.params.subSport ? this.props.match.params.subSport + '/' : '') +
                      (this.props.match.params.cat_id ? this.props.match.params.cat_id : '')}
                      className={"nav-item " + ((!this.props.match.params.action) ||
                                      parseInt(this.props.match.params.action) ? 'active' : '')}
                      >
                      Technical / Tactical
                    </Link>
                    <Link to={'/dashboard/directory/athlete-management/'+ this.props.match.params.a_id + '/physical'}
                      className={"nav-item " + (this.props.match.params.action == 'physical' ? 'active' : '')}
                      >Physical</Link>
                    <Link to={'/dashboard/directory/athlete-management/'+ this.props.match.params.a_id + '/leadership'}
                      className={"nav-item " + (this.props.match.params.action == 'leadership' ? 'active' : '')}>Leadership</Link>

                </div>
              </div>

              <div className="tab-content-container">

                <Switch key={location.pathname} location={location}>
                  <Route exact path='/dashboard/directory/athlete-management/:a_id/overview'
                         render={(props) => <AthleteOverview {...props}
                                                             ref={r => { this.overview = r }}
                                                             curSport={this.curSport} />} />

                  <Route exact path='/dashboard/directory/athlete-management/:a_id/physical'
                         component={AthletePhysical} />

                  <Route exact path='/dashboard/directory/athlete-management/:a_id/leadership'
                         component={AthleteMental} />

                  <Route exact path='/dashboard/directory/athlete-management/:a_id/status'
                         component={AthleteStatus} />

                  <Route path='/dashboard/directory/athlete-management/:a_id/:subSport?/:cat_id?'
                         component={AthleteTechnical} />
                  </Switch>

                  <div className="tab-content" ref="teams">

                  </div>

                  <div className="tab-content" ref="return">

                  </div>

                  <div className="tab-content" ref="achieve">

                  </div>
                </div>
            </div>
          </div>
        </div>
      </Provider>
    )
  }
}))
