import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer} from 'mobx-react'

import VisaCard from '../../images/visa.png'
import MasterCard from '../../images/mastercard.png'
import AmericanExpress from '../../images/american-express.png'
import Api from '../api'
import config from '../../../config'

class PaymentForm extends Component {

  constructor() {

    super();
    this.appState = extendObservable(this,
                                     { creditCard: computed(() => this.props.curCard),
                                       orgPaymentPlan: computed(() => this.props.athlete &&
                                                                      this.props.athlete.paymentPlan),
                                       isVisa: false,
                                       isMC: false,
                                       isAE: false,
                                       cardHolderName: '',
                                       cardNumberValid: false,
                                       cardNumberShowError: false,
                                       expiryValid: false,
                                       expiryShowError: false,
                                       cvcValid: false,
                                       cvcShowError: false,
                                       postalCodeValid: false,
                                       postalCodeShowError: false,
                                       plan: '',
                                       agreementValidated: false,
                                       clAgreement: computed(() =>
                                         (!this.props.agreementAccepted) &&
                                         this.agreementValidated ? ' is-visible' : ''),
                                       referralCode: '' });
  }

  componentDidMount() {

    observe(this,
            'creditCard',
            change => {

              if (change.newValue) {

                this.cardHolderName = this.creditCard.cardholder_name;
                this.cardNumber.update({ placeholder: "●".repeat(12) + this.creditCard.last4 });
                this.cardExpiry.update({ placeholder: this.creditCard.exp_month + '/' + this.creditCard.exp_year.substring(2) });
                this.cardPostalCode.update({ value: this.creditCard.address_zip });
              }
            });

    observe(this,
            'orgPaymentPlan',
            change => {
              if (change.newValue) {
                this.plan = change.newValue;
              }
            });

    this.stripe = Stripe(config.stripe_key);
    const elements = this.stripe.elements();
    const options = {
      style: {
        base: {
          color: '#003059',
          lineHeight: '39px',
          '::placeholder': {
            color: '#cacaca',
            fontWeight: 300
          },
        }
      }
    }
    if (this.props.curCard) {
      options.placeholder = "●".repeat(12) + this.props.curCard.last4;
    }
    this.cardNumber = elements.create('cardNumber', options);

    this.cardNumber.mount('#card-number');

    this.cardNumber.on('change', ev => {
      if ('mastercard' == ev.brand) {
        this.isVisa = false;
        this.isMC = true;
        this.isAE = false;
      } else if ('visa' == ev.brand) {
        this.isVisa = true;
        this.isMC = false;
        this.isAE = false;
      } else if ('amex' == ev.brand) {
        this.isVisa = false;
        this.isMC = false;
        this.isAE = true;
      } else {
        this.isVisa = false;
        this.isMC = false;
        this.isAE = false;
      }
      this.cardNumberValid = ev.complete;
    });

    this.cardNumber.on('focus', ev => {
      $('#card-number').addClass('focus');
    })

    this.cardNumber.on('blur', ev => {
      this.cardNumberShowError = !this.cardNumberValid;
      $('#card-number').removeClass('focus');
    })

    this.cardExpiry = elements.create('cardExpiry', options);

    this.cardExpiry.mount('#card-expiry');
    this.cardExpiry.on('change', ev => {

      this.expiryValid = ev.complete;
    });

    this.cardExpiry.on('focus', ev => {
      $('#card-expiry').addClass('focus');
    })

    this.cardExpiry.on('blur', ev => {
      $('#card-expiry').removeClass('focus');
      this.expiryShowError = !this.expiryValid;
    });

    this.cardCVC = elements.create('cardCvc', options);

    this.cardCVC.mount('#card-cvc');
    this.cardCVC.on('change', ev => {

      this.cvcValid = ev.complete;
    })

    this.cardCVC.on('focus', ev => {
      $('#card-cvc').addClass('focus');
    })

    this.cardCVC.on('blur', ev => {
      $('#card-cvc').removeClass('focus');
      this.cvcShowError = !this.cvcValid;
    })

    this.cardPostalCode = elements.create('postalCode', options);

    this.cardPostalCode.mount('#post-code');
    this.cardPostalCode.on('change', ev => {

      this.postalCodeValid = ev.complete;
    });

    this.cardPostalCode.on('focus', ev => {
      $('#post-code').addClass('focus');
    })

    this.cardPostalCode.on('blur', ev => {
      $('#post-code').removeClass('focus');
      this.postalCodeShowError = !this.postalCodeValid;
    });


    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    $(ReactDOM.findDOMNode(this.refs.payment_form))
      .on('submit', ev => {
        ev.preventDefault();

        if (!(this.cardNumberValid &&
              this.expiryValid &&
              this.cvcValid &&
              this.postalCodeValid &&
              this.plan)) {
          this.agreementValidated = true;
          this.cardNumberShowError = !this.cardNumberValid;
          this.expiryShowError = !this.expiryValid;
          this.cvcShowError = !this.cvcValid;
          this.postalCodeShowError = !this.postalCodeValid;

          setTimeout(this.scrollToError, 10);
//          this.scrollToError();
          return;
        }


        if (this.props.agreementAccepted) {
          this.submitPayment();
        } else {
          this.props.openAgreement();
        }
      });

    if (this.props.referral) {
      this.referralCode = this.props.referral;
    }
  }

