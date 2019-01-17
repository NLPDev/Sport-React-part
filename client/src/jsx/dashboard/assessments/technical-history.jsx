import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import Technical from './technical'

class TechnicalHistory extends Component {

  constructor() {

    super();
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  render() {

    return (
      <Technical readonly={true} {...this.props} title="History" readonly={true}/>
    )
  }
}

export default observer(TechnicalHistory)
