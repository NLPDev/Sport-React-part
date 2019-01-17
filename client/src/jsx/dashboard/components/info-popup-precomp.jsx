import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Api from '../../api'

class InfoPopup extends Component {

  render() {

    return (
      <div className="reveal assess-info-popup" id="info-popup-precomp" data-reveal
          data-reset-on-close="true" data-animation-in="fade-in"
          data-animation-out="fade-out">
        <h1 className="section-heading">How to get the most out of your pre-practice and pre-game readiness:</h1>
        <button className="close-button" data-close="" aria-label="Close modal" type="button">
         <span aria-hidden="true" className="psr-icons icon-x"></span>
        </button>
        <div>
          <div className="content-section">
            <h2>Pregame Competition</h2>
            <p>These metrics are to assist your coaches in understanding your mental and physical state of well being pre-practice & pre-game.</p>
          </div>
          <div className="content-section">
            <h2>Pre-Competition Goals</h2>
            <p>No plan, no purpose, no point. Getting in the habit of setting practice & game goals helps you, your teammates and the coaching staff to be focused and accountable to outcomes.</p>
          </div>

        </div>
      </div>
    )
  }
}

export default InfoPopup
