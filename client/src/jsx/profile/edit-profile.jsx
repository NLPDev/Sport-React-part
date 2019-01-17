import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import UtilBar from '../components/util-bar'
import Footer from '../components/footer'
import ProfileForm from '../components/profile-form'
import SaveConfirmation from '../components/save-confirmation'

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       goal: {}
                      });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  onSave = () => {
    $('#profile-form').submit();
  }

  onCancel = () => {
    this.props.history.push('/profile')
  }

  showPopup = () => {
    $('#save-confirmation').foundation('open');
  }

  showSaveConfirmation = () => {
    this.refs.saveConfirmation.showConfirmation();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  render() {

    return (
      <div>
        <UtilBar title="Edit Profile"
          onCancel={this.onCancel}
          onSave={this.onSave}
          noAutoPopup={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <ProfileForm ref="profileForm"
              forProfile={true}
              onSubmit={this.showPopup}
              onSuccess={this.showSaveConfirmation}/>
          </div>
        </div>

        <SaveConfirmation userType={this.user ? this.user.user_type : ""}
            msg="Your change has been saved successfully."
            onClose={this.onCancel}
            ref="saveConfirmation"/>
      </div>
    )
  }
}))
