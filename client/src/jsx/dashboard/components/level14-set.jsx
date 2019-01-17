import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import PerfLevel14 from './performance-level'

export default observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { });
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  // showInfo = () => {
  //   $(ReactDOM.findDOMNode(this.refs.infoPopup)).addClass('active').outerWidth();
  //   $(ReactDOM.findDOMNode(this.refs.infoPopup)).addClass('fade-in');
  //   $(ReactDOM.findDOMNode(this.refs.infoIcon)).fadeOut();
  // }
  //
  // hideInfo = () => {
  //   const self = $(ReactDOM.findDOMNode(this.refs.infoPopup));
  //   self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'));
  //   $(ReactDOM.findDOMNode(this.refs.infoIcon)).fadeIn();
  // }

  render() {

    return (
      <fieldset>
        <legend className="skillset-heading">{this.props.levelSet.setName}
          <span className="psr-icons icon-info" data-open="speed-technical-physical"></span>
        </legend>
        <ul className="no-bullet">
          {this.props.levelSet.skills.map(skill => <PerfLevel14 key={skill.name}
            readonly={this.props.readonly}
            skill={skill} />)}
        </ul>
      </fieldset>
    )
  }
})
