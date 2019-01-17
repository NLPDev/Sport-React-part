import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import Api from '../../api'
import Select from '../../components/select'
import PreCompeteLevel from './precompete-level'

class StatusForm extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       statusIn: computed(() => this.props.preCompeteStatus),
                       status: { title: '',
                                 stress: 0,
                                 fatigue: 0,
                                 hydration: 0,
                                 injury: 0,
                                 weekly_load: 0,
                                 date: 'm/d/yyyy',
                                 team_id: null,
                                 goal: ''},
                       dateValid: false,
                       showDateError: false,
                       teams: computed(() => {
                                if (!this.user) return [];

                                return this.user.team_memberships.map(t => t.name);
                              }),
                     });
  }

  componentWillMount() {

    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    if (this.props.preCompeteStatus) {
      if (!this.statusIn.id) {
        const disposer = observe(this,
                                 'statusIn',
                                 change => {
                                   if (change.newValue.id) {
                                     this.status = change.newValue;
                                     this.dateValid = true;
                                     disposer();
                                   }
                                 });
      }
    }

    $(ReactDOM.findDOMNode(this.refs.statusForm)).foundation();

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
        const theDate = moment(ct).format('YYYY-MM-DD');//(ct.getMonth() + 1)  + '/' + ct.getDate() + '/' + ct.getFullYear();
        self.status.date = theDate;
        $('.selected-date').removeClass('empty');
        this.dateValid = true;
        this.showDateError = false;
      }
    })

    $(ReactDOM.findDOMNode(this.refs.statusForm))
      .on("forminvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();

        if (!this.dateValid) {
          this.showDateError = true;
        }
        this.scrollToError();
      })
      .on("formvalid.zf.abide", (ev,frm) => {

        if (!this.dateValid) {
          this.showDateError = true;
        }

        if (!this.status.stress || !this.status.fatigue || !this.status.hydration ||
            !this.status.injury || !this.status.weekly_load) {
          return;
        }

        if(this.dateValid ) {
          this.props.onSubmit(this.status);
        }
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  scrollToError = () => {
    const errorField = $('.form-error.is-visible')[0];
    $('body').scrollTop(errorField.offsetTop - 80);
  }

  setCompTitle = e => {
    this.status.title = e.target.value;
  }

  setTeam = team => {
    this.status.team_id = this.user.team_memberships.find(t => t.name === team).id;
  }

  setGoal = e => {
    this.status.goal = e.target.value;
  }

  setStress = level => {

    this.status.stress = level;
  }

  setFatigue = level => {

    this.status.fatigue = level;
  }

  setHydration = level => {

    this.status.hydration = level;
  }

  setInjury = level => {

    this.status.injury = level;
  }

  setWeekyLoad = level => {

    this.status.weekly_load = level;
  }

  trySubmit = () => {
    $(ReactDOM.findDOMNode(this.refs.statusForm)).submit();
  }

  render() {

    return (
      <form data-abide noValidate ref="statusForm" className="status-form">
        <div className="content-section">
          <h2 className="section-heading">Competition Title</h2>
          <label>Competition Title
            <input type="text" name="compTilte"
                   placeholder="i.e. National, Juniors Tournament etc."
                   required
                   value={this.status && this.status.title}
                   onChange={this.setCompTitle} />
            <span className="form-error">This field is required.</span>
          </label>
          <label ref="dateLabel" className={"calender-label" + (this.showDateError ? " is-invalid-label" : '') }>
            Competition Date
            <div ref="date">
              <div className="selected-date empty">
                {this.status.date}
              </div>
              <span className="psr-icons icon-calender"></span>
            </div>
            <span className={"form-error " + (this.showDateError ? " is-visible" : '')}>
              Please enter a valid date.
            </span>
          </label>
          <Select placeholder="select"
                  title="Team"
                  choices={this.teams}
                  onSelected={this.setTeam}
                  index={this.user ? this.user.team_memberships.findIndex(t => t.id == this.status.team_id) : -1}/>
        </div>

        <div className="content-section">
          <h2 className="group-heading">Self-assessment</h2>
          <ul className="no-bullet">
            <PreCompeteLevel title='Stress'
                             level={this.status.stress}
                             setLevel={this.setStress} />
            <PreCompeteLevel title='Fatigue'
                             level={this.status.fatigue}
                             setLevel={this.setFatigue} />
            <PreCompeteLevel title='Injury'
                             level={this.status.injury}
                             setLevel={this.setInjury} />
            <PreCompeteLevel title='Weekly Load'
                             level={this.status.weekly_load}
                             setLevel={this.setWeekyLoad} />
            <PreCompeteLevel title='Hydration'
                             level={this.status.hydration}
                             setLevel={this.setHydration} />
          </ul>
        </div>

        <div className="content-section">
          <h2 className="group-heading">Goal</h2>
          <textarea className="all-border status-goal"
                    value={this.status && this.status.goal}
                    onChange={this.setGoal}></textarea>
        </div>
        <button type="submit" className="button theme expanded" >Save</button>
      </form>
    )
  }
}

export default inject('user')(observer(StatusForm))
