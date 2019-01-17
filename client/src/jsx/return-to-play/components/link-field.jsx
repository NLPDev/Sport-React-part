import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer} from 'mobx-react'

import Api from '../../api'

class LinkField extends Component {
  constructor() {
    super();
    extendObservable(this,
                      {
                        urlValid: false,
                        showError: false,
                        hasConfirmed: false,
                        confirmed: computed(() => { return this.props.url.isConfirmed })
                      })
  }

  componentDidMount() {

    const disposer = observe(this,
                             'confirmed',
                             change => {
                               if (change.newValue) {
                                 this.hasConfirmed = true;
                                 this.urlValid = true;
                                 disposer();
                               }
                             });
  }

  setUrl = (e) => {

    this.props.url.url = e.target.value.trim();
    if(this.isUrlValid(this.props.url.url)) {
      this.urlValid = true;
    } else {
      this.urlValid = false;
    }
    this.showError = false;
  }

  isUrlValid = (str) => {
    const pattern = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;
    return pattern.test(str);
  }

  confirmEnter = () => {
    this.hasConfirmed = true;
    this.props.addUrl();
  }

  validate = () => {
    if (this.props.url.url.length && !this.urlValid) {
      this.showError = true;
      return false;
    }
    return true;
  }

  render() {
    if (this.confirmed){
      return (
        <div className="link-wrap">
          <input type="text" placeholder="Paste URL here"
                 disabled="true"
                 className="link-field"
                 ref="me"
                 value={this.props.url.url}/>
          <span className="psr-icons icon-x is-visible" 
                onClick={() => this.props.removeUrl(this.props.index)}></span>
        </div>
      )
    } else {
      return (
        <div className="link-wrap">
          <input type="text" placeholder="Paste URL here"
                 disabled={this.hasConfirmed}
                 className="link-field"
                 ref="me"
                 value={this.props.url.url}
                 onChange={this.setUrl}/>
          <span className={"psr-icons icon-tick" + (this.urlValid && !this.hasConfirmed ? ' is-visible' : '')}
                onClick={this.confirmEnter}></span>
          <span className={"psr-icons icon-x" + (this.hasConfirmed ? ' is-visible' : '')}
                onClick={() => this.props.removeUrl(this.props.index)}></span>
          <p className={"form-error" + (this.showError ? " visible" : "")}>Please enter a valid url.</p>
        </div>
      )
    }
  }
}

export default observer(LinkField)
