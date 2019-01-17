import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Api from '../../api'

class InfoPopupTechnicalPhysicalVideo extends Component {

  render() {

    return (
      <div className="content-section">
        <div className="responsive-embed widescreen">
          <iframe id="physical-video"
                  width="420"
                  height="315"
                  frameBorder="0"
                  allowFullScreen src="https://player.vimeo.com/video/82153689" />
        </div>
      </div>
    )
  }
}

export default InfoPopupTechnicalPhysicalVideo
