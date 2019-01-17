import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'

const SetHeight = Comp => class C extends Component {
  
  componentDidMount() {

    this.setContainerHeight = this.setContainerHeight.bind(this);
    $(window).on('resize', this.setContainerHeight);
    this.setContainerHeight();
  }
  
  setContainerHeight() {
  
    $(ReactDOM.findDOMNode(this.refs.me)).height($(window).outerHeight());
  }

  render() {
    return <Comp ref='me' {...this.props}/>;
  }
}

export default SetHeight;