import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'
import StatusForm from './components/status-form'

class AddStatus extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       isApiErr: false,
                       apiErrMsg: "There is problem processing your request, pleaes try again later.",
                      });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = () => {
    this.refs.statusForm.wrappedInstance.trySubmit();
  }

  onCancel = () => {
    this.props.history.push('/dashboard/my-status')
  }

  onClose = () => {
    if(this.isApiErr) return;
    this.onCancel();
  }

  submitForm = (preCompeteStatus) => {
    $('#save-confirmation').foundation('open');

    if (!preCompeteStatus.team_id) {
      delete preCompeteStatus.team_id;
    }
    Api.addPreCompetitionAss(preCompeteStatus)
      .then(result => {
        this.isApiErr = false;
        this.showConfirmation();
      })
      .catch(err => {
        if (400 == err.status) {
          const errObj = JSON.parse(err.responseText);
          if(errObj.date) {
            this.apiErrMsg = errObj.date;
          }
        }
        this.isApiErr = true;
        this.showApiError();
      });
  }

  showApiError = () => {
    this.refs.saveConfirmation.showApiError();
  }

  showConfirmation = () => {
    this.refs.saveConfirmation.showConfirmation();
  }

  render() {

    return (
      <div className="add-status" ref="me">
        <UtilBar title="Pre-Competiton Status"
          onCancel={this.onCancel}
          onSave={this.onSave}
          noAutoPopup={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <StatusForm onSubmit={this.submitForm}
                        onSuccess={this.showConfirmation}
                        onApiError= {this.showApiError}
                        ref="statusForm"/>
          </div>
        </div>

        <SaveConfirmation userType={this.user && this.user.user_type}
                          msg="Pre-Competiton status has been created successfully."
                          apiMsg={this.apiErrMsg}
                          onClose={this.onClose}
                          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user')(observer(AddStatus))
