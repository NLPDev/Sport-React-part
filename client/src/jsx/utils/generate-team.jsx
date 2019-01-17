import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import Select from '../components/select'

export default inject('user')(observer(class extends Component {

  constructor(props) {

    super(props);

    extendObservable(this,
                     { message: '',
                       teamName: '',
                       tagline: '',
                       coachEmail: '',
                       athleteEmail: 'seanchen202',
                       sportId: 1,
                       curSportIndex: 0,
                       sportChoices: [],
                       startIndex: 1,
                       team: null });

    this.userTemplate = { user_type: 'athlete',
                          first_name: '',
                          last_name: '',
                          email: '',
                          password: 'password',
                          confirm_password: 'password',
                          date_of_birth: '1990-08-16',
                          country: 'ca',
                          province_or_state: 'British Columbia',
                          city: 'Abc Def',
                          newsletter: false,
                          terms_conditions: true,
                          tagline: '' }
    this.athletes = [
      {first_name: 'Alice', last_name: 'Brown'},
      {first_name: 'Brooklyn', last_name: 'Davis'},
      {first_name: 'Charlotte', last_name: 'Williams'},
      {first_name: 'Harper', last_name: 'Miller'},
      {first_name: 'Chloe', last_name: 'Johnson'},
      {first_name: 'Evelyn', last_name: 'Taylor'},
      {first_name: 'Avery', last_name: 'White'},
      {first_name: 'Scarlett', last_name: 'Thompson'},
      {first_name: 'Mila', last_name: 'Martinez'},
      {first_name: 'Elizabeth', last_name: 'Clark'},
      {first_name: 'Sarah', last_name: 'Robinson'},
      {first_name: 'Natalie', last_name: 'Lewis'},
      {first_name: 'Henry', last_name: 'Walker'},
      {first_name: 'Eli', last_name: 'King'},
      {first_name: 'Sebastian', last_name: 'Harris'},
    ]
  }

  componentDidMount() {

    Api.getSports()
      .then(result => {
        this.sports = result;
        this.sportChoices = result.map(s => s.name);
        this.sportId = this.sports[this.curSportIndex].id;
      })
      .catch(err => console.log(err));
  }
  
  generateTeam = () => {
console.log(this.coachEmail);
    if (this.coachEmail) {

      const coach = Object.assign({}, this.userTemplate);

      coach.email = this.coachEmail;
      const coachFirstLast = this.coachName.split(' ');
      coach.first_name = coachFirstLast[0];
      coach.last_name = coachFirstLast.length > 1 ? coachFirstLast[1] : 'Coach';
      Api.createUser(coach)
        .then(newCoach => {
          if (newCoach.id) {
            localStorage.setItem('user_id', user.id);
            localStorage.setItem('jwt_token', user.token);
            this.props.setUser(user);
            this.props.onNext(user);
          }
          this.newTeamAndAthletes();
        })
        .catch(err => console.log(err))
    } else {
      this.newTeamAndAthletes();
    }
  }

  newTeamAndAthletes = () => {

    Api.createTeam({ name: this.teamName,
                     status: 'active',
                     sport_id: this.sportId,
                     location: 'BC',
                     season: '2017 Fall',
                     tagline: this.tagline })
      .then(team => {

        this.team = team;
        const allUsers = this.athletes.map((ath, i) => {

          const eIndex = ('00' + (i + parseInt(this.startIndex))).substr(-2);

          ath.email = `${this.athleteEmail}+${eIndex}@gmail.com`;
          const athlete = Object.assign(this.userTemplate, ath);

          return Api.createUser(athlete);
        });
        return Promise.all(allUsers);
      })
      .then(users => {

        console.log(result);
        return Api.sendInvitation({ recipients: users.map(u => ({ recipient: u.email,
                                                                  team_id: this.team.id })) })
      })
      .catch(err => console.log(err));
  }

  setName = (ev) => {

    this.teamName = ev.target.value;
  }

  setTagLine = (ev) => {

    this.tagline = ev.target.value;
  }

  setCoachEmail = (ev) => {

    this.coachEmail = ev.target.value;
  }

  setAthleteEmail = (ev) => {

    this.athleteEmail = ev.target.value;
  }

  setStartIndex = (ev) => {

    this.startIndex = ev.target.value;
  }

  setSport = sport => {

    this.curSportIndex = this.sports.findIndex(s => s.name == sport);
    this.sportId = this.sports[this.curSportIndex].id;
  }

  render() {

    return <div style={{marginLeft: 20}}>
            <label>Team Name
              <input type="text" placeholder="Type team name here"
                     value={this.teamName}
                     onChange={this.setName}/>
            </label>
            <label>Team Slogan
              <input type="text" placeholder="tagline"
                     value={this.tagline}
                     onChange={this.setTagLine} />
            </label>
            <Select choices={this.sportChoices}
                    onSelected={this.setSport}
                    required
                    title="Sport"
                    index={this.curSportIndex}/>
            <label>Coach Name
              <input type="text" placeholder="first last"
                     value={this.coachName}
                     onChange={this.setCoachName} />
            </label>
            <label>Coach Email
              <input type="text" placeholder="coach email"
                     value={this.coachEmail}
                     onChange={this.setCoachEmail} />
            </label>
            <label>Athlete Email Base
              <input type="text" placeholder="email"
                     value={this.athleteEmail}
                     onChange={this.setAthleteEmail} />
            </label>
            <label>Athlete Email Start Index
              <input type="text" placeholder="start index"
                     value={this.startIndex}
                     onChange={this.setStartIndex} />
            </label>
            <button className="button theme" onClick={this.generateTeam}>Generate</button>
            <div>{this.message}</div>
           </div>
  }
}))