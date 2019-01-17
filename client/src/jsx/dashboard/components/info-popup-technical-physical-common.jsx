import React, {Component} from 'react'
import ReactDOM from 'react-dom'

import Api from '../../api'

class InfoPopupTechnicalPhysicalCommon extends Component {

  render() {

    return (
      <div>
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
            <p>Presence of numerous, major gaps during the execution of the skill.</p>
          </div>
          <div className="content-section">
            <h2>Emerging</h2>
            <div>
              <span className="perf-level perf-level1"></span>
              <span className="perf-level perf-level2"></span>
              <span className="perf-level "></span>
              <span className="perf-level "></span>
            </div>
            <p>Limited number of major gaps, but able to execute the basic sequence of the task.</p>
          </div>
          <div className="content-section">
            <h2>Competent</h2>
            <div>
              <span className="perf-level perf-level1"></span>
              <span className="perf-level perf-level2"></span>
              <span className="perf-level perf-level3"></span>
              <span className="perf-level "></span>
            </div>
            <p>Basic level of execution with minor sequencing errors.</p>
          </div>
          <div className="content-section">
            <h2>Proficient</h2>
            <div>
              <span className="perf-level perf-level1"></span>
              <span className="perf-level perf-level2"></span>
              <span className="perf-level perf-level3"></span>
              <span className="perf-level perf-level4"></span>
            </div>
            <p>Overall proficiency is depicted by the quality of the movement.</p>
          </div>
        </div>
      </div>
    )
  }
}

export default InfoPopupTechnicalPhysicalCommon
