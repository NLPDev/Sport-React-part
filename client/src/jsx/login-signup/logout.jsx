import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer, inject} from 'mobx-react'


class Logout extends Component {

  constructor() {
    super();
    localStorage.removeItem('user_id');
    localStorage.removeItem('jwt_token');
  }

  componentDidMount() {
    this.props.setUser(null);
    this.props.history.push('/login');
  }



  render() {
    return null
  }
}

export default inject('setUser')(observer(Logout))
