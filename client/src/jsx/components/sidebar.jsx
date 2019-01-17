import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import logo from '../../images/logo.svg'

class SideNav extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { clDashboard: '',
                       clProfile: '',
                       clReturnToPlay: '',
                       clSettings: '',
                       clBlog: ''
                     });
  }

  componentDidMount() {
    this['cl' + this.props.curActive] = 'active';
  }

  render() {
    return (
      <div className="sidebar" ref="me">
        <Link to="/" className="logo"><img src={logo} /></Link>
        <nav className="side-nav desktop" >
          <ul className="nav no-bullet">
            <li><Link className={"nav-link " + this.clProfile} to="/profile">Profile</Link></li>
            <li><Link className={"nav-link " + this.clDashboard} to="/dashboard" >Dashboard</Link></li>
            <li><Link className={"nav-link " + this.clReturnToPlay} to="/athlete-log" >Athelete Log</Link></li>
            <li><Link className={"nav-link " + this.clSettings} to="/settings">Settings</Link></li>
            <li><a className={"nav-link " + this.clBlog} href="http://personalsportrecord.com/blog/" target="_blank">Resources</a></li>
            <li><Link className="nav-link " to="/logout">Sign out</Link></li>
          </ul>
        </nav>
      </div>
    )
  }
}

export default observer(SideNav)
