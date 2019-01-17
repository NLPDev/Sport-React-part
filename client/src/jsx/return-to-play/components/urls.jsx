import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import Api from '../../api'
import LinkField from './link-field'

class Urls extends Component {

  constructor() {
    super();
    extendObservable(this,
                     { curKey: 0,
                       urls: computed(() => this.props.urls),
                       urlFields: [] });
  }

  componentDidMount() {


    this.curKey = this.props.urls.length;
  }

  componentDidUpdate() {
    setTimeout(() => {
      $('.link-field').last().focus();
    }, 0);
  }

  setUrls = (urls) => {

    this.curKey = urls.length;
  }

  addUrl = () => {
    this.props.urls.push({url: '',
                          key: this.curKey });
    this.curKey++;
  }

  removeUrl = (index) => {
    this.props.urls.splice(index, 1);
    this.urlFields.splice(index, 1);
  }

  validate = () => {
    return this.urlFields[this.urls.length - 1].validate();
  }

  render() {
    this.urlFields = [];
    return (
      <label>Add links
        {this.props.urls.map((u, index) =>
          <LinkField key={index}
                     url={u}
                     ref={r => { if (r) { this.urlFields.push(r); } }}
                     index={index}
                     addUrl={this.addUrl}
                     removeUrl={this.removeUrl}/>)}
      </label>
    )
  }
}

export default observer(Urls)
