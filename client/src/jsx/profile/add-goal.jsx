import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import GoalForm from '../components/goal-form'
import SaveConfirmation from '../components/save-confirmation'

class AddGoal extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       goal: { description: '',
                               achieve_by: 'm/d/yyyy',
                               is_achieved: false }
                     });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = () => {
    this.refs.goalForm.wrappedInstance.trySubmit();
  }

  onCancel = () => {
    this.props.history.push('/profile/edit')
  }

  onClose = () => {
    this.props.history.push('/profile')
  }

  submitForm = (goal) => {
    $('#save-confirmation').foundation('open');

    Api.addGoal(goal)
      .then(result => {
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
      <div className="add-goal" ref="me">
        <UtilBar title="Add Goal"
                 onCancel={this.onCancel}
                 onSave={this.onSave}
                 noAutoPopup={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <GoalForm onSubmit={this.submitForm}
                      onSuccess={this.showConfirmation}
                      onApiError= {this.showApiError}
                      goal={this.goal}
                      ref="goalForm"/>
          </div>
        </div>

        <SaveConfirmation userType={this.user && this.user.user_type}
                          msg="Your goal has been added successfully."
                          apiMsg="There is problem processing your request, pleaes try again later."
                          onClose={this.onClose}
                          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user')(observer(AddGoal))
