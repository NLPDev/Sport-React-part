import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import LevelComponent from './level-component'

class Performance14 extends Component {

  constructor() {

    super();
  }

  componentDidMount() {

  }

  infoClicked = (ev) => {

    console.log(this.props.video);
    $('#physical-video').attr('src', this.props.video);
  }

  render() {

    return (
      <li className="row rating-row" key={this.props.skill.name}>
          <div className="small-6 column">
            <label>
              {this.props.skill.name}
              {this.props.video ?
                <span className="psr-icons icon-info"
                      data-open="info-popup-technical-physical-with-video"
                      onClick={this.infoClicked}></span> : null }
            </label>
          </div>
          <div className="small-6 column text-right">
            <LevelComponent skill={this.props.skill} readOnly={this.props.readonly}/>
          </div>
      </li>
    )
  }
}

export default observer(Performance14)
