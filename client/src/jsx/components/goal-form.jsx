import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, toJS, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import Api from '../api'

class GoalForm extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       dateValid: true
                     });
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.goalForm)).foundation();

    const date = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const self = this;
    $(ReactDOM.findDOMNode(this.refs.date)).datetimepicker({
      format: 'm/d/Y',
      yearStart: year,
      yearEnd: year + 10,
      timepicker: false,
      scrollInput: false,
      scrollMonth: false,
      scrollTime: false,
      defaultSelect: false,
      todayButton: false,
      minDate: 0,
      // inline: true,
      onGenerate:function(ct){
        $('.calender-label').append($(this));
        $(this).addClass(self.user && self.user.user_type);
      },
      onSelectDate: ct => {
        const achieveDate = (ct.getMonth() + 1)  + '/' + ct.getDate() + '/' + ct.getFullYear();
        self.props.goal.achieve_by = achieveDate;
        $('.selected-date').removeClass('empty');
        this.dateValid = true;
      }
    })

    $(ReactDOM.findDOMNode(this.refs.goalForm))
      .on("forminvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        if(this.props.goal.achieve_by == 'm/d/yyyy') {
          this.dateValid = false;
        }
        this.scrollToError();
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        if(this.props.goal.achieve_by == 'm/d/yyyy') {
          this.dateValid = false;
        }

        if(this.dateValid) {
          this.props.onSubmit({ description: this.props.goal.description,
                                achieve_by: moment(this.props.goal.achieve_by).format('YYYY-MM-DD'),
                                is_achieved: this.props.goal.is_achieved });
        }
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }


  scrollToError = () => {
    const errorField = $('.form-error.is-visible')[0];
    $('body').scrollTop(errorField.offsetTop - 120);
  }

  setDescription = e => {
    this.props.goal.description = e.target.value;
  }

  updateIsAchieved = e => {
    this.props.goal.is_achieved = e.target.checked;
  }

  trySubmit = () => {
    $(ReactDOM.findDOMNode(this.refs.goalForm)).submit();
  }

  render() {

    return (
      <form data-abide noValidate ref="goalForm" className="goal-form">
        <div className="group-section">
          <label>Goal description
            <textarea type="text" name="goalTilte"
                   placeholder="Start typing..."
                   maxLength="255"
                   required
                   value={this.props.goal.description}
                   onChange={this.setDescription} />
            <span className="form-error">This field is required.</span>
          </label>
          {/* <label>Achieve by:
            <input type="text" name="month"
                   placeholder="mm"
                   value={this.goal && this.goal.month}
                   onChange={this.setGoalMonth} />
            <input type="text" name="Year"
                   placeholder="yyyy"
                   value={this.goal && this.goal.year}
                   onChange={this.setGoalYear} />
          </label> */}
          <label ref="dateLabel" className={"calender-label" + (this.dateValid ? "" : " is-invalid-label") }>
            Achieve by:
            <div ref="date">
              <div className="selected-date empty">
                {this.props.goal.achieve_by}
              </div>
              <span className="psr-icons icon-calender"></span>
            </div>
            <span className={"form-error " + (this.dateValid ? "" : " is-visible")}>
              Please enter a valid date.
            </span>
          </label>
          <div className="switch-block">
            <label>Has this goal been achieved?</label>
            <span className="value left">No</span>
            <div className="switch small">
              <input className="switch-input"
                     type="checkbox" checked={this.props.goal.is_achieved}
                     name="isAchieved"
                     id="isAchieved"
                     onChange={this.updateIsAchieved} />
              <label className="switch-paddle" htmlFor="isAchieved">
                <span className="show-for-sr">is achieved?</span>
              </label>
            </div>
            <span className="value right">Yes</span>
          </div>
        </div>
        <button type="submit" className="button theme float-right" >Save</button>
      </form>
    )
  }
}

export default inject('user')(observer(GoalForm))
