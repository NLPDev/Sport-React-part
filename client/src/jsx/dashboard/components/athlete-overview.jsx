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
                     { curSport: '',
                       teamSport: computed(() => {
                                    if (this.props.assDefs && this.props.team) {
                                      return this.props.assDefs.find(def => def.id == this.props.team.sport_id).name;
                                    } else {
                                      return '';
                                    }
                                  }),
                       skillSets: computed(() => { 
                                    return DP.constructSkillSet(this.props.assDefs,
                                                                this.props.assessments,
                                                                this.curSport,
                                                                0,
                                                                true)
                                  }),
                       flattenSkillSet: computed(() => {
                                          return DP.flattenSkillsForRadar(this.skillSets, this.curSport);
                                        }),
                       isRadarChart: computed(() => {
                                       return DP.isRadarChart(this.curSport);
                                     })
                     });
  }

  componentDidMount() {

    if (this.props.match.params.t_id) {
      if (this.teamSport) {
        this.curSport = this.teamSport;
      } else {
        const disposer = observe(this,
                                 'teamSport',
                                 change => {
                                   if (change.newValue) {
                                     this.curSport = change.newValue;
                                     disposer();
                                   }
                                 });
      }
    }
  }

  setSport = (sport) => {
    this.curSport = sport;
  }

  render() {

    return (
      <div className="" ref="overview">
        <h3 className="group-heading">Assessment Overviews</h3>
        <div className="row">
          <div className="column small-12 large-6">
          {this.isRadarChart && this.flattenSkillSet.length ?
            <RadarChart title="Athlete Overview"
                        subTitle="Technical/Tactical Skills"
                        skills={this.flattenSkillSet}/> : null
          }
          </div>
          {/*<div className="column small-12 large-6">
            <BarChart title="Overview" subTitle="Physical"/>
          </div>*/}
        </div>
          {/* <div className="column small-12 large-6">
            <BarChart title="Overview" subTitle="Physical"/>
          </div> */}

        <div className="row">
          <div className="column small-12 large-6">
          {/*
            <LineChart title="Athlete Progress"
                       subTitle="20m"
                       skills={this.skills}
                       values={[]}/>
          */}
          </div>
          <div className="column small-12 large-6">
          {/*
            <RadarChart title="Overview"
                        subTitle="Fundamental Movement Skills (Part A)"
                        skills={this.skills}/>
          */}
          </div>
        </div>
      </div>
    )
  }
}));
