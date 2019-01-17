import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import CountryProvince from '../components/country-province'
import Api from '../api'
import Terms from './terms'


class SignupPersonalInfo extends Component {

  constructor(){
    super();
    this.appState = extendObservable(this,
                                     { termsCondsAccepted: false,
                                       duplicatedEmail: false,
                                       clTermsConds: '',
                                       dobText: 'm/d/yyyy',
                                       user: { user_type: '',
                                               first_name: '',
                                               last_name: '',
                                               email: '',
                                               password: '',
                                               confirm_password: '',
                                               date_of_birth: '',
                                               parental_consent: '',
                                               country: 'ca',
                                               province_or_state: '',
                                               city: '',
                                               newsletter: false,
                                               terms_conditions: false,
                                               tagline: '' },
                                       termsResolver: null,
                                       dobValid: true,
                                       parentalConsentRequired: computed(() => {
                                         const arrDate = this.user.date_of_birth.split(/-/);
                                         const dob = new Date(arrDate[0], arrDate[1] - 1, arrDate[2]);
                                         const age = new Date() - dob;

                                         if (age < 13 * 365 * 24 * 60 * 60 * 1000) {
                                           return true;
                                         } else {
                                           return false;
                                         }
                                       })
                                     });
    this.onTermsConditionsAccepted = this.onTermsConditionsAccepted.bind(this);
    this.proceedToNext = this.proceedToNext.bind(this);
  }

