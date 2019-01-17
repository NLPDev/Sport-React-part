import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import AvatarRed from '../../images/avatar-red.png'
import Api from '../api'

class SettingsCoachManageAthlete extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { athleteLinked: true });
    this.saveAthlete = this.saveAthlete.bind(this);
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

  onCancel = () => {
    this.athleteLinked = true;
    this.props.onBack();
  }

  saveAthlete() {

    if (!this.athleteLinked) {
      Api.unlinkUser(this.props.athlete.email)
        .then(result => {
          this.props.onSuccess();
          this.athleteLinked = true;  //restore to initial for remaining athletes
        })
        .catch(err => {
          console.log(err);
          this.props.onApiError();

        })
    }
  }

  render() {
    return (
      <div className="tab-content" ref="me">
        <UtilBar title="Manage Athlete" onCancel={this.onCancel}
                 onSave={this.saveAthlete}
                 userLinked={this.athleteLinked}/>
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <div className="profile-pic-wrap page-head">
              <div className="profile-thumb" style={{background: "url(" +
              ((this.props.athlete && this.props.athlete.profile_picture_url) || AvatarRed)
              + ") #fff no-repeat center center"}}></div>
              {/* <img src={this.props.athlete.profile_picture_url || DummyPic} className="profile-thumb" /> */}
              <span>{(this.props.athlete && this.props.athlete.first_name) + ' ' +
                     (this.props.athlete && this.props.athlete.last_name)}</span>
            </div>
            <form data-abide noValidate>
              <fieldset>
                <legend className="section-heading">Unlink athlete account</legend>
                <p className="dark-text">Unlinking an athlete's account will remove them from your PSR account. They will however keep all assessments done by you.</p>
                <label className="custom-radio">
                  <input type="radio" name="unlink" value="link"
                    checked={this.athleteLinked}
                    onChange={() => { this.athleteLinked = true }} />
                  <span className="radio-indicator"></span><span>Link</span>
                </label>
                <label className="custom-radio">
                  <input type="radio" name="unlink"
                         value="unlink"
                         checked={!this.athleteLinked}
                         onChange={() => { this.athleteLinked = false }} />
                  <span className="radio-indicator"></span><span>Unlink (this cannot be undone!)</span>
                </label>
              </fieldset>
            </form>
          </div>

        </div>
      </div>
    )
  }
}

export default observer(SettingsCoachManageAthlete)
