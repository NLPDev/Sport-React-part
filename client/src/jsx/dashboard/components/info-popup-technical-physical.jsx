import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Api from '../../api'
import InfoPopupTechnicalPhysicalCommon from './info-popup-technical-physical-common'

class InfoPopup extends Component {

  render() {

    return (
      <div className="reveal assess-info-popup" id="info-popup-technical-physical" data-reveal
          data-reset-on-close="true" data-animation-in="fade-in"
          data-animation-out="fade-out">
          <InfoPopupTechnicalPhysicalCommon />
      </div>
    )
  }
}

export default InfoPopup
