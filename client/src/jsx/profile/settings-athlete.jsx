import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'

import Header from '../components/header'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import AthleteGeneral from './settings-athlete-general'
import PaymentInfo from './settings-athlete-payment'
import ManageCoach from './settings-athlete-manage-coach'
import Api from '../api'
import SaveConfirmation from '../components/save-confirmation'
import DateTimePicker from '../utils/jquery.datetimepicker'

class SettingsAthlete extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curComp: null,
                       athlete: null,
                       curCoach: null,
                       creditCard: null,
                       permissions: [] });
    this.showComp = this.showComp.bind(this);
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    this.curComp = this.refs.general;
    if (!this.props.user) {
      Api.getUser()
        .then(user => {
          this.athlete = user;
          this.props.setUser(user);
          if (this.props.match.params.coachId) {
            this.curCoach = user.linked_users.find(u => u.id == this.props.match.params.coachId);
            this.showComp('manageCoach', this.curCoach);
            history.replaceState(null, "", "/setting/athlete/");
          }
          this.getCreditCardInfo();
        })
        .catch(err => {
          this.props.history.push('/login');
        })
    } else {
      this.athlete = this.props.user;
      this.getCreditCardInfo();
    }
  }

  getCreditCardInfo = () => {

    Api.getCreditCardInfo()
      .then(creditCard => {
        this.creditCard = creditCard;
      })
      .catch(err => console.log(err));

    Api.getPaymentPlan()
      .then(plan => {
        this.props.user.paymentPlan = plan.plan;
      })
      .catch(err => console.log(err));
  }

  showComp(comp, coach) {

    this.curComp.hide();
    this.refs[comp].show();
    this.curComp = this.refs[comp];
    $('body').scrollTop(0);

    if ('manageCoach' == comp) {
      Api.getPermissionSetting(coach.id)
        .then(result => {
          this.permissions = result;
        })
        .catch(err => console.log(err));
    }
  }

  saveConfirmation = () => {
    this.refs.saveConfirmation.showConfirmation();
  }

  showApiError = () => {
    this.refs.saveConfirmation.showApiError();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  render() {
    return (
      <div className="content-container settings athlete">
        <div className="row expanded">
          <div className="column show-for-large sidebar-container">
            <Sidebar curActive="Settings" history={this.props.history}/>
          </div>
          <div className="column content-right">
            <Header pageTitle="Settings" curActive="Settings" history={this.props.history} showProfile={true}/>

            <div className="tab-content-container" ref="tabContainer">
              <AthleteGeneral showManageCoach={(c) => { this.curCoach = c; this.showComp('manageCoach', c); }}
                              showPayment={() => this.showComp('payment')}
                              ref="general"
                              history={this.props.history}
                              creditCard={this.creditCard}
                              athlete={this.props.user}
                              onSuccess={this.saveConfirmation}/>
              <PaymentInfo ref="payment"
                           paymentPlan={this.athlete && this.athlete.paymentPlan}
                           onBack={() => this.showComp('general')}
                           curCard={this.creditCard}
                           athlete={this.props.user}
                           onSuccess={this.saveConfirmation}/>
              <ManageCoach ref="manageCoach"
                           onBack={() => this.showComp('general')}
                           coach={this.curCoach}
                           permissions={this.permissions}
                           onApiError={this.showApiError}
                           onSuccess={() => {
                                          Api.getUser()
                                            .then(user => {
                                              this.props.setUser(user);
                                            })
                                          this.saveConfirmation();
                                          this.showComp('general')
                                     }}/>
            </div>
            <SaveConfirmation userType="athlete"
              msg="Your change has been saved successfully."
              apiMsg="Sorry we have problem handling your request, please try again later."
              ref="saveConfirmation"/>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default inject('user', 'setUser')(observer(SettingsAthlete))