  componentDidMount() {
    this.user.user_type = this.props.userType;

    const date = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const self = this;
    $(ReactDOM.findDOMNode(this.refs.dob)).datetimepicker({
      format: 'm/d/Y',
      yearStart: 1930,
      yearEnd: year,
      timepicker: false,
      scrollInput: false,
      scrollMonth: false,
      scrollTime: false,
      defaultSelect: false,
      todayButton: false,
      // inline: true,
      onGenerate:function(ct){
        $(ReactDOM.findDOMNode(self.refs.lblDOB)).append($(this));
        $(this).addClass(self.user.user_type);
      },
      onSelectDate: ct => {
        this.appState.user.date_of_birth = ct.getFullYear() + '-' + (ct.getMonth() + 1) + '-' + ct.getDate();

        const selectedDate = (ct.getMonth() + 1)  + '/' + ct.getDate() + '/' + ct.getFullYear();
        this.dobText = selectedDate;
        $(ReactDOM.findDOMNode(self.refs.dob)).removeClass('empty');
        this.dobValid = true;
      }
    })

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();


    $(ReactDOM.findDOMNode(this.refs.info_form))
      .on("forminvalid.zf.abide", (ev,frm) => {
        if(this.dobText == 'm/d/yyyy') {
          this.dobValid = false;
        }
        this.refs.countryProvince.validate();
        if (!this.appState.termsCondsAccepted) {
          this.clTermsConds = ' is-visible';
        }
        this.scrollToError();
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        if(this.dobText == 'm/d/yyyy') {
          this.dobValid = false;
        }

        if (this.dobValid && this.refs.countryProvince.validate()) {
          if (this.termsCondsAccepted) {

            this.proceedToNext();
          } else {
            this.openTermsCondidtion()
                .then(this.proceedToNext);
          }
        }
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  scrollToError = () => {
    const errorField = $('.form-error.is-visible, .api-error.is-visible')[0];

    let scrollContainer;
    if($(window).width() >= 1024) {
      scrollContainer = $('.transition-container');
    } else {
      scrollContainer = $('.content');
    }

    if ($(errorField).hasClass('error-of-dob')) {
      //error of dob offsetTop is relative to its label, less than 140
      scrollContainer.scrollTop($('.calender-label')[0].offsetTop);
    } else {
      if (errorField.offsetTop > 140) {
        //regular field error offsetTop is relative to .transition-container, is greater than 150
        scrollContainer.scrollTop(errorField.offsetTop - 80);
      }
    }
  }

  onTermsConditionsAccepted() {

    this.appState.termsCondsAccepted = true;
    this.user.terms_conditions = true;
    this.appState.clTermsConds = '';
    if (this.termsResolver) this.termsResolver();
  }

  openTermsCondidtion() {

    $("#terms").foundation('open');
    return new Promise((res, rej) => {
      this.termsResolver = res;
    });
  }

  proceedToNext() {
    Api.createUser(this.user)
      .then(user => {
        if (user.id) {
          localStorage.setItem('user_id', user.id);
          localStorage.setItem('jwt_token', user.token);
          this.props.setUser(user);
          this.props.onNext(user);
        }
        this.duplicatedEmail = false;
      })
      .catch(e => {
        const errObj = JSON.parse(e.responseText);

        if (errObj && errObj.email) {
          this.duplicatedEmail = true;
          this.scrollToError();
        }
        // console.log('error', e);
      });
  }

  show() {

    $(ReactDOM.findDOMNode(this.refs.me)).addClass('active').outerWidth();
    $(ReactDOM.findDOMNode(this.refs.me)).addClass('fade-in');
  }

  hide() {

    const self = $(ReactDOM.findDOMNode(this.refs.me));
    self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'))
  }

  setCountry = country => {

    this.user.country = 'Canada' == country ? 'ca' : 'us';
  }

  setProvince = province => {

    this.user.province_or_state = province;
  }

  setCity = e => {

    this.user.city = e.target.value;
  }


  render() {
    return (
      <div className="tab-content" ref="me">
        <div className="row align-center main-content-container">
          <div className="column large-6 content-box">
            <form data-abide noValidate ref='info_form'>
              <h2 className="section-heading">Account Information</h2>
              <p className="api-error label">There is error in your form.</p>
              <label>First Name
                <input type="text" placeholder="Firstname" required tabIndex="1"
                       onChange={e => { this.appState.user.first_name = e.target.value }}/>
                <span className="form-error">This field is required.</span>
              </label>
              <label>Last Name
                <input type="text" placeholder="Lastname" required tabIndex="2"
                       onChange={e => { this.appState.user.last_name = e.target.value }}/>
                <span className="form-error">This field is required.</span>
              </label>
              <label>Email
                <input type="email" placeholder="name@mail.com" required tabIndex="3"
                       onChange={e => { this.appState.user.email = e.target.value }}/>
                <span className="form-error">Please enter a valid email.</span>
                <span className={"api-error " + (this.duplicatedEmail ? "is-visible" : "")}>This email already exists.</span>
              </label>
              <label>password
                <input type="password" placeholder="●●●●●●●●" required tabIndex="4"
                   onChange={e => { this.appState.user.password = e.target.value;
                                    this.appState.user.confirm_password = e.target.value }}/>
                <span className="form-error"> This field is required.</span>
              </label>

              {/* <label ref="lblDOB" className="calender-label">Date of Birth
                <input type="text" id="birthDate" placeholder="mm/dd/yyyy" ref='dob' required
                       onChange={e => { this.appState.user.date_of_birth = e.target.value }}/>

                <span className="psr-icons icon-calender"></span>
                <span className="form-error">Please enter a valid date.</span>
              </label> */}

              <label ref="lblDOB" className={"calender-label" + (this.dobValid ? "" : " is-invalid-label") }>Date of Birth
                <div className="selected-date empty" ref="dob" tabIndex="5">{this.dobText}</div>

                <span className="psr-icons icon-calender"></span>
                <span className={"form-error error-of-dob" + (this.dobValid ? "" : " is-visible")}>Please enter a valid date.</span>
              </label>

              <label className={'custom-checkbox parental-consent' + (this.appState.parentalConsentRequired ? ' show' : '')}>
                <input type="checkbox" required={this.appState.parentalConsentRequired}
                       onChange={e => { this.appState.user.parental_consent = 'on' == e.target.value ? true : false }}/>
                <span className="checkbox-indicator"></span>
                <span>I have parental consent</span>
                <span className="form-error">This field is required.</span>
              </label>
              <CountryProvince setCountry={this.setCountry}
                               setProvince={this.setProvince}
                               countryIndex={this.user.country == 'ca' ? 0 : 1}
                               province={this.user.province_or_state}
                               tabIndex="6"
                               ref='countryProvince'/>
              <label>City
                <input type="text" tabIndex="7"
                       placeholder="vancouver"
                       onChange={this.setCity} required/>
                <span className="form-error"> This field is required.</span>
              </label>


              <label className="custom-checkbox">
                <input type="checkbox" tabIndex="8"
                       onChange={e => { this.appState.user.newsletter = 'on' == e.target.value ? true : false }}/>
                <span className="checkbox-indicator"></span>
                <span>Sign up to our newsletter</span>
              </label>
              <label className="custom-checkbox">
                <span className="label-text">I agree to the <Link to="#" className="link-text" data-open="terms">Terms & Conditions</Link></span>
                <span className={"form-error" + this.appState.clTermsConds}>
                  Please read and accept the Terms and Conditions.
                </span>
              </label>
              <button type="submit" className="button expanded theme" value="Next" tabIndex="9">
                Next</button>
            </form>
            <p className="page-link">Already have an account? <Link to="/login" className="link-text">Log in</Link></p>
          </div>
          <Terms userType={this.user.user_type} onAccept={this.onTermsConditionsAccepted} />
        </div>
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(SignupPersonalInfo))
