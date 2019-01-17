import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'

class InviteHandler extends Component {

  componentWillMount() {

    Api.getUser()
      .then(user => {
        return Api.acceptInvitation(this.props.match.params.token);
      })
      .then(response => {
// console.log('response', response);
        this.props.history.push('/invite-accepted/' + this.props.match.params.recipient +
                                '/' + this.props.match.params.firstName +
                                '/' +  this.props.match.params.lastName +
                                '/' + response.requester_id);
      })
      .catch(err => {
        this.props.history.push('/accept-invite/' + this.props.match.params.recipient + '/' +
                                this.props.match.params.firstName + '/' +  this.props.match.params.lastName + '/' +
                                this.props.match.params.token);
      })
  }

  render() {

    return null;
  }
}

export default inject('user')(InviteHandler);
