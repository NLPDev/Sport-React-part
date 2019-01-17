import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import AvatarRed from '../../images/avatar-red.png'
import GeneralInfo from '../components/settings-general-info'
import CancelMembership from '../components/settings-cancel-membership'

class SettingsCoachGeneral extends Component {

  constructor() {

    super();
    extendObservable(this, { });
  }

  componentDidMount() {
  }

  show() {

    $(ReactDOM.findDOMNode(this.refs.me)).addClass('active').outerWidth();
    $(ReactDOM.findDOMNode(this.refs.me)).addClass('fade-in');
  }

  hide() {

    const self = $(ReactDOM.findDOMNode(this.refs.me));
    self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'))
  }

  render() {
    return (
      <div className="tab-content active fade-in" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">
              <GeneralInfo user={this.props.coach} onSuccess={this.props.onSuccess}/>

              {/* commented for phase 1 launch */}
              {/* <div className="content-section">
                <h2 className="section-heading">Manage Team Accounts</h2>
                <p className="dark-text">Unlink your account from a team and/or the athletes within them.</p>
                <ul className="no-bullet user-list">
                  {this.props.coach.teams.map(t => <li className="profile-pic-wrap link" key={t.name}
                                                       onClick={() => this.props.showTeam(t)}>
                                                     <img src={DummyPic} className="profile-thumb"
                                                          title="team profile pic" />
                                                     <span>{t.name}</span>
                                                   </li>)}
                </ul>
              </div> */}

              <div className="content-section">
                <h2 className="section-heading">Manage Athlete Accounts</h2>
                <p className="dark-text">Unlink your account from athletes you manage individually.</p>
                <ul className="no-bullet user-list">
                  {this.props.coach &&
                    this.props.coach.linked_users.map((a, i) => <li className="profile-pic-wrap link" key={i}
                                                               onClick={() => this.props.showAthlete(a)}>
                                                             <div className="profile-thumb"
                                                               style={{background: "url(" + (a.profile_picture_url ? a.profile_picture_url : AvatarRed)
                                                                + ") #fff no-repeat center center"}}>
                                                             </div>
                                                             {/* <img src={DummyPic} className="profile-thumb"
                                                                  title="athlete profile pic" /> */}
                                                             <span>{a.first_name + ' ' + a.last_name}</span>
                                                           </li>)}
                </ul>
              </div>
              <CancelMembership userType="coach" history={this.props.history}/>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(SettingsCoachGeneral)
