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
                       goal: {}
                      });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    Api.getGoal(this.props.match.params.g_id)
      .then(goal => {
        this.goal = goal;
      })
      .catch(err => {
        console.log(err)
      });
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }



  onSave = () => {
    this.refs.goalForm.wrappedInstance.trySubmit();
  }

  onCancel = () => {
    if ('p' == this.props.match.params.from) {
      this.props.history.push('/profile')
    } else {
      this.props.history.push('/profile/edit')
    }
  }

  onClose = () => {
    this.props.history.push('/profile')
  }

  submitForm = (goal) => {
    $('#save-confirmation').foundation('open');

    Api.updateGoal(this.goal.id, goal)
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
        <UtilBar title="Edit Goal"
                 onCancel={this.onCancel}
                 onSave={this.onSave}
                 noAutoPopup={true}
               />
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
            msg="Your change has been saved successfully."
            apiMsg="There is problem processing your request, pleaes try again later."
            onClose={this.onClose}
            ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(AddGoal))
