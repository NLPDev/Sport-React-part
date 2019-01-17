import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'

class AddSport extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { sports: [] });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    if(!this.props.user) {
      Api.getUser()
        .then(user => {
          this.props.setUser(user);
          this.showAvailableSport();
        })
        .catch(err => this.props.history.push('/login'));
    } else {
      this.showAvailableSport();
    }
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }
  
  showAvailableSport = () => {

    this.sports = JSON.parse(JSON.stringify(this.props.user.chosen_sports));
  }

  updateChosen = e => {

    this.sports.map(s => {
      if (0 == e.target.name.indexOf(s.sport)) {
        s.is_chosen = e.target.checked;
        s.is_displayed = e.target.checked;
      }
    });
  }

  onSave = () => {

    let forSubmit = Object.assign({}, this.props.user);
    delete forSubmit['profile_picture_url'];

    forSubmit.chosen_sports = this.sports;

    Api.updateUser(forSubmit)
      .then(result => {
        this.refs.saveConfirmation.showConfirmation();
        Api.getUser()
          .then(user => this.props.setUser(user));
      })
      .catch(err => console.log(err));
  }

  onCancel = () => {
    this.props.history.push('/dashboard/overview')
  }

  render() {

    return (
      <div className="add-sport" ref="me">
        <UtilBar title="Add Sport" onCancel={this.onCancel} onSave={this.onSave} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <h2 className="content-heading">
              These are the sports available right now at PSR. We are working hard to add many more.
            </h2>
            <div className="group-section">
              {this.sports.map(s =>
                <div className="switch-container" key={s.sport}>
                  <div className="switch-label">{s.sport}</div>
                  <div className="switch small">
                    <input className="switch-input"
                           type="checkbox"
                           id={s.sport}
                           name={s.sport}
                           checked={s.is_chosen}
                           onChange={this.updateChosen}/>
                    <label className="switch-paddle" htmlFor={s.sport}>
                      <span className="show-for-sr">{s.sport}</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <SaveConfirmation userType={this.props.user && this.props.user.user_type}
            msg="Your change has been saved successfully."
            onClose={this.onCancel}
            ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(AddSport))
