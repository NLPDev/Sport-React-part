import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'


class UtilBar extends Component {

  constructor() {
    super();
    extendObservable(this,
                     { saveEnable: false });
  }

  componentDidMount() {
    if(this.props.userLinked) {
      this.saveEnable = false;
    } else {
      this.saveEnable = true;
    }
  }

  render() {
    return (
      <div className="util-bar">
        <div className="row expanded align-center">
          <div className="column content-column">

            <div className="util-content">
              <span onClick={this.props.onCancel} className="cancel">{this.props.cancelText ? this.props.cancelText : 'Cancel'}</span>
              <h2 className="section-heading">{this.props.title}</h2>
              {this.props.readonly || this.props.userLinked ?
                '' :
                <span onClick={this.props.onSave} className="save"
                  data-open={this.props.noAutoPopup ? "" : "save-confirmation"}>
                  {this.props.btnText ? this.props.btnText : 'Save'}
                </span>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(UtilBar)
