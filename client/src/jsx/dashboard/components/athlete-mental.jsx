import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../../api'
import BarChart from './bar-chart'
import RadarChart from './radar-chart'
import LineChart from './line-chart'
import MentalInfo from './mental-info'
import Select from '../../components/select'
import DP from '../../utils/data-proc'

export default inject('user', 'assDefs', 'assessments')(observer(class extends Component {

  constructor(props) {

    super(props);
    extendObservable(this,
                     { skillSetsMental: computed(() => {
                                          return DP.constructSkillSet(this.props.assDefs,
                                                                      this.props.assessments,
                                                                      'general-leadership',
                                                                      0,
                                                                      true) }),
                       curSubCatMental: 0,
                       skillsMentalA: computed(() => {
                                        return DP.getSkillsMental(this.skillSetsMental,
                                                                  this.curSubCatMental,
                                                                  true);
                                      }),
                       skillsMentalC: computed(() => {
                                        return DP.getSkillsMental(this.skillSetsMental,
                                                                  this.curSubCatMental,
                                                                  false);
                                      }),
                       subCatsMental: computed(() => this.skillSetsMental.map(ss => ({name: ss.setName,
                                                                                      id: ss.id})))
                     });
  }

  setSubCatMental = (ev, index) => {

    if (ev) {
      $(ev.target).siblings().removeClass("active");
      $(ev.target).addClass("active");
    }
    this.curSubCatMental = index;
    return this.skillSetsMental[index].id;
  }

  render() {

    return (
      <div className="" ref="mental">
        <MentalInfo isCoach={true}
                    subCats={this.subCatsMental}
                    skillsA={this.skillsMentalA}
                    skillsC={this.skillsMentalC}
                    setSubCat={this.setSubCatMental}
                    athleteId={this.props.match.params.a_id}
                    teamId={this.props.match.params.t_id} />
      </div>
    )
  }
}));
