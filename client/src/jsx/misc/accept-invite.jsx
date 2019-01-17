import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'

class AcceptInvite extends Component {

  render() {

    return (
      <div className={"content-container accept-invite text-center align-center align-middle " + this.props.match.params.recipient}>
        <div className="wrapper">
          <div className="logo text-center"><span className="psr-icons icon-logo"></span></div>
          <div className="row align-center align-bottom content">
            <div className="column large-6 content-box">
              <h1>Welcome to PSR!</h1>
              <p>To join
                {/* {'athlete' == this.props.match.params.recipient ? ' Coach ' : ' Athlete '} */}
                {' ' + this.props.match.params.firstName + ' ' + this.props.match.params.lastName + ' '}
                 you need to create an account with us.
               </p>

              {'athlete' == this.props.match.params.recipient ?
                <div>
                  <p>Choose one of the these pricing opitons:</p>
                  <ul className="no-bullet plan-list">
                    <li className="row">
                      <div  className="small-4 column text-right">
                        <span className="list-num text-center">1</span>
                      </div>
                      <div  className="small-8 column text-left">
                        <span className="underline">$5 / month</span>
                      </div>
                    </li>
                    <li className="row">
                      <div  className="small-4 column text-right">
                        <span className="list-num text-center">2</span>
                      </div>
                      <div  className="small-8 column text-left">
                        <span className="underline">$50 / year (save $10)</span>
                      </div>
                    </li>
                  </ul>
                </div>
                : ''
              }
              <p>Already a member?</p>
              <Link to={'/login/' + this.props.match.params.recipient + '/' +
                        this.props.match.params.firstName + '/' +  this.props.match.params.lastName + '/' +
                        this.props.match.params.inviteToken}
                    className="button expanded theme">Login</Link>
              <p>Not a member yet?</p>
              <Link to={'/signup/' + this.props.match.params.recipient + '/accept-invite/' +
                        this.props.match.params.firstName + '/' + this.props.match.params.lastName + '/' +
                        this.props.match.params.inviteToken}
                    className="button expanded theme">Sign up</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default inject('user')(observer(AcceptInvite))
