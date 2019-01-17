import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, toJS, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import Api from '../api'
import Medal0 from '../../images/medal-0.png'
import Medal1 from '../../images/medal-1.png'
import Medal2 from '../../images/medal-2.png'
import Medal3 from '../../images/medal-3.png'
import Medal4 from '../../images/medal-4.png'
import Medal5 from '../../images/medal-5.png'
import Medal6 from '../../images/medal-6.png'
import Medal7 from '../../images/medal-7.png'
import Medal8 from '../../images/medal-8.png'

class AchievementForm extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       award: { title: '',
                                competition: '',
                                date: 'm/d/yyyy',
                                location: '',
                                team: '',
                                badge_id: '' },
                       dateValid: true,
                       badgeSelected: false,
                       badgeValid: true,
                       badges: []
                     });
  }

  componentDidMount() {

    Api.getBadges()
      .then(badges => {

        this.badges = badges;
      })
      .catch(err => {
        console.log(err);
      });

    $(ReactDOM.findDOMNode(this.refs.achievementForm)).foundation();

    const date = new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000);
    const year = date.getFullYear();
    const self = this;
    $(ReactDOM.findDOMNode(this.refs.date)).datetimepicker({
      format: 'm/d/Y',
      yearStart: 1990,
      yearEnd: year,
      timepicker: false,
      scrollInput: false,
      scrollMonth: false,
      scrollTime: false,
      defaultSelect: false,
      todayButton: false,
      // inline: true,
      onGenerate:function(ct){
        $('.calender-label').append($(this));
        $(this).addClass(self.user && self.user.user_type);
      },
      onSelectDate: ct => {
        self.award.date = moment(ct).format('YYYY-MM-DD');
        $('.selected-date').removeClass('empty');
        this.dateValid = true;
      }
    })

    $(ReactDOM.findDOMNode(this.refs.achievementForm))
      .on("forminvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        if(this.award.date == 'm/d/yyyy') {
          this.dateValid = false;
        }
        if(!this.badgeSelected) this.badgeValid = false;
        this.scrollToError();
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        if(this.award.date == 'm/d/yyyy') {
          this.dateValid = false;
        }
        if(!this.badgeSelected) this.badgeValid = false;

        if(this.dateValid && this.badgeValid) {
          this.props.onSubmit(this.award);
        }
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  scrollToError = () => {
    const errorField = $('.form-error.is-visible')[0];
    $('html, body').scrollTop(errorField.offsetTop - 120);
  }

  setAward = award => {

    this.award = award;
    this.setBadge(award.badge_id);
  }

  setAchieveTitle = e => {
    this.award.title = e.target.value;
  }

  // setTournTitle = e => {
  //   this.award.competition = e.target.value;
  // }

  // setLocation = e => {
  //   this.award.location = e.target.value;
  // }

  setTeam = e => {
    this.award.team = e.target.value;
  }

  setBadge = (badgeInex) => {
    this.badgeSelected = true;
    this.badgeValid = true;
    $('.badge').addClass('dirty').removeClass('active');
    $($('.badge')[badgeInex - 2]).addClass('active');
    this.award.badge_id = badgeInex;
  }

  trySubmit = () => {
    $(ReactDOM.findDOMNode(this.refs.achievementForm)).submit();
  }

  render() {

    return (
      <form data-abide noValidate ref="achievementForm" className="achievement-form">
        <div className="group-section">
          <h2 className="section-heading">Achievement Information</h2>
          <label>Achievement Title
            <input type="text" name="achieveTilte"
                   placeholder="i.e. Fair Play, Sportsmanship etc."
                   required
                   value={this.award.title}
                   onChange={this.setAchieveTitle} />
            <span className="form-error">This field is required.</span>
          </label>
          {/* <label>Achievement Category
            <input type="text" name="tournTitle"
                   placeholder="League, Championships, Playoffs, etc."
                   value={this.award.competition}
                   onChange={this.setTournTitle} />
          </label>
          <label>Location
            <input type="text"
                   placeholder="i.e. Vancouver, New York etc."
                   value={this.award.location}
                   onChange={this.setLocation} />
          </label> */}
          <label>Team, Event, or Organization
            <input type="text"
                   placeholder=""
                   value={this.award.team}
                   onChange={this.setTeam}/>
          </label>
          <label ref="dateLabel"
                 className={"calender-label" + (this.dateValid ? "" : " is-invalid-label") }>Date Achieved
            <div ref="date">
              <div className="selected-date empty">
                {this.award.date}
              </div>
              <span className="psr-icons icon-calender"></span>
            </div>
            <span className={"form-error " + (this.dateValid ? "" : " is-visible")}>Please enter a valid date.</span>
          </label>

        </div>
        <div className="group-section">
          <h2 className="section-heading">Choose a Badge</h2>
          <span className={"form-error " + (this.badgeValid ? "" : " is-visible")}>Please choose a badge.</span>
          <div className="row badges-list">
            {this.badges.map((badge, i) => <div className="badge-col">
                                             <div className="badge"
                                                  onClick={(ev) => { this.setBadge(badge.id); }}>
                                               <img src={badge.image_url} />
                                             </div>
                                           </div>)}
          </div>
        </div>
        <button type="submit" className="button theme float-right" >Save</button>
      </form>
    )
  }
}

export default inject('user')(observer(AchievementForm))
