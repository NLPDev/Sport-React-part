import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import PerfLevel14 from './performance-level'

class SkillValue extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { skillValue: '',
                       unitStr: computed(() => this.getUnitStr()) });
  }

  componentDidMount() {

    this.skillValue = this.props.skill.value;
  }

  getUnitStr = () => {

    switch (this.props.skill.unit) {
      case 'sec':
        return '(s)';
        break;
      case 'kg':
        return this.props.isImperial ? '(lbs)' : '(kg)';
      case 'cm':
        return this.props.isImperial ? '(feet)' : '(m)';
      case 'degrees':
        return '(°)';
      case 'L/min':
        return '(L/min)';
      case 'watts':
        return '(W)';
      default:
        return '';
        break;
    }
  }

  onValueChanged = ev => {

    if (this.props.readonly) return;

    //var v = parseFloat(ev.target.value);
    //this.skillValue = (isNaN(v)) ? '' : v.toFixed(2);

	//only allow numbers and two decimal places
    var ex = /^\d*\.?\d{0,2}$/;
    //console.log(ev.target.value,ex.test(ev.target.value));
    if(ex.test(ev.target.value)===false){
      ev.target.value = ev.target.value.substring(0,ev.target.value.length - 1);
    }

    this.skillValue = ev.target.value;
    this.updateValue();
    $('.assessment_' + this.props.skill.id).html('');
  }

  onToggle = ev => {

    if (this.props.readonly) return;
    this.skillValue = ev.target.checked;
    this.props.skill.value = this.skillValue ? 1 : 0;
    this.props.skill.modified = true;
  }

  updateValue = () => {

    this.props.skill.value = this.skillValue;
    if (this.skillValue) {
      this.props.skill.modified = true;
    } else {
      this.props.skill.modified = false;
    }
  }

  render() {

    return (
        'competent/not-competent' == this.props.skill.unit ?
          <li className="row rating-row" key={this.props.skill.name}>
            <div className="small-9 column" key='skillName1'>
              <label>{this.props.skill.name + ' ' + this.unitStr}</label>
            </div>
            <div className="small-3 column" key='input1'>
              <div className="switch small">
                <input className="switch-input"
                       type="checkbox"
                       id={this.props.skill.name}
                       name={this.props.skill.name}
                       value={this.props.skill.name}
                       checked={this.skillValue ? true : false}
                       onChange={this.onToggle}/>
                <label className="switch-paddle" htmlFor={this.props.skill.name}>
                  <span className="show-for-sr">{this.props.skill.name}</span>
                </label>
              </div>
            </div>
          </li>
          :
          <li className="row rating-row" key={this.props.skill.name}>
            <div className="small-9 column" key='skillName2'>
              <label>{this.props.skill.name + ' ' + this.unitStr}</label>
            </div>
            <div className="small-3 column" key='input2'>

              <div>
                <input type="text"
                       disabled={this.props.readonly ? true : false}
                       value={this.skillValue}
                       onChange={this.onValueChanged}/>

                </div>
            </div>
            <div className={'form-error column small-12 assessment_' +
                            (this.props.skill.id || this.props.skill.assessment_id)}
                 key='error'></div>
          </li>

    )

  }
}

const SkillValueObv = observer(SkillValue)

class SkillSet extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { });
    // this.showInfo = this.showInfo.bind(this);
    // this.hideInfo = this.hideInfo.bind(this);
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  // showInfo(){
  //   $(ReactDOM.findDOMNode(this.refs.infoPopup)).addClass('active').outerWidth();
  //   $(ReactDOM.findDOMNode(this.refs.infoPopup)).addClass('fade-in');
  //   $(ReactDOM.findDOMNode(this.refs.infoIcon)).fadeOut();
  // }
  //
  // hideInfo(){
  //   const self = $(ReactDOM.findDOMNode(this.refs.infoPopup));
  //   self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'));
  //   $(ReactDOM.findDOMNode(this.refs.infoIcon)).fadeIn();
  // }

  render() {

    return (
      <fieldset key={this.props.skillSet.setName} ref="me">
        <legend className="skillset-heading">{this.props.skillSet.setName || this.props.skillSet.name}
          <span className="psr-icons icon-info" data-open="info-popup-technical-physical"></span>
        </legend>
        <ul className="no-bullet">
          {this.props.skillSet.childs.map(skill => {

            return "stars" == skill.unit ?
              <PerfLevel14 key={skill.name} readonly={this.props.readonly} skill={skill} /> :
              <SkillValueObv key={skill.name}
                             skill={skill}
                             isImperial={this.props.isImperial}
                             readonly={this.props.readonly}/>})
          }
        </ul>
      </fieldset>
    )
  }
}

export default observer(SkillSet)
