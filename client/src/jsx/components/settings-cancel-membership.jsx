import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

// import Api from '../api'
import CancelMembershipConfirmation from './cancel-membership-confirmation'

class SettingsCancelMembership extends Component {

  constructor() {
    super();
    extendObservable(this,
                     { popup: null });
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  showPopup = () => {
    $('#cancel-membership-confirmation').foundation('open');
  }


  render() {
    return (
      <div className="content-section" ref="me">
        <h2 className="section-heading">Cancel Membership</h2>
        <p className="dark-text">We'd be sad to see you go, but this is where you would cancel your account.</p>
        <button className="button expanded theme" onClick={this.showPopup}>Cancel Membership</button>
        <CancelMembershipConfirmation userType={this.props.userType}
                                      history={this.props.history} />
      </div>
    )
  }
}

export default observer(SettingsCancelMembership)
