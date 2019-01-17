import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import Api from '../api'
import TeamLogo from '../../images/team-logo.png'
import HistoryBtn from '../components/history-btn'
import BarChart from './components/bar-chart'
import RadarChart from './components/radar-chart'
import LineChart from './components/line-chart'
import Select from '../components/select'
import DP from '../utils/data-proc'
import InfoPopupTechnicalPhysical from './components/info-popup-technical-physical'

export default inject('user', 'assDefs', 'assessments')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       sport: '',
                       curType: 0,
                       skillSets: computed(() => { return DP.constructSkillSet(this.props.assDefs,
                                                                               this.props.assessments,
                                                                               this.sport,
                                                                               this.curType,
                                                                               true) }),
                       flattenSkillSet: computed(() => {
                                          if (!this.sport || this.sport.indexOf('rugby') >= 0) {
                                            return [];
                                          }
                                          const ss = this.skillSets.reduce((acc, skillSet) => {
                                                       acc = acc.concat(skillSet.childs.slice());
                                                       return acc;
                                                     }, []);
                                          return ss;
                                        }),
                       subSports: computed(() => { return DP.getSubSports(this.props.assDefs, this.user)}),
                       subSportChoices: computed(() => { return this.subSports.map(sc => sc.name); }),
                       curSubsport: '',
                       curSubsportId: 0,
                       subCatIndex: 0,
                       curAthleteHistory: computed(() => {
                                            return DP.getAthleteHistory(this.skillSets) }),
                       curCoachHistory: computed(() => {
                                          return DP.getCoachHistory(this.skillSets) }),
                       assessmentDates: computed(() => {
                                          const ds = this.curAthleteHistory.groups.concat(this.curCoachHistory.groups)
                                            .reduce((acc, group) => {
                                                     return acc.concat(group.histories)
                                                    }, [])
                                            .reduce((acc, history) => {
                                                      return acc.concat(history.values)
                                                    }, [])
                                            .map(point => {
                                                  return moment(point.date_assessed.substr(0, 10)).format('YYYY-MM-DD'); 
                                                 });
                                          return Array.from(new Set(ds));                                      
                                        }),
                       singleLineLineChart: computed(() => {
                                              return this.sport && this.sport.indexOf('rugby') >= 0
                                            }),
                       isRadarChart: computed(() => {
                                       return (('baseball' == this.sport ||
                                                'basketball' == this.sport ||
                                                'hockey' == this.sport ||
                                                'soccer' == this.sport ||
                                                'volleyball' == this.sport) && this.flattenSkillSet.length);
                                     })
                     });

  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    this.curSubsportId = this.props.match.params.sport;

    this.disposer = observe(this,
      'subSportChoices',
      change => {
        if (change.newValue.length) {
          if (this.props.match.params.sport) {
            const cat = this.subSports.find(ss => ss.id == this.props.match.params.sport);

            this.curSubsport = cat && cat.name;
            this.sport = cat.nameTop.toLowerCase();
            this.curType = cat.indexInTopCat;
          } else {
              this.curSubsport = change.newValue[0];
              this.sport = this.subSports[0].nameTop.toLowerCase();
              this.curSubsportId = this.subSports[0].id;
              history.replaceState(null, "", "/dashboard/technical-tactical/" + this.curSubsportId);
          }
          this.disposer();
        };
      });
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  getHistory = id => {

    Api.getAssessmentHistory(id)
      .then(result => {
        console.log(result);
        //this.curHistory = result;
      })
      .catch(err => console.log(err));
  }

  setSubsport = subSport => {

    this.curSubsport = subSport;

    const cat = this.subSports.find(sc => sc.name == subSport);

    if (cat.nameTop != this.sport) {
      this.sport = cat.nameTop.toLowerCase();
    }
    this.curSubsportId = cat.id;
    history.replaceState(null, "", "/dashboard/technical-tactical/" + cat.id);
    this.curType = cat.indexInTopCat;
  }

  popupTechnicalPhysical = () => {
    $('#info-popup-technical-physical').foundation('open');
  }

  render() {

    return (
      <div className="technical-tactical" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <h2 className="content-heading">Assess yourself or invite a coach to assess your skills.</h2>

            <div className="group-section">
              <h3 className="group-heading">Invite Coaches</h3>
              <Link to={{ pathname: '/dashboard/invite', state: { from: 'technical-tactical' } }}
                    className="button border icon">
                <span className="psr-icons icon-plus"></span><span> Invite a coach</span>
              </Link>
              <hr className="divider show-for-large"/>
            </div>

            <div className="group-section">
              <div className="group-heading-wrap">
                <h3 className="group-heading">Create a New Assessment</h3>
                <div className="button-group">
                  <HistoryBtn history={this.props.history} 
                              user={this.props.user}
                              link={`technical-tactical/${this.curSubsportId}`}
                              dates={this.assessmentDates}/>
                  {this.curSubsportId ?
                    <Link to={'/dashboard/technical-tactical/'  + this.curSubsportId + '/new-assessment'}
                          className="button border responsive add">
                      <span className="psr-icons icon-plus"></span>
                      <span className="show-for-large">Add new</span>
                    </Link> : null}
                </div>
              </div>
              <hr className="divider show-for-large"/>
            </div>

            <div className="group-section">
              <div className="group-heading-wrap sports-filter-wrap row">
                <h3 className="group-heading column small-12">Select Your Assessment to View</h3>
                <div className="column small-12">
                  <div className="sports-filter">
                    <Select placeholder="select"
                            choices={this.subSportChoices}
                            onSelected={this.setSubsport}
                            index={this.subSportChoices.findIndex(c => c == this.curSubsport)}
                            ref="selSubCats"/>
                      {/* <button className="button theme">Go</button> */}
                  </div>
                </div>
              </div>
              <hr className="divider show-for-large"/>
            </div>

            <div className="group-section">
              {this.isRadarChart ?
                <RadarChart title="Athlete Overview"
                            subTitle="Technical/Tactical Skills"
                            onInfoPopup={this.popupTechnicalPhysical}
                            skills={this.flattenSkillSet}/> : null }
              <LineChart title="Athlete Progress - Self Assessment"
                         singleLine={this.singleLineLineChart}
                         subTitle=""
                         color="red"
                         unit={this.curAthleteHistory.unit}
                         onInfoPopup={this.popupTechnicalPhysical}
                         histories={this.curAthleteHistory.groups.length ?
                                      this.curAthleteHistory.groups[0].histories : []}
                         groups={this.curAthleteHistory.groups}/>
              <LineChart title="Athlete Progress - Coach Assessment"
                         singleLine={this.singleLineLineChart}
                         subTitle=""
                         color="blue"
                         unit={this.curCoachHistory.unit}
                         onInfoPopup={this.popupTechnicalPhysical}
                         histories={this.curCoachHistory.groups.length ?
                                      this.curCoachHistory.groups[0].histories : []}
                         groups={this.curCoachHistory.groups}/>
            </div>

          </div>
        </div>

        <InfoPopupTechnicalPhysical />
      </div>
    )
  }
}))
