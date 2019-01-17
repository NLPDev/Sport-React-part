import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, toJS, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import loadImage from 'blueimp-load-image'

import Select from '../../components/select'
import Api from '../../api'

class TeamProfileForm extends Component {

  constructor() {

    super();
    extendObservable(this,
                      { team: { name: '',
                                status: 'active',
                                sport_id: '',
                                season: '',
                                location: '',
                                tagline: '' },
                        teamIn: computed(() => this.props.team),
                        newTeam: true,
                        emails: [''],
                        extraFields: [],
                        numExtra: computed(() => {
                          return this.extraFields.length;
                        }),
                        profileImgOrg: '',
                        profileImg: '',
                        imageBlank: computed(() => !this.profileImgOrg.length),
                        profileImgChanged: false,
                        sportChoices: [],
                        curSportIndex: 0,
                      });
  }

  componentDidMount() {

    if (undefined !== this.props.team) {
      if (null === this.props.team) {
        const disposer = observe(this,
                                 'teamIn',
                                 change => {
 
                                   if (change.newValue) {
                                     this.team = this.teamIn;
                                     this.profileImgOrg = this.team.team_picture_url;
                                     disposer();
                                   }
                                 });
      } else {
        this.team = this.props.team;
        this.profileImgOrg = this.team.team_picture_url;
      }
      this.newTeam = false;
    }

    Api.getSports()
      .then(result => {
        this.sports = result;
        this.sportChoices = result.map(s => s.name);
        this.team.sport_id = this.sports[this.curSportIndex].id;
      })
      .catch(err => console.log(err));

    $(ReactDOM.findDOMNode(this.refs.teamProfileForm)).foundation();
    if(this.profileImgOrg) {
      this.updateProfilePicClass(this.profileImgOrg)
    }

    observe(this,
            'profileImgOrg',
            change => {
              if (change.newValue) {
                this.updateProfilePicClass(change.newValue);
              }
            });
    this.initValidation();
  }

  initValidation = () => {

    $(ReactDOM.findDOMNode(this.refs.teamProfileForm))
      .on("forminvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        this.scrollToError();
        return;
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        this.submitChange()
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  turnOffValidation = () => {
    $(ReactDOM.findDOMNode(this.refs.teamProfileForm))
      .off("forminvalid.zf.abide")
      .off('submit');
  }

  updateProfilePicClass = (newValue) =>{
    const img = new Image();
    img.src = newValue;
    img.onload = function() {
      if(this.width >= this.height) {
        $('.profile-pic').removeClass('portrait').addClass('landscape');
      } else {
        $('.profile-pic').removeClass('landscape').addClass('portrait');
      }
    }
  }

  scrollToError = () => {

    const errorField = $('.form-error.is-visible')[0];
    $('body').scrollTop(errorField.offsetTop -80);
  }


  setName = e => {

    this.team.name = e.target.value;
  }

  setLocation = e => {

    this.team.location = e.target.value;
  }

  setSlogan = e => {
    this.team.tagline = e.target.value;
  }

  setSport = sport => {

    this.curSportIndex = this.sports.findIndex(s => s.name == sport);
    this.team.sport_id = this.sports[this.curSportIndex].id;
  }

  setSeason = e => {
    this.team.season = e.target.value;
  }

  trySubmit = () => {
    $(ReactDOM.findDOMNode(this.refs.teamProfileForm)).submit();
  }

  submitChange = e => {
    if (e) {
      e.preventDefault();
    }
    let pictureForm = null;

    if (this.profileImgChanged) {
      pictureForm = new FormData();

      pictureForm.append('team_picture', $('#profilePic')[0].files[0]);
    }
    if (this.props.onSubmit) this.props.onSubmit(this.team, pictureForm, this.emails);
  }

  readURL = (e) => {
    const self = this;
    loadImage(
         e.target.files[0],
         function (img) {
           self.profileImgChanged = true;
           self.profileImg = true;

             $('.profile-pic').empty().append(img)
         },
         {
           aspectRatio: 1,
           orientation: true,
         }
     );
  }

  updateEmail = (email, index) => {

    this.emails[index] = email;
    if (index > 1) {
      this.refs['email' + index].value = email;
    }
  }

  addEmailFields = () => {

    const curIndex = this.numExtra + 1;

    this.emails.push('');
    this.extraFields.push(<label key={curIndex}>Email
                            <input type="email" placeholder="Athlete's email address"
                                   ref={i => { this.refs['email' + curIndex] = i;
                                               this.turnOffValidation();
                                               Foundation.reInit('abide');
                                               this.initValidation() }}
                                   onChange={e => { this.updateEmail(e.target.value, curIndex) }}/>
                            <span className="form-error">Please enter a valid email address.</span>
                          </label>);
  }

  render() {

    return (
      <form data-abide noValidate id="team-profile-form" ref="teamProfileForm">
        <div className="content-section ">
          <h2 className="section-heading">General</h2>
          <label>Profile pic</label>
          <p className="pic-upload-note">For best profile image results, upload a portrait-style, square image.</p>
          <div className="profile-upload-wrap">
            <label htmlFor="profilePic" className="add-btn-lg upload-btn show" ref="uploadIcon">
              <span className="psr-icons icon-plus"></span>
            </label>
            <div className={"profile-pic " + (this.profileImgOrg || this.profileImg ? "show" : "")}

                 ref="profilePicDiv" >
              <img src={this.profileImgOrg}
                   title="profile picture" ref="profileImg"/>
            </div>
          </div>
          <label htmlFor="profilePic" className="text-center body-text">{(this.imageBlank ? 'Add' : 'Edit') +  ' profile pic'}</label>
          <input type="file" id="profilePic" className="show-for-sr" ref="profilePic"
                 onChange={this.readURL}/>
          <label>Team Name
            <input type="text" name="name" placeholder="Type team name here" required
                   value={this.team && this.team.name}
                   onChange={this.setName}/>
            <span className="form-error">This field is required.</span>
          </label>
          {this.newTeam ?
            <Select choices={this.sportChoices}
                    onSelected={this.setSport}
                    required
                    title="Sport"
                    index={this.curSportIndex}/> :
            <label>Sport
              <input type="text" value="baseball" readOnly/>
            </label>
          }

          <label>Season
            <input type="text" name="season" placeholder="Enter the season or year here" required
                   maxLength="25"
                   value={this.team && this.team.season}
                   onChange={this.setSeason} />
            <span className="form-error">This field is required.</span>
          </label>
          <label>City/Province/School
            <input type="text" name="tagline" placeholder="Enter here" required
                   value={this.team && this.team.location}
                   onChange={this.setLocation} />
            <span className="form-error">This field is required.</span>
          </label>
          <label>Team Slogan
            <input type="text" name="teamSlogan" placeholder="Enter here" required
                   value={this.team && this.team.tagline}
                   onChange={this.setSlogan} />
            <span className="form-error">This field is required.</span>
          </label>
        </div>

        <div className="content-section ">
        <h2 className="section-heading">Invite athletes to the team</h2>
        <label>Email
          <input type="email"
                 placeholder="Athlete's email address"
                 value={this.emails[0]}
                 onChange={e => { this.updateEmail(e.target.value, 0) }}/>
          <span className="form-error">Please enter a valid email address.</span>
        </label>
        {this.extraFields}
        <div className="add-wrap" onClick={this.addEmailFields}>
          <span className="psr-icons icon-add"></span>
          <span>Add more</span>
        </div>
        {/* <button type="submit" className="button expanded theme" value="Next" data-open="save-confirmation">Send</button> */}
      </div>
      </form>
    )
  }
}

export default inject('user')(observer(TeamProfileForm))
