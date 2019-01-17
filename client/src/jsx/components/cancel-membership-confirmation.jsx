import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'

class CancelMembershipConfirmation extends Component {

  constructor() {

    super();
  }

  componentWillMount() {
    $('#cancel-membership-confirmation').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation()
    .on("closed.zf.reveal", () => {
      //$('#cancel-membership-confirmation').remove();
      $('.spinner').hide();
      $('.cancel-api-error').hide();
      $('.confirm-content').show();
      $('.btn-confirm-cancel-membership').click(this.cancelMembership);
    })
    $('.btn-confirm-cancel-membership').click(this.cancelMembership);
  }

  cancelMembership = () => {
    this.showSpinner();
    Api.cancelMembership()
      .then(result => {
        $('#cancel-membership-confirmation').foundation('close');
        this.props.history.push('/login')
      })
      .catch(err => {
        this.showApiError();
      });
  }

  showApiError = () => {
    $('.spinner').fadeOut(50, () => $('.cancel-api-error').fadeIn())
  }

  showSpinner = () => {
    $('.confirm-content').fadeOut(100, () => $('.spinner').fadeIn(100))
  }

  closePopup = () => {
    $('#cancel-membership-confirmation').foundation('close');
  }

  render() {

    return (

      <div className={"reveal cancel-membership-confirmation " + (this.props.userType ? this.props.userType : '')} id="cancel-membership-confirmation"
          data-reveal data-animation-in="fade-in fast" data-animation-out="fade-out fast"
          data-reset-on-close={true}
          // data-close-on-click={false}
           ref="me">
         <div className="flex-container">

           <div className="spinner" ref="spinner">
             <span className="psr-icons icon-spinner"></span>
           </div>

           <div className="confirmation-content content-box cancel-api-error" ref="apiError">
             <button className="close-button" data-close="" aria-label="Close modal" type="button">
               <span aria-hidden="true" className="psr-icons icon-x"></span>
             </button>
             <p>Sorry, we have problem processing your request, please try again later.</p>
             <button className="button theme" data-close="">Ok</button>
           </div>

           <div className="confirmation-content content-box confirm-content" ref="confirmContent">
             <button className="close-button" data-close="" aria-label="Close modal" type="button">
               <span aria-hidden="true" className="psr-icons icon-x"></span>
             </button>
             <h5>Thanks so much for being a part of Personal Sport Record. </h5>
             <p>If you want to cancel your subscription please select confirm cancelation below. If you're not wanting to cancel please click No Thanks, I'm staying.</p>
             <button className="button theme btn-confirm-cancel-membership" >Confirm&nbsp;Cancelation</button>
             <div className="dismiss" data-close="">No Thanks, I'm staying!</div>
           </div>
         </div>
      </div>


    )
  }
}

export default observer(CancelMembershipConfirmation)
