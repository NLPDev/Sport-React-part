import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'
import StatusForm from './components/status-form'

class EditStatus extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       preCompeteStatus: {},
                       isApiErr: false,
                       apiErrMsg: "There is problem processing your request, pleaes try again later.",
                      });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    Api.getPreCompitionAss(this.props.match.params.precompete_id)
      .then(preCompitions => {

        if (!preCompitions.length) return;

        this.preCompeteStatus = preCompitions[0];
      })
      .catch(err => console.log(err));
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
    Api.updatePreCompetitionAss(preCompeteStatus, this.props.match.params.precompete_id)
      .then(result => {
        this.isApiErr = false;
        this.showConfirmation();
      })
      .catch(err => {
        this.showApiError();
      })
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
        <UtilBar title="Edit Pre-Competiton Status"
          onCancel={this.onCancel}
          onSave={this.onSave}
          noAutoPopup={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <StatusForm onSubmit={this.submitForm}
                        onSuccess={this.showConfirmation}
                        onApiError={this.showApiError}
                        preCompeteStatus={this.preCompeteStatus}
                        ref="statusForm"/>
          </div>
        </div>

        <SaveConfirmation userType={this.user && this.user.user_type}
                          msg="You change has been saved successfully."
                          apiMsg={this.apiErrMsg}
                          onClose={this.onClose}
                          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(EditStatus))
