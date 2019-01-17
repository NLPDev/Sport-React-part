import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import AvatarRed from '../../../images/avatar-red.png'
import AvatarBlue from '../../../images/avatar-blue.png'
import AvatarTeam from '../../../images/avatar-team.png'

class ContentCard extends Component {

  render() {

    return (
      <div className={`card content-card ${this.props.themeColor}`}>
        <div className="header-img"></div>
        <div className="row content-row">
          <div className="column shrink col-left">
            <div className="team-logo-wrap"
              style={{background: `url(${this.props.avatar}) #fff no-repeat center center`}}>
            </div>
          </div>
          <div className="column col-right">
            <div className="title-wrap">
              <h4 className="group-title">{this.props.name || ''}</h4>
              { this.props.tagline ? <div>{`"${this.props.tagline}"`}</div> : null }
              {this.props.link ?
                <Link to={this.props.link} className="edit-btn">
                  <span className="psr-icons icon-pen"></span>
                </Link> : null}
            </div>
            <hr className="divider" />
            <div className="stats">
              {this.props.sports ?
                <div className="small-heading">
                  {this.props.sports.join(', ')}
                </div>
                : ''
              }
              {this.props.season ?
                <div className="small-heading ">{this.props.season}</div>
              : ''}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(ContentCard)
