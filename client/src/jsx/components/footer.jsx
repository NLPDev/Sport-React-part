import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'

import logo from '../../images/logo.svg'

class Footer extends Component {


  render() {
    return (
      <footer className="footer" ref="me">
        <ul className="socials no-bullet">
          <li><a href="https://www.facebook.com/personalsportrecord/" className="social-icon" target="_blank"><span className="psr-icons icon-facebook"></span></a></li>
          <li><a href="https://twitter.com/personalsportr" className="social-icon" target="_blank"><span className="psr-icons icon-twitter"></span></a></li>
          {/* <li><a href="" className="social-icon" target="_blank"><span className="psr-icons icon-instagram"></span></a></li>
          <li><a href="" className="social-icon" target="_blank"><span className="psr-icons icon-linkedin2"></span></a></li> */}
        </ul>
        <nav className="footer-nav" >
          <ul className="nav no-bullet ">
            <li><a href="http://personalsportrecord.com/contact-us/" >Contact us</a></li>
            <li><a href="http://personalsportrecord.com/about-us/">About us</a></li>
            {/* <li><a href="#">Help</a></li> */}
            <li><a href="http://personalsportrecord.com/faq/" className="menu-item-faq">FAQ</a></li>
            <br className="hide-for-medium"/>
            <li><a href="http://personalsportrecord.com/user-agreement/" target="_blank">User Agreement</a></li>
            <li><a href="http://personalsportrecord.com/privacy-policy/" target="_blank">Privacy Policy</a></li>
          </ul>
        </nav>
        <div className="copyright"><small>&copy; {new Date().getFullYear()} Personal Sport Record</small></div>
      </footer>
    )
  }
}

export default Footer
