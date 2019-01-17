import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'

import Header from '../components/header'
import SetHeight from '../components/set-height'

class SignupLanding extends Component {

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  changeRouteLeft() {
    if (!Foundation.MediaQuery.atLeast('large')) {
      $(ReactDOM.findDOMNode(this.refs.typeLinks)).addClass('out-left');
    }
  }
  changeRouteRight() {
    if (!Foundation.MediaQuery.atLeast('large')) {
      $(ReactDOM.findDOMNode(this.refs.typeLinks)).addClass('out-right');
    }
  }

  render() {
    return (
      <div className="content-container signup-landing full-screen" ref="me">
        <Header pageTitle="Sign up" fullWidth={true}/>
        <div className="content row expanded" ref="typeLinks">
          <Link to="/signup/athlete/"
                className="column small-12 large-6 signup-link athlete"
                onClick={this.changeRouteRight.bind(this)}>For Athletes</Link>
          <Link to="/signup/coach/"
                className="column small-12 large-6 signup-link coach"
                onClick={this.changeRouteLeft.bind(this)}>For Coaches</Link>
        </div>
      </div>
    )
  }
}

export default SetHeight(SignupLanding)
