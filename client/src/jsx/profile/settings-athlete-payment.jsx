import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import UtilBar from '../components/util-bar'
import PaymentForm from '../components/payment-form'
import Footer from '../components/footer'
// import SaveConfirmation from '../components/save-confirmation'

class SettingsAthletePayment extends Component {

  constructor() {
    super()
    extendObservable(this,
                     {});
  }

  componentDidMount() {
  }

  onSave = () => {

    this.refs.paymentForm.trySubmit();
  }

  show() {

    $(ReactDOM.findDOMNode(this.refs.me)).addClass('active').outerWidth();
    $(ReactDOM.findDOMNode(this.refs.me)).addClass('fade-in');
  }

  hide() {

    const self = $(ReactDOM.findDOMNode(this.refs.me));
    self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'))
  }

  showPopup = () => {

    $('#save-confirmation').foundation('open');
  }

  render() {
    return (
      <div className="tab-content" ref="me">
        <UtilBar title="Update Payment Information" onCancel={this.props.onBack} onSave={this.onSave}
                 noAutoPopup={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">

            <PaymentForm showBtn={false}
                         athlete={this.props.athlete}
                         ref="paymentForm"
                         onSubmitPayment={this.showPopup}
                         agreementAccepted={true}
                         curCard={this.props.curCard}
                         toNext={this.props.onSuccess}/>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(SettingsAthletePayment)
