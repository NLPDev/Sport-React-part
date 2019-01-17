import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import Api from '../../api'
import Medal0 from '../../../images/medal-0.png'
import Medal1 from '../../../images/medal-1.png'
import Medal2 from '../../../images/medal-2.png'
import Medal3 from '../../../images/medal-3.png'
import Medal4 from '../../../images/medal-4.png'
import Medal5 from '../../../images/medal-5.png'
import Medal6 from '../../../images/medal-6.png'
import Medal7 from '../../../images/medal-7.png'
import Medal8 from '../../../images/medal-8.png'

class AwardCard extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { badges: null });
  }

  componentDidMount() {

    Api.getBadges()
      .then(badges => {

        this.badges = badges;
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {

    const medalMap = {'0': Medal0,
                      '1': Medal1,
                      '2': Medal2,
                      '3': Medal3,
                      '4': Medal4,
                      '5': Medal5,
                      '6': Medal6,
                      '7': Medal7,
                      '8': Medal8 }

    const medalImg = medalMap[this.props.imgId]

    return (
      <div className="card award-card">
        <div className="row">
          <div className="column shrink col-left">
            <div className="medal-wrap">
              <img src={this.badges ? this.badges[this.props.imgId - 1].image_url : medalImg} />
            </div>
          </div>
          <div className="column col-right">
            <div className="title-wrap">

              <h4 className="group-title">{this.props.title}</h4>
              {this.props.content ?
                <div>{this.props.content}</div>
              : ''}
              {this.props.team ?
                <div>{this.props.team}</div>
              : ''}

              {this.props.link ?
                <Link to={this.props.link} className="edit-btn"><span className="psr-icons icon-pen"></span></Link>
                : ''
              }
            </div>
            <hr className="divider"/>
            <div>{this.props.footer}</div>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(AwardCard)
