import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import AvatarRed from '../../../images/avatar-red.png'
import AthletePerfLevel14 from './athlete-performance-level'
import LevelComponent from './level-component'

export default observer(class extends Component {

  constructor(props) {

    super(props);
    extendObservable(this,
                     { curAssessmentType: computed(() => {

                                            if (!this.props.assessmentDef) return '';

                                            switch (this.props.assessmentDef.unit) {
                                              case 'stars':
                                                return 'level14';
                                                break;
                                              case 'competent/not-competent':
                                                return 'trueFalse';
                                                break;
                                              default:
                                                return 'value';
                                                break;
                                            }
                                          })
                    });
  }

  render() {
    return (
      <div key={this.props.letter}>
        <h3 className="letter-heading">{this.props.letter}</h3>
          <ul className="no-bullet">
            { this.props.entities.map((entity, i) => {

              switch (this.curAssessmentType) {
                case 'level14':

                  return  <li className="row rating-row">
                            <div className="small-6 column">
                              <Link to={this.props.linkFunc(entity)}  className="profile-wrap">
                                <div className="profile-thumb"
                                     style={{background: "url(" + (entity.profile_picture_url || AvatarRed) + ") #fff no-repeat center center"}}>
                                </div>
                                <div className="name">{`${entity.first_name}, ${entity.last_name}`}</div>
                              </Link>
                            </div>
                            <div className="small-6 column text-right">
                              <LevelComponent skill={{name: "", level: entity.value}} readOnly={true}/>
                            </div>
                          </li>

                case 'trueFalse':

                  return  <li className="row rating-row " >
                            <div className="small-9 column">
                              <Link to={this.props.linkFunc(entity)} className="profile-wrap">
                                <div className="profile-thumb"
                                  style={{background: "url(" + (entity.profile_picture_url || AvatarRed)
                                                      + ") #fff no-repeat center center"}}>
                                </div>
                                <div className="name">{`${entity.first_name}, ${entity.last_name}`}</div>
                              </Link>
                            </div>
                            <div className="small-3 column text-right ">
                              <div className="switch small">
                                <input className="switch-input"
                                       type="checkbox"
                                       id={"name"}
                                       name={"name"}
                                       checked={parseInt(entity.value) > 0}/>
                                <label className="switch-paddle" htmlFor={"name"}>
                                  <span className="show-for-sr">{"name"}</span>
                                </label>
                              </div>
                            </div>
                          </li>
                case 'value':

                  return  <li className="row rating-row " >
                            <div className="small-9 column">
                              <Link to={this.props.linkFunc(entity)} className="profile-wrap">
                                <div className="profile-thumb"
                                  style={{background: "url(" + (entity.profile_picture_ur || AvatarRed)
                                                      + ") #fff no-repeat center center"}}>
                                </div>
                                <div className="name">{`${entity.first_name}, ${entity.last_name}`}</div>
                              </Link>
                            </div>
                            <div className="small-3 column text-right ">
                              <input type="text" value={entity.value} />
                            </div>
                          </li>
              }
            })}
        </ul>
      </div>)
  }
})