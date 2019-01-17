import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'


class SignupProgress extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { paymentActive: computed(() => {
                         return 'profile' == this.props.step || 'payment' == this.props.step;
                       }),
                       paymentClickable: computed(() => {
                         return 'payment' != this.props.step && 'personalInfo' != this.props.enabledStep ?
                                ' clickable' : '';
                       }),
                       profileClickable: computed(() => {
                         return 'profile' != this.props.step && 'profile' == this.props.enabledStep ?
                                ' clickable' : '';
                       })
                     });
    this.checkPaymentEnabled = this.checkPaymentEnabled.bind(this);
    this.checkProfileEnabled = this.checkProfileEnabled.bind(this);
  }

  checkPaymentEnabled(e) {

    //if ('payment' == this.props.enabledStep || 'profile' == this.props.enabledStep) {
      this.props.onStepChange('payment');
    //}
  }

  checkProfileEnabled(e) {

    if ('profile' != this.props.enabledStep) return;
    this.props.onStepChange('profile');
  }

  render() {

    return (
      <div className="signup-progress header-text">
        <div className={'step active' + ('personalInfo' == this.props.step ? '' : ' clickable')} 
             onClick={() => this.props.onStepChange('personalInfo')}>1.Personal Info</div>
        {'athlete' == this.props.userType ?
          <div onClick={this.checkPaymentEnabled}
               className={'step' + (this.paymentActive ? ' active' : '') + this.paymentClickable}>2.Payment</div> : null}
        <div onClick={this.checkProfileEnabled}
             className={'step' + ('profile' == this.props.step ? ' active' : '') + this.profileClickable}>
             {('athlete' == this.props.userType ? '3' : '2') + '.Profile'}
        </div>
      </div>
    )
  }
}

export default observer(SignupProgress)
