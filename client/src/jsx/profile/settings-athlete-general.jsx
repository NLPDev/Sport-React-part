import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import AvatarBlue from '../../images/avatar-blue.png'
import GeneralInfo from '../components/settings-general-info'
import CancelMembership from '../components/settings-cancel-membership'
import Footer from '../components/footer'

class SettingsAthleteGeneral extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { });
    this.editCard = this.editCard.bind(this);
  }

  componentDidMount() {
  }

  show() {

    $(ReactDOM.findDOMNode(this.refs.me)).addClass('active').outerWidth();
    $(ReactDOM.findDOMNode(this.refs.me)).addClass('fade-in');
  }

  hide() {

    const self = $(ReactDOM.findDOMNode(this.refs.me));
    self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'))
  }

  editCard(e) {

    e.preventDefault();

    this.props.showPayment();
  }

  render() {

    const { creditCard } = this.props;
    return (
      <div className="tab-content active fade-in" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">
              <GeneralInfo user={this.props.athlete} onSuccess={this.props.onSuccess}/>

              <div className="content-section">
                <h2 className="section-heading">Manage Coaches Accounts</h2>
                <p className="dark-text">Unlink your account from a coach and manage permissions here.</p>
                <ul className="no-bullet user-list">
                  {this.props.athlete &&
                     this.props.athlete.linked_users.map((c,i) => <li className="profile-pic-wrap link"
                                                                  onClick={() => this.props.showManageCoach(c)} key={i}>
                                                                  <div className="profile-thumb"
                                                                    style={{background: "url(" + (c.profile_picture_url ? c.profile_picture_url : AvatarBlue)
                                                                                                  + ") #fff no-repeat center center"}}>
                                                                  </div>
                                                                  {/* <img src={c.profile_picture_url}
                                                                       className="profile-thumb"
                                                                       title="coach profile pic" />  */}
                                                                  <span>{c.first_name + ' ' + c.last_name}</span>
                                                              </li>)}
                </ul>
              </div>
              <div className="content-section">
                <h2 className="section-heading">Update Payment Info</h2>
                {/* <label>Name on card
                  <input type="text"
                         readOnly
                         value={creditCard && creditCard.cardholder_name}/>
                </label> */}
                <label>Card Number
                  <input type="text"
                         readOnly
                         value={"●".repeat(12) + (creditCard ? creditCard.last4 : "●".repeat(4))} />
                </label>
                {/* <label>Billing Address</label>
                <p className="dark-text address">
                  {creditCard ? creditCard.address_line1 : ''}<br/>
                  {creditCard ? creditCard.address_zip: ''}<br/>
                  {creditCard ? ((creditCard.address_city || '') +
                                 (creditCard.address_state ? ', ' + creditCard.address_state : '')) : null}<br/>
                  {creditCard ? creditCard.address_country: ''}
                </p> */}
                <Link to=""
                      onClick={this.editCard}
                      className="link-text">Edit card</Link>
              </div>
              <CancelMembership userType="athlete" history={this.props.history}/>

          </div>
        </div>
        {/* <Footer /> */}
      </div>
    )
  }
}

export default observer(SettingsAthleteGeneral)
