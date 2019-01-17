import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import TeamLogo from '../../images/team-logo.png'

import BarChart from './components/bar-chart'
import LineChart from './components/line-chart'
import MentalInfo from './components/mental-info'
import DP from '../utils/data-proc'

export default inject('user', 'setUser', 'assDefs', 'assessments')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curSubCat: 0,
                       isCoach: computed(() => this.props.user && 'coach' == this.props.user.user_type),
                       skillSets: computed(() => { return DP.constructSkillSet(this.props.assDefs,
                                                                               this.props.assessments,
                                                                               'general-leadership',
                                                                               0,
                                                                               true) }),
                       subCats: computed(() => this.skillSets.map(ss => ({name: ss.setName,
                                                                          id: ss.id}))),
                       skillsMentalA: computed(() => {
                                        return DP.getSkillsMental(this.skillSets,
                                                                  this.curSubCat,
                                                                  true);
                                      }),
                       skillsMentalC: computed(() => {
                                        return DP.getSkillsMental(this.skillSets,
                                                                  this.curSubCat,
                                                                  false);
                                      })
                     });
  }

  componentWillMount() {

    $('.reveal-overlay').remove();
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  setSubCat = (ev, index) => {

    $(ev.target).siblings().removeClass("active");
    $(ev.target).addClass("active");
    this.curSubCat = index;
  }

  render() {

    return (
      <div className="mental" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">

            <h2 className="content-heading text-center">Assess yourself or invite a coach to assess your skills.</h2>

            <div className="group-section">
              <h3 className="group-heading">Invite Coaches</h3>
              <Link to={{ pathname: '/dashboard/invite', state: { from: 'leadership' } }}
                    className="button border icon">
                <span className="psr-icons icon-plus"></span><span> Invite a coach</span>
              </Link>
              <hr className="divider show-for-large"/>
            </div>

            <MentalInfo user={this.props.user}
                        isCoach={this.isCoach}
                        subCats={this.subCats}
                        skillsA={this.skillsMentalA}
                        skillsC={this.skillsMentalC}
                        setSubCat={this.setSubCat}
                        history={this.props.history} />
          </div>
        </div>
      </div>
    )
  }
}))
