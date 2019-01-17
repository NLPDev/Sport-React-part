import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'
import {Link} from 'react-router-dom'

import LevelComponent from './level-component'
import AvatarRed from '../../../images/avatar-red.png'

const AthletePerformance14 = props =>

        <li className="row rating-row">
            <div className="small-6 column">
              <Link to={"/dashboard/directory/athlete-management/12/overview"} className="profile-wrap">
                <div className="profile-thumb"
                     style={{background: "url(" + (props.avatar || AvatarRed) + ") #fff no-repeat center center"}}>
                </div>
                <div className="name">{props.athleteName}</div>
              </Link>
            </div>
            <div className="small-6 column text-right">
              <LevelComponent skill={props.skill} readOnly={true}/>
            </div>
        </li>

export default AthletePerformance14
