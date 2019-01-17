import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import MedalGrey from '../../../images/medal-0.png'
import MedalRed from '../../../images/medal-4.png'

export default (props) => (
  <div className="card award-card">
    <div className="row">
      <div className="column shrink col-left">
        <div className="medal-wrap">
          <img src={props.isGrey ? MedalGrey : MedalRed} />
        </div>
      </div>
      <div className="column col-right">
        <div className="title-wrap">

          <h4 className="group-title">{props.title}</h4>
          {props.content ?
            <div>{props.content}</div> : null}
          {props.team ?
            <div>{props.team}</div> : null}

          {props.link ?
            <Link to={props.link} className="edit-btn">
              <span className="psr-icons icon-pen"></span>
            </Link> : null}
        </div>
        <hr className="divider"/>
        <div>{props.footer}</div>
      </div>
    </div>
  </div>
)