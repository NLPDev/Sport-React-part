import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Header from '../components/header'
import DummyPic from '../../images/dummyPic.jpg'
import ProfileForm from '../components/profile-form'
import Api from '../api'


class SignupProfile extends Component {

  constructor() {

    super();
    extendObservable(this,
                     {  });
  }

  componentDidMount() {

    const date = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    $("#birthDate").datetimepicker({
      format: 'm/d/Y',
      yearStart: 1930,
      yearEnd: year,
      timepicker: false
    });
  }

  show() {

    $(ReactDOM.findDOMNode(this.refs.me)).addClass('active').outerWidth();
    $(ReactDOM.findDOMNode(this.refs.me)).addClass('fade-in');
  }

  hide() {

    const self = $(ReactDOM.findDOMNode(this.refs.me));
    self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'))
  }

  render() {
    return (
      <div className="tab-content" ref="me">
        <div className="row align-center main-content-container">
          <div className="column large-6 content-box">
            <ProfileForm onSubmit={this.props.onSubmit}
                         onSuccess={this.props.onSuccess}
                         showSubmitBtn={true}/>
          </div>
        </div>
      </div>
    )
  }
}

export default inject('user')(observer(SignupProfile))
