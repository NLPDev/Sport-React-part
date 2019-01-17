import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../../api'
import BarChart from './bar-chart'
import RadarChart from './radar-chart'
import LineChart from './line-chart'
import Select from '../../components/select'
import DP from '../../utils/data-proc'

export default inject('user', 'assDefs', 'assessments', 'team')(observer(class extends Component {

  constructor(props) {

    super(props);
    extendObservable(this,
                     { curSubsport: '',
                       curSubsportId: 0,
                       curType: 0,
                       curSport: 'soccer',
                       skillSets: computed(() => {
                                    return DP.constructSkillSet(this.props.assDefs,
                                                                this.props.assessments,
                                                                this.curSport,
                                                                this.curType,
                                                                true)
                                  }),
                       flattenSkillSet: computed(() => {
                                          return DP.flattenSkillsForRadar(this.skillSets, this.curSport);
                                        }),
                       curSubsportIndex: computed(() => {
                                           return this.subSportChoices.findIndex(c => c == this.curSubsport)
                                         }),
                       isRadarChart: computed(() => {
                                       return DP.isRadarChart(this.curSport);
                                     }),
                       subSports: computed(() => {
                                    if (this.props.match.params.t_id) {

                                      return this.getTeamSubsports();
                                    } else {
                                      return DP.getSubSports(this.props.assDefs,
                                                             this.props.user,
                                                             this.props.match.params.a_id)
                                    }
                                  }),
                       subSportChoices: computed(() => { return this.subSports.map(sc => sc.name); }),
                       curAthleteHistory: computed(() => {
                                            return DP.getAthleteHistory(this.skillSets)
                                          }),
                       curCoachHistory: computed(() => {
                                          return DP.getCoachHistory(this.skillSets)
                                        }),
                       singleLineLineChart: computed(() => {
                                              return this.curSport &&
                                                     this.curSport.indexOf('rugby') >= 0
                                            }),
                     });
  }

  componentDidMount() {

    if (this.subSportChoices.length) {
      this.determineCurSubsport();
    } else {
      const disposer = observe(this,
                               'subSportChoices',
                               change => {
                                 if (change.newValue.length) {
                                   this.determineCurSubsport();
                                   disposer();
                                 };
                               });
    }
  }

  getTeamSubsports = () => {

    if (!(this.props.assDefs && this.props.team)) return [];

    return this.props.assDefs.find(assDef => assDef.id == this.props.team.sport_id).childs;
  }

  determineCurSubsport = () => {

    if (this.props.match.params.subSport) {

      const cat = this.subSports.find(ss => ss.id == this.props.match.params.subSport);

      this.curSubsport = cat && cat.name;
      this.curSport = cat.nameTop.toLowerCase();
      this.curSubsportId = cat.id;
    } else {
      this.curSubsport = this.subSportChoices[0];
      if (this.props.match.params.t_id) {
        this.curSport = this.props.assDefs.find(assDef => assDef.id == this.props.team.sport_id).name;
        this.curSubsportId = this.subSports[0].id;
      } else {
        this.curSport = this.subSports[0].nameTop.toLowerCase();
        this.curSubsportId = this.subSports[0].id;
      }
    }
  }

  setSubsport = subSport => {

    this.curSubsport = subSport;

    const cat = this.subSports.find(sc => sc.name == subSport);

    this.curSubsportId = cat.id;

    let newUrl;

    if (!this.props.match.params.t_id) {

      this.curSport = cat.nameTop.toLowerCase();

      history.replaceState(null,
                       '',
                       '/dashboard/directory/athlete-management/' + this.props.match.params.a_id + '/' +
                       this.curSubsportId);

      this.curType = cat.indexInTopCat;
    } else {
      this.curType = this.subSports.findIndex(ss => ss.name == subSport);
    }
  }

  newAssUrl = () => {

    if (this.props.match.params.t_id) {


      return `/dashboard/directory/team-management/${this.props.match.params.t_id}/technical-tactical/new-assessment/${this.props.match.params.a_id}/${this.curSubsportId}`
    } else {

      return `/dashboard/technical-tactical/${this.curSubsportId}/new-assessment/${this.props.match.params.a_id}`;
    }
  }
  render() {

    return (
      <div className="" ref="technical">
        <div className="group-section">
          <div className="group-heading-wrap">
            <h3 className="group-heading">Create a New Assessment</h3>
            <div className="button-group">
              {/*<button className="button border responsive">
                <span className="psr-icons icon-calender"></span>
                <span className="show-for-large"> History</span>
              </button>*/}
              <Link to={this.newAssUrl()} className="button border responsive add">
                <span className="psr-icons icon-plus"></span>
                <span className="show-for-large">Add new</span>
              </Link>
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
                        index={this.curSubsportIndex}/>
              </div>
            </div>
          </div>
          <hr className="divider show-for-large"/>
        </div>

        <div className="group-section">
          {this.isRadarChart && this.flattenSkillSet.length ?
            <RadarChart title="Athlete Overview"
                        subTitle="Technical/Tactical Skills"
                        skills={this.flattenSkillSet}/> : null
          }
          <LineChart title="Athlete Progress - Self Assessment"
                     singleLine={this.singleLineLineChart}
                     subTitle=""
                     color="red"
                     unit={this.curAthleteHistory.unit}
                     histories={this.curAthleteHistory.groups.length ?
                                  this.curAthleteHistory.groups[0].histories : []}
                     groups={this.curAthleteHistory.groups}/>
          <LineChart title="Athlete Progress - Coach Assessment"
                     singleLine={this.singleLineLineChart}
                     subTitle=""
                     color="blue"
                     unit={this.curCoachHistory.unit}
                     histories={this.curCoachHistory.groups.length ?
                                  this.curCoachHistory.groups[0].histories : []}
                     groups={this.curCoachHistory.groups}/>
        </div>

      </div>
    )
  }
}));
