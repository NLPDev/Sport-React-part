import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'

class TwoStepConfirmation extends Component {

  constructor() {

    super();
  }

  componentDidMount() {
    this.popup = $(ReactDOM.findDOMNode(this.refs.me))
    this.popup.foundation()
    .on("closed.zf.reveal", () => {
      this.popup.find('.spinner').hide();
      this.popup.find('.success-content').hide();
      this.popup.find('.confirm-api-error').hide();
      this.popup.find('.confirm-content').show();
      this.popup.find('.proceed').click(this.props.onProceed)
    })
  }

  showApiError = () => {
    this.popup.find('.spinner').fadeOut(50, () => this.popup.find('.confirm-api-error').fadeIn()).bind(this)
  }

  showSpinner = () => {
    this.popup.find('.confirm-content').fadeOut(100, () => this.popup.find('.spinner').fadeIn(100)).bind(this)
  }

  showConfirmation = () => {
    this.popup.find('.spinner').fadeOut(50, () => this.popup.find('.success-content').fadeIn()).bind(this)
  }

  render() {

    return (

      <div className={"reveal two-step-confirmation " + (this.props.userType ? this.props.userType : '')}
          id={this.props.id}
          data-reveal data-animation-in="fade-in fast" data-animation-out="fade-out fast"
          data-reset-on-close={true}
          ref="me">
         <div className="flex-container">

           <div className="spinner" ref="spinner">
             <span className="psr-icons icon-spinner"></span>
           </div>

           <div className="confirmation-content content-box confirm-api-error" ref="apiError">
             <button className="close-button" data-close="" aria-label="Close modal" type="button">
               <span aria-hidden="true" className="psr-icons icon-x"></span>
             </button>
             <p>{this.props.apiMsg}</p>
             <button className="button theme" data-close="">Ok</button>
           </div>

           <div className="confirmation-content content-box confirm-content" ref="confirmContent">
             <button className="close-button" data-close="" aria-label="Close modal" type="button">
               <span aria-hidden="true" className="psr-icons icon-x"></span>
             </button>
             {this.props.title ?
               <h5>{this.props.title}</h5>
               : null}
             <div dangerouslySetInnerHTML={{__html: this.props.msg}}></div>
             <button className="button theme proceed" onClick={this.props.onProceed} >{this.props.btnText}</button>
             <div className="dismiss" data-close="">{this.props.cancelBtnText}</div>
           </div>

           <div className="confirmation-content content-box success-content" ref="successContent">
             <button className="close-button" data-close="" aria-label="Close modal" type="button">
               <span aria-hidden="true" className="psr-icons icon-x"></span>
             </button>
             <div className="tick-wrap"><span className="psr-icons icon-tick-thin"></span></div>
             <p>{this.props.successMsg}</p>
             <button className="button theme" data-close="">Ok</button>
           </div>
         </div>
      </div>


    )
  }
}

export default observer(TwoStepConfirmation)
