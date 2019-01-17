import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import Api from '../../api'

class UploadedFile extends Component {

  render() {
    return (
      <div className="uploaded-file">
        <span>{this.props.file.name}</span>
        <span className="psr-icons icon-x" onClick={() => this.props.removeFile(this.props.file)}></span>
      </div>
    )
  }

}

export default observer(UploadedFile)