  submitPayment() {

    if (this.props.onSubmitPayment) this.props.onSubmitPayment();

    this.stripe.createToken(this.cardNumber, { name: this.cardHolderName })
      .then(result => {
              if (!result.error) {
                return Api.sendPaymentInfo(result.token.id, this.plan);
              } else {
                throw result.error;
              }
            })
//      .then(result => { return Api.sendPaymentPlan(this.plan); })
      .then(result => { 
        console.log('done');
        this.props.toNext(); })
      .catch(e => console.log(e));
  }

  scrollToError = () => {

    const errorField = $('.form-error.is-visible')[0];

    let scrollContainer;
    if($(window).width() >= 1024) {
      scrollContainer = $('.transition-container');
    } else {
      scrollContainer = $('.content');
    }

    if (errorField.offsetTop > 140) {
      scrollContainer.scrollTop(errorField.offsetTop -80);
    }
  }

  setCardHolderName = (ev) => {

    this.cardHolderName = ev.target.value;
  }

  setPlan = (plan) => {

    this.plan = plan;
  }

  trySubmit = () => {

    $(ReactDOM.findDOMNode(this.refs.payment_form)).submit();
  }

  render(){
    return (
      <form data-abide noValidate ref='payment_form'>
        <p className="api-error label">There is error in your form.</p>
        <fieldset>
          <legend className="section-heading">Card Information</legend>

          <label>Name on card
            <input type="text"
                   onChange={this.setCardHolderName}
                   value={this.cardHolderName}
                   placeholder="Name as it appears on card" />
            <span className="form-error">This field is required.</span>
          </label>
          <label className={"card-number-label" + (this.cardNumberShowError ? " is-invalid-label" : "")}>Card number</label>
            <div id="card-number"
            />
            <span className={"label form-error" + (this.cardNumberShowError ? " is-visible" : "")}>Please enter an valid card number.</span>

          <div className="credit-cards">
            <img src={VisaCard} title="visa-card" className={this.isVisa ? 'active' : ''}/>
            <img src={MasterCard} title="master-card" className={this.isMC ? 'active' : ''}/>
            <img src={AmericanExpress} title="american-express-card" className={this.isAE ? 'active' : ''}/>
          </div>
          <div className="row">
            <div className="column small-6 ">
              <label className={this.expiryShowError ? " is-invalid-label" : ""}>Expiry</label>
              <div id='card-expiry'
                ></div>
              <span className={"label form-error" + (this.expiryShowError ? " is-visible" : "")}>Invalid value.</span>
            </div>
            <div className="column small-6 ">
              <label className={this.cvcShowError ? " is-invalid-label" : ""}>ccv</label>
              <div id='card-cvc'
                ></div>
              <span className={"label form-error" + (this.cvcShowError ? " is-visible" : "")}>Invalid value.</span>
            </div>
          </div>
          <label className={this.postalCodeShowError ? " is-invalid-label" : ""}>Postal/Zip code</label>
            <div id='post-code'
            />
            <span className={"label form-error" + (this.postalCodeShowError ? " is-visible" : "")}>Please enter an valid Postal/Zip code.</span>

        </fieldset>

        <fieldset >
          <legend className="section-heading">Choose Plan</legend>
          <label className="custom-radio"
            >
            <input type="radio" name="plan" value="monthly" id="monthly" required
                   checked={'monthly' == this.plan}
                   onChange={() => { this.setPlan('monthly') }}/>
            <span className="radio-indicator"></span><span>Monthly $5/mo</span>
          </label>
          <label className="custom-radio"
            >
            <input type="radio" name="plan" value="yearly" id="yearly" required
                   checked={'yearly' == this.plan}
                   onChange={() => { this.setPlan('yearly') }}/>
            <span className="radio-indicator"></span><span>Yearly $50/yr</span>
            <span className="form-error"> This field is required.</span>
          </label>
        </fieldset>

        {this.props.showBtn ?
          <div>
            <label className="custom-checkbox">
              <span>I agree to the
                <Link to="#" className="link-text" data-open="user-agreement">User Agreement</Link>
              </span>
              <span className={"form-error " + this.clAgreement}>This field is required.</span>
            </label>
            <button type="submit" className="button expanded theme" value="Next"
              >Pay now</button>
          </div>
        : null }
      </form>
    )
  }
}

export default observer(PaymentForm)
