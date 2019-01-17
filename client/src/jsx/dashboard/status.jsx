import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import PreCompeteLevel from './components/precompete-level'
import Api from '../api'
import InfoPopupPrecomp from './components/info-popup-precomp'
import GenericPopup from './components/generic-popup'


export default inject('user')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       compititionTitle: '',
                       compititionDate: '',
                       levelStress: 0,
                       levelFatigue: 0,
                       levelHydration: 0,
                       levelInjury: 0,
                       levelWeeklyLoad: 0,
                       compititionGoal: '',
                       compititionTeam: '',
                       compititionTeamId: -1,
                       preCompeteId: -1
                     });
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    Api.getPreCompitionAss()
      .then(preCompitions => {

        if (!preCompitions.length) return;

        const preCompete = preCompitions[0];
        this.compititionTitle = preCompete.title;
        this.compititionDate = preCompete.date;
        this.levelStress = preCompete.stress;
        this.levelFatigue = preCompete.fatigue;
        this.levelHydration = preCompete.hydration;
        this.levelInjury = preCompete.injury;
        this.levelWeeklyLoad = preCompete.weekly_load;
        this.compititionGoal = preCompete.goal;
        this.preCompeteId = preCompete.id;

        if (preCompete.team_id) {
          this.compititionTeamId = preCompete.team_id;
          if (this.user && this.user.team_memberships) {
            this.getCompitionTeam();
          } else {
            const disposer = observe(this,
                                     'user',
                                     change => {
                                       if (change.newValue.team_memberships) {
                                         this.getCompitionTeam();
                                         disposer();
                                       }
                                     });
          }
        }
      })
      .catch(err => console.log(err));
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  getCompitionTeam = () => {

    this.compititionTeam = this.user.team_memberships.find(t => t.id == this.compititionTeamId).name;
  }

  gotoAddNew = () => {
    if(this.preCompeteId >= 0) {
      $('#generic-popup').foundation('open');
    } else {
      this.props.history.push('/dashboard/my-status/add')
    }
    
  }

  render() {

    return (
      <div className="my-status" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <h2 className="content-heading text-center">
              {this.preCompeteId > 0 ?
                "Assess your current pre-competition levels based on a low / low-med / med-high / high scale."
                :
                "Get Ready! Before your next big game or tournament, share how you're doing and what your goal is with your coach."
              }
            </h2>
            <div className="group-section">
              <div className="group-heading-wrap">
                <h3 className="label light-text">
                  Pre-Competiton Status Self-Assessments
                  <span className="psr-icons icon-info" data-open="info-popup-precomp"></span>
                </h3>
                {/* <Link to="/dashboard/my-status/add" className="button border responsive add">
                  <span className="psr-icons icon-plus"></span>
                  <span className="show-for-large">Add new</span>
                </Link> */}
                <button className="button border responsive add" onClick={this.gotoAddNew}>
                  <span className="psr-icons icon-plus"></span>
                  <span className="show-for-large">Add new</span>
                </button>
              </div>
            </div>
            {this.preCompeteId > 0 ?
              <div className="group-section">
                <hr className="divider full-width theme" />
                <div className="group-heading-wrap">
                  <div>
                    <h3 className="group-heading">{this.compititionTitle}</h3>
                    <div className="small-text">
                      {this.compititionDate}<br />{this.compititionTeam}
                    </div>
                  </div>

                  <Link to={`/dashboard/my-status/edit/${this.preCompeteId}`}
                        className="underline small-text">Edit Status</Link>
                </div>
              </div>
              :
              <div className="group-section">
                <p className="text-center">No assessments yet</p>
              </div>
            }

            <div className="group-section">
              <hr className="divider full-width" />
              <h3 className="group-heading">Self-assessment</h3>
              <ul className="no-bullet">
                <PreCompeteLevel title='Stress'
                                 readOnly={true}
                                 level={this.levelStress} />
                <PreCompeteLevel title='Fatigue'
                                 readOnly={true}
                                 level={this.levelFatigue} />
                <PreCompeteLevel title='Injury'
                                 readOnly={true}
                                 level={this.levelInjury} />
                <PreCompeteLevel title='Weekly Load'
                                 readOnly={true}
                                 level={this.levelWeeklyLoad} />
                <PreCompeteLevel title='Hydration'
                                 readOnly={true}
                                 level={this.levelHydration} />
              </ul>
            </div>
            {this.compititionGoal ?
              <div className="group-section">
                <h3 className="group-heading">Goal</h3>
                <p className="dark-text">{this.compititionGoal}</p>
              </div>
            : null }
            {this.preCompeteId == -1 ?
              <Link to="/dashboard/my-status/add" className="button theme expanded">Add your first assessment</Link>
              : null
            }
          </div>
        </div>
        <InfoPopupPrecomp />
        <GenericPopup userType="athlete"
          msg="Adding a new Pre-Competition Assessment will then show up as your new current Assessment in your dashboard."
          confirmLink="/dashboard/my-status/add"
          confirmBtnText="Let's go"
          declineBtnText="No, thanks"/>
      </div>
    )
  }
}))
