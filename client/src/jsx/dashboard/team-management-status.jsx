import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import PreCompeteLevel from './components/precompete-level'
import Select from '../components/select'
import AvatarRed from '../../images/avatar-red.png'


const AthletePreCompete = (props) => (

  <li>
    <div className="profile-pic-wrap theme link">
      <Link to={`/dashboard/directory/team-management/${props.team.id}/athlete/${props.athlete.id}/status`}>
        <div className="profile-thumb"
             style={{background: "url(" + AvatarRed
                + ") #fff no-repeat center center"}}>
        </div>
        <span>{`${props.athlete.first_name}, ${props.athlete.last_name}`}</span>
      </Link>
    </div>
    <div className="group-section status-info">
      <h4 className="comp-title">{props.title}</h4>
      <div>{props.date}<br/>{props.team && props.team.name}</div>
    </div>
    <hr className="divider full-width"/>

    <div className="group-section">
      <h4 className="group-heading">Self-assessment</h4>
      <ul className="no-bullet">
        <PreCompeteLevel readOnly={true} title='Stress' level={props.stress} />
        <PreCompeteLevel readOnly={true} title='Fatigue' level={props.fatigue} />
        <PreCompeteLevel readOnly={true} title='Injury' level={props.injury} />
        <PreCompeteLevel readOnly={true} title='Weekly Load' level={props.weekly_load} />
        <PreCompeteLevel readOnly={true} title='Hydration' level={props.hydration} />
      </ul>
    </div>
    <div className="group-section">
      <h3 className="group-heading">Goal</h3>
      <p className="dark-text">{props.goal}</p>
    </div>
    <hr className="divider" />
  </li>
)

export default inject('user', 'team')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     {
                       searchStr: '',
                       allPreCompetes: [],
                       sections: computed(() => {

                                   const filterFunc = status => {
                                           const lowerFirst = status.athlete.first_name.toLowerCase();
                                           const lowerLast = status.athlete.last_name.toLowerCase();
                                           const lowerSearch = this.searchStr.toLowerCase();

                                           return lowerFirst.indexOf(lowerSearch) >= 0 ||
                                                  lowerLast.indexOf(lowerSearch) >= 0;
                                         };
                                   const filtered = this.allPreCompetes.filter(filterFunc);

                                   return filtered.reduce((acc, status) => {

                                            const letter = status.athlete.first_name[0].toUpperCase();
                                            const section = acc.find(s => s.letter == letter);

                                            if (section) {
                                              section.athletes.push(status);
                                            } else {
                                              acc.push({letter, athletes: [status]});
                                            }
                                            return acc;
                                          }, []);
                                 })
                     });
  }

  componentDidMount() {

    Api.getTeamPreCompeteStatus(this.props.match.params.t_id)
      .then(preCompeteStatuses => {

        this.allPreCompetes = preCompeteStatuses;
      })
      .catch(err => {

      });
  }


  render() {

    return (
      <div className="team-management-content">
        <label className="search" >
          search
          <input type="text"
                 placeholder="Search for an athlete"
                 value={this.searchStr}
                 onChange={e => this.searchStr = e.target.value}/>
        </label>
        <div className="search-result">
          {this.sections.map(section =>
            <div key={section.letter}>
              <h3 className="letter-heading">{section.letter}</h3>
              <ul className="no-bullet">
                {section.athletes.map(athlete => <AthletePreCompete {...athlete} team={this.props.team}/>)}
              </ul>
            </div>)}
        </div>
      </div>
    )
  }
}))
