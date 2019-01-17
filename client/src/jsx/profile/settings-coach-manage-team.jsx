import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import UtilBar from '../components/util-bar'
import DummyPic from '../../images/dummyPic.jpg'

class SettingsCoachManageTeam extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { });
    this.saveTeam = this.saveTeam.bind(this);
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

  saveTeam() {

    //on success
    this.refs.props.onSuccess();
  }

  render() {
    return (
      <div className="tab-content" ref="me">
        <UtilBar title="Manage Team" onCancel={this.props.onBack} onSave={this.saveTeam} />
        <div className="row align-center">
          <div className="column content-column">
            <div className="profile-pic-wrap page-head">
              <img src={DummyPic} className="profile-thumb" />
              <span>{this.props.team.name}</span>
            </div>

            <div className="main-content-container">
              <form data-abide noValidate>

                <div className="content-section">
                  <h2 className="section-heading">Pass account to a new coach</h2>
                  <p className="dark-text">Teams cannot be deleted from PSR. If you won't be coaching this team any more, you need to link it to the coach taking over. All assessments done by you will remain active in the team's history.</p>
                  <label className="new-coach-email">New coach's email
                    <input type="email" name="email" placeholder="Coach's email address"/>
                    <span className="right-arrow psr-icons icon-right-arrow"></span>
                  </label>
                </div>

                <div className="content-section">
                  <h2 className="section-heading">Select athletes to individually manage</h2>
                  <p className="dark-text">Select athletes from this team you wish to manage individually. An invitation will be sent to them once you save that they need to accept on their end.</p>
                  <label className="custom-radio">
                    <input type="radio" name="" value="" />
                    <span className="radio-indicator"></span><span>Anguinana, Alex</span>
                  </label>
                  <label className="custom-radio">
                    <input type="radio" name="" value="" />
                    <span className="radio-indicator"></span><span>Alvarez, Leonel</span>
                  </label>
                  <label className="custom-radio">
                    <input type="radio" name="" value="" />
                    <span className="radio-indicator"></span><span>Andrezinho</span>
                  </label>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(SettingsCoachManageTeam)
