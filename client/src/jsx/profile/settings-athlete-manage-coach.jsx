import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import AvatarBlue from '../../images/avatar-blue.png'
import Api from '../api'


class SettingsAthleteManageCoach extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { coachLinked: true });
    this.onSave = this.onSave.bind(this);
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
    this.coachLinked = true;
    this.props.onBack();
  }

  onSave = () => {
    if (!this.coachLinked) {

      Api.unlinkUser(this.props.coach.email)
        .then(result => {
          this.props.onSuccess();
          this.coachLinked = true;
        })
        .catch(err => {
          this.props.onApiError();
        });
    } else {

      Api.updatePermissions(this.props.coach.id, this.props.permissions)
        .then(result => {

          this.props.onSuccess();
        })
        .catch(err => {
          console.log('err: ', err);
          this.props.onApiError();
        });
    }
  }

  setPermission = (e, i) => {

    const permission = this.props.permissions.find(p => p.assessment_top_category_id == i);

    permission.assessor_has_access = e.target.checked;
  }

  setCoachLinked = e => {

    console.log(e.target.checked);
  }

  render() {
    return (
      <div className="tab-content" ref="me">
        <UtilBar title="Manage Coaches" onCancel={this.onCancel} onSave={this.onSave}/>
        <div className="row align-center main-content-container">
          <div className="column content-column ">
            <div className="profile-pic-wrap page-head">
              <div className="profile-thumb" style={{background: "url(" +
              ((this.props.coach && this.props.coach.profile_picture_url) || AvatarBlue)
              + ") #fff no-repeat center center"}}></div>
              {/* <img src={this.props.coach && this.props.coach.profile_picture_url || DummyPic}
                   className="profile-thumb" /> */}
              <span>{(this.props.coach && this.props.coach.first_name) + ' ' +
                     (this.props.coach && this.props.coach.last_name)}</span>
            </div>
            <form>
              <fieldset>
                <legend className="section-heading">Manage Permissions</legend>
                <p className="dark-text">This coach is currently linked to the following features of your PSR account. You can edit what they can control here.</p>
                {this.props.permissions.map(p =>
                  <label className="custom-radio">
                    <input type="checkbox" name="permission"
                           checked={p.assessor_has_access}
                           value={p.assessment_top_category_name}
                           onChange={(e) => this.setPermission(e, p.assessment_top_category_id)}/>
                    <span className="radio-indicator"></span><span>{p.assessment_top_category_name}</span>
                  </label> )}
              </fieldset>
              <fieldset>
                <legend className="section-heading">Unlink coach account</legend>
                <p className="dark-text">Unlinking a coach's account will remove them from your PSR account. You will however keep all assessments done by them.</p>
                <label className="custom-radio">
                  <input type="radio" name="unlink" value="link"
                         onChange={() => { this.coachLinked = true }}
                         checked={this.coachLinked}/>
                  <span className="radio-indicator"></span><span>Link</span>
                </label>
                <label className="custom-radio">
                  <input type="radio" name="unlink" value="unlink"
                         onChange={() => { this.coachLinked = false }}
                         checked={!this.coachLinked}/>
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

export default observer(SettingsAthleteManageCoach)




render() {
    return (
      <div className="tab-content" ref="me">
        <UtilBar title="Manage Coaches" onCancel={this.onCancel} onSave={this.onSave}/>
        <div className="row align-center main-content-container">
          <div className="column content-column ">
            <div className="profile-pic-wrap page-head">
              <div className="profile-thumb" style={{background: "url(" +
              ((this.props.coach && this.props.coach.profile_picture_url) || AvatarBlue)
              + ") #fff no-repeat center center"}}></div>
              {/* <img src={this.props.coach && this.props.coach.profile_picture_url || DummyPic}
                   className="profile-thumb" /> */}
              <span>{(this.props.coach && this.props.coach.first_name) + ' ' +
                     (this.props.coach && this.props.coach.last_name)}</span>
            </div>
            <form>
              <fieldset>
                <legend className="section-heading">Manage Permissions</legend>
                <p className="dark-text">This coach is currently linked to the following features of your PSR account. You can edit what they can control here.</p>
                {this.props.permissions.map(p =>
                  <label className="custom-radio">
                    <input type="checkbox" name="permission"
                           checked={p.assessor_has_access}
                           value={p.assessment_top_category_name}
                           onChange={(e) => this.setPermission(e, p.assessment_top_category_id)}/>
                    <span className="radio-indicator"></span><span>{p.assessment_top_category_name}</span>
                  </label> )}
              </fieldset>
              <fieldset>
                <legend className="section-heading">Unlink coach account</legend>
                <p className="dark-text">Unlinking a coach's account will remove them from your PSR account. You will however keep all assessments done by them.</p>
                <label className="custom-radio">
                  <input type="radio" name="unlink" value="link"
                         onChange={() => { this.coachLinked = true }}
                         checked={this.coachLinked}/>
                  <span className="radio-indicator"></span><span>Link</span>
                </label>
                <label className="custom-radio">
                  <input type="radio" name="unlink" value="unlink"
                         onChange={() => { this.coachLinked = false }}
                         checked={!this.coachLinked}/>
                  <span className="radio-indicator"></span><span>Unlink (this cannot be undone!)</span>
                </label>
              </fieldset>
            </form>
          </div>
        </div>

      </div>
    )
  }
