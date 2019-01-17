import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Api from '../../api'

class InfoPopup extends Component {

  render() {

    return (
      <div className="reveal assess-info-popup" id="info-popup-leadership" data-reveal
          data-reset-on-close="true" data-animation-in="fade-in"
          data-animation-out="fade-out">
        <h1 className="section-heading">Rate your feedback by choosing one of the following in the assessments:</h1>
        <button className="close-button" data-close="" aria-label="Close modal" type="button">
         <span aria-hidden="true" className="psr-icons icon-x"></span>
        </button>
        <div>
          <div className="content-section">
            <h2>Initial</h2>
            <div>
              <span className="perf-level perf-level1"></span>
              <span className="perf-level "></span>
              <span className="perf-level "></span>
              <span className="perf-level "></span>
            </div>
            <p>Does not yet demonstrate an understanding or implementation of the leadership trait.</p>
          </div>
          <div className="content-section">
            <h2>Emerging</h2>
            <div>
              <span className="perf-level perf-level1"></span>
              <span className="perf-level perf-level2"></span>
              <span className="perf-level "></span>
              <span className="perf-level "></span>
            </div>
            <p>Demonstrates a basic level of understanding of the leadership trait with limited implementation.</p>
          </div>
          <div className="content-section">
            <h2>Competent</h2>
            <div>
              <span className="perf-level perf-level1"></span>
              <span className="perf-level perf-level2"></span>
              <span className="perf-level perf-level3"></span>
              <span className="perf-level "></span>
            </div>
            <p>Demonstrates an above average understanding of the leadership trait with an inconsistent level of implementation.</p>
          </div>
          <div className="content-section">
            <h2>Proficient</h2>
            <div>
              <span className="perf-level perf-level1"></span>
              <span className="perf-level perf-level2"></span>
              <span className="perf-level perf-level3"></span>
              <span className="perf-level perf-level4"></span>
            </div>
            <p>Demonstrates a high degree of understanding and consistent implementation of the leadership trait.</p>
          </div>
          {/* <div className="content-section">
            <div className="responsive-embed">
              <iframe width="420" height="315" frameBorder="0" allowFullScreen src="https://www.youtube.com/embed/mM5_T-F1Yn4"></iframe>
            </div>
            <label>With ball</label>
          </div> */}
        </div>
      </div>
    )
  }
}

export default InfoPopup
