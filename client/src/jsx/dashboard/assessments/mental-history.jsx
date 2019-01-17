import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import Mental from './mental'

class MentalHistory extends Component {

  constructor() {

    super();
  }

  componentDidMount() {
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave() {

  }

  onCancel() {

  }

  onUnitToggle() {

  }

  render() {

    return (
      <Mental readonly={true} title="History" {...this.props}/>
    )
  }
}

export default observer(MentalHistory)