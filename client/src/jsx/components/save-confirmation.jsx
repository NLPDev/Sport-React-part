import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

class SaveConfirmation extends Component {

  constructor() {

    super();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation()
    .on("closed.zf.reveal", () => {
      $('#save-confirmation .spinner').show();
      $('#save-confirmation .confirmation-content').hide();
      if(this.props.onClose) {
        this.props.onClose();
      }
    })
  }

  showValidationError = () => {
    $('#save-confirmation .spinner').fadeOut(() => $('#save-confirmation .validation-error').fadeIn())
  }

  showApiError = () => {
    $('#save-confirmation .spinner').fadeOut(() => $('#save-confirmation .save-api-error').fadeIn())
  }

  showConfirmation = () => {
    $('#save-confirmation .spinner').fadeOut(() => $('#save-confirmation .success-content').fadeIn())
  }

  render() {

    return (

      <div className={"reveal save-confirmation " + (this.props.userType ? this.props.userType : '')} id="save-confirmation"
          data-reveal data-animation-in="fade-in fast" data-animation-out="fade-out fast"
          data-reset-on-close={true}
          // data-close-on-click={false}
           ref="me">
         <div className="flex-container">

           <div className="spinner" ref="spinner">
             <span className="psr-icons icon-spinner"></span>
           </div>

           {this.props.validationMsg  ?
             <div className="confirmation-content content-box validation-error" ref="validationError">
               <button className="close-button" data-close="" aria-label="Close modal" type="button">
                 <span aria-hidden="true" className="psr-icons icon-x"></span>
               </button>

               <p>{this.props.validationMsg}</p>
               <button className="button theme" data-close="">Ok</button>
             </div>
             : "" }

           {this.props.apiMsg ?
             <div className="confirmation-content content-box save-api-error" ref="apiError">
               <button className="close-button" data-close="" aria-label="Close modal" type="button">
                 <span aria-hidden="true" className="psr-icons icon-x"></span>
               </button>

               <p>{this.props.apiMsg}</p>
               <button className="button theme" data-close="">Ok</button>
             </div>
             : "" }

           <div className="confirmation-content content-box success-content" ref="successContent">
             <button className="close-button" data-close="" aria-label="Close modal" type="button">
               <span aria-hidden="true" className="psr-icons icon-x"></span>
             </button>
             <div className="tick-wrap"><span className="psr-icons icon-tick-thin"></span></div>
             <p>{this.props.msg}</p>
             <button className="button theme" data-close="">Ok</button>
           </div>
         </div>
      </div>


    )
  }
}

export default observer(SaveConfirmation)
