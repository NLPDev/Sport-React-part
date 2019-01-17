import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

class SchoolCard extends Component {

  render() {

    return (
      <div className="card school-card">
        <div className="row align-middle">
          <div className="column shrink col-left">
            <div className="gpa">
              <div className="gpa-content">
                <div className="gpa-value">3.8</div>
                <div>GPA</div>
              </div>
            </div>
          </div>
          <div className="column col-right">
            <div className="title-wrap">
              <h4 className="group-title">{this.props.title}</h4>
            </div>
            <hr className="divider"/>
            <div>{this.props.attending ? 'Currently attending' : 'Not currently attending'}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(SchoolCard)
