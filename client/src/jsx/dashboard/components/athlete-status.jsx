import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import Api from '../../api'
import StatusForm from './status-form'
import PreCompeteLevel from './precompete-level'

export default inject('user')(observer(class extends Component {

  constructor(props) {

    super(props);
    extendObservable(this,
                     { preCompeteStatus: {},
                       teamName: computed(() => {
                                   if (this.user && this.preCompeteStatus.team_id) {
                                     const allTeams = this.user.team_ownerships.concat(this.user.team_memberships);
                                     const teamThisStatus = allTeams.find(t => t.id == this.preCompeteStatus.team_id);

                                     if (teamThisStatus) {
                                       return teamThisStatus.name;
                                     }
                                     return '';
                                   }
                                 }),
                       user: computed(() => this.props.user) });
  }

  componentDidMount() {

    Api.getPreCompitionAss(this.props.match.params.a_id)
      .then(status => {
        if (status.length) {
          this.preCompeteStatus = status[0];
        }
      })
      .catch(err => console.log(err));
  }

  render() {

    return (
      <div>
        <div className="group-section">
          <hr className="divider full-width theme" />
          <div className="group-heading-wrap">
            <div>
              <h3 className="group-heading">{this.preCompeteStatus.title}</h3>
              <div className="small-text">
                {this.preCompeteStatus.date}<br />{this.teamName}
              </div>
            </div>
          </div>
        </div>
        <div className="group-section">
          <h3 className="group-heading">Assessment</h3>
          <ul className="no-bullet">
            <PreCompeteLevel title='Stress'
                             level={this.preCompeteStatus.stress} />
            <PreCompeteLevel title='Fatigue'
                             level={this.preCompeteStatus.fatigue} />
            <PreCompeteLevel title='Injury'
                             level={this.preCompeteStatus.injury} />
            <PreCompeteLevel title='Weekly Load'
                             level={this.preCompeteStatus.weekly_load} />
            <PreCompeteLevel title='Hydration'
                             level={this.preCompeteStatus.hydration}/>
          </ul>
        </div>

        {this.preCompeteStatus.goal ?
          <div className="group-section">
            <h3 className="group-heading">Goal</h3>
            <p className="dark-text">{this.preCompeteStatus.goal}</p>
          </div>
        : null }
      </div>
    )
  }
}));
