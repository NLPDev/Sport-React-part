import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'


class SignupTypeTabs extends Component {


  render() {

    return (
      <div className="type-tabs hide-for-large row">
        <div className="column content-box">
          <h2 className="section-heading">Account Type</h2>
          <div className="tabs-wrap row">
            <div className="column">
              {this.props.activeTab == 'athlete' ?
                <div className="tab athlete-tab text-center active">Athlete</div> :
                <Link to="/signup/athlete" className="tab athlete-tab text-center">Athlete</Link>}

            </div>
            <div className="column">
              {this.props.activeTab == 'coach' ?
                <div className="tab coach-tab text-center active">Coach</div> :
                <Link to="/signup/coach" className="tab coach-tab text-center">Coach</Link>}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default SignupTypeTabs
