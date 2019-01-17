import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Header from '../components/header'
import Api from '../api'
import SetHeight from '../components/set-height'

class InviteAccepted extends Component {

  constructor(){
    super();
  }

  componentDidMount() {

    Api.getUser()
      .then(user => {

        this.props.setUser(user);
      })
      .catch(err => { console.log(err); });
  }

  render() {

    return (
      <div className={"content-container invite-accepted full-screen " + this.props.match.params.recipient}>
        <Header pageTitle="Connected" fullWidth={true}/>
        <div className="row expanded content">

          <div className={"column large-6 show-for-large signup-link " + this.props.match.params.recipient}>
            {'athlete' == this.props.match.params.recipient ? 'For Athletes' : 'For Coaches'}
          </div>
          <div className="column small-12 large-6 confirmation-container">
            <div className="confirmation-lg connected-confirmation text-center align-center" ref="signupConfirmation">
              <div className="content-box ">
                <div className="confirmation-content" ref="confirmationContent">
                  <Link to={'athlete' == this.props.match.params.recipient ?
                            '/settings/athlete/permission/' + this.props.match.params.coachId
                            : '/dashboard/directory'}
                        className="close-button"
                        onClick={this.onClose} aria-label="Close" >
                    <span aria-hidden="true" className="psr-icons icon-x"></span>
                  </Link>
                  <div className="tick-wrap"><span className="psr-icons icon-tick-thin"></span></div>
                  <h5>Success!</h5>
                  <p>You are now connected to
                    {/* {'athlete' == this.props.match.params.recipient ? ' Coach ' : ' Athlete '} */}
                    {' ' + this.props.match.params.firstName + ' ' + this.props.match.params.lastName}.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default inject('user', 'setUser')(SetHeight(observer(InviteAccepted)))
