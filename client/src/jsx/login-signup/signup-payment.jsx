import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'

import Header from '../components/header'
import PaymentForm from '../components/payment-form'
import UserAgreement from './user-agreement'




class SignupPayment extends Component {

  constructor() {
    super();
    extendObservable(this,
                     { agreementAccepted: false,
                       toNextOnAgreementAccepted: false });
  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  openAgreement = () => {

    $('#user-agreement').foundation('open');
    this.toNextOnAgreementAccepted = true;
  }

  onAgreementAccepted = () => {

    $('#user-agreement').foundation('close');
    this.agreementAccepted = true;
    if (this.toNextOnAgreementAccepted) {
      this.refs.paymentForm.submitPayment();
    }
  }

  show() {

    $(ReactDOM.findDOMNode(this.refs.me)).addClass('active').outerWidth();
    $(ReactDOM.findDOMNode(this.refs.me)).addClass('fade-in');
  }

  hide() {

    const self = $(ReactDOM.findDOMNode(this.refs.me));
    self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'))
  }

  render() {
    return (
      <div className="tab-content" ref="me">
        <div className="row align-center main-content-container">
          <div className="column large-6 content-box">
            <PaymentForm showBtn={true}
                         toNext={this.props.onNext}
                         referral={this.props.referral}
                         openAgreement={this.openAgreement}
                         agreementAccepted={this.agreementAccepted} ref="paymentForm"
                         onSubmitPayment={this.props.onSubmitPayment}/>
          </div>
          <UserAgreement onAccepted={this.onAgreementAccepted}/>
        </div>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(SignupPayment))
