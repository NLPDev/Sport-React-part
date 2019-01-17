import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import AvatarRed from '../../images/avatar-red.png'
import AvatarTeam from '../../images/avatar-team.png'
import EmptyPopup from './components/empty-popup'
import Select from '../components/select'


const EntitySection = (props) => (

  <div key={props.letter}>
    <h3 className="letter-heading">{props.letter}</h3>
      <ul className="no-bullet">
        {

          props.entities
            .sort((a, b) => a.first_name > b.first_name)
            .map((entity, i) => {

            let entName, linkRoot, linkTail, pictureUrl;

            if ('Athlete' == props.entType) {
              entName = entity.first_name + ' ' + entity.last_name;
              linkRoot = '/dashboard/directory/athlete-management/';
              linkTail = '/overview';
              pictureUrl = entity.profile_picture_url || AvatarRed;
            } else {
              entName = entity.name;
              linkRoot = '/dashboard/directory/team-management/';
              linkTail = '/team-directory';
              pictureUrl = entity.team_picture_url || AvatarTeam;
            }

            return (
              <li className="profile-pic-wrap link" key={i}>
                <Link to={`${linkRoot}${entity.id}${linkTail}`}>
                  <div className="profile-thumb"
                    style={{background: `url(${pictureUrl}) #fff no-repeat center center`}}>
                  </div>
                  <span>{entName}</span>
                </Link>
              </li>) }
        ) }
      </ul>
  </div>
)

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       curType: 'Athlete',
                       searchStr: '',
                       actionLink: '',
                       emptyType: '',
                       filtered: computed(() => {
                                   if (!this.user) return [];

                                   const teams = this.user.team_ownerships.concat(this.user.team_memberships);
                                   const items = 'Athlete' == this.curType ? this.user.linked_users : teams;

                                   if (!items) return [];

                                   const searchStrU = this.searchStr.toUpperCase();

                                   return 'Athlete' == this.curType ?
                                            items.filter(a =>
                                              a.first_name.toUpperCase().indexOf(searchStrU) >= 0 ||
                                              a.last_name.toUpperCase().indexOf(searchStrU) >= 0) :
                                            items.filter(t =>
                                              t.name.toUpperCase().indexOf(searchStrU) >= 0);
                                 }),
                       sections: computed(() => {

                                  this.filtered.sort((a, b) => {

                                      var textA = 'Athlete' == this.curType ? a.first_name : a.name;
                                      var textB = 'Athlete' == this.curType ? b.first_name : b.name;
                                      return (textA.toUpperCase() < textB.toUpperCase()) ? -1 : (textA > textB) ? 1 : 0;
                                  });
                  

                                   return this.filtered.reduce((acc, item) => {

                                            const name = 'Athlete' == this.curType ? item.first_name : item.name;

                                            if (!acc.find(letter => letter == name[0].toUpperCase())) {
                                              acc.push(name[0].toUpperCase());
                                            }
                                            return acc;
                                          }, [])
                                          //.sort((a, b) => a.letter > b.letter)
                                          .map(letter => {
                                            const entities = this.filtered
                                                               .filter(e => {
                                                                  const name = 'Athlete' == this.curType ?
                                                                                 e.first_name : e.name;
                                                                  return name[0].toUpperCase() == letter;
                                                                });

                                            return { letter, entities }
                                          }); })
                     });
  }

  compoentWillMount() {
    $('.reveal-overlay').remove();
  }
  
  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    observe(this,
            'user',
            change => {
              if (change.newValue) {
                if (!this.user.linked_users.length) {
                  this.showEmptyPopup();
                }
              }
            });
    if (!this.user) return;
    if (!this.user.linked_users.length && !window.emptyConnectionPopupShown) {

      this.showEmptyPopup();
      window.emptyConnectionPopupShown = true;
    }
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  showEmptyPopup = () => {
    this.emptyMsg = "Looks like you haven't connected to any athletes yet. Don't worry, you can invite athletes now.",
    this.actionLink = "/dashboard/invite";
    this.emptyType = "link";

    const popup = new Foundation.Reveal($('#empty-popup'));
    popup.open();
  }

  changeFilter = (type) => {
    this.curType = type;
  }

  render() {

    return (
      <div className="directory" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">

              <h2 className="content-heading">Manage teams and athletes from your directory.</h2>

              <div className="button-group text-center">
                {/* <Link to="/" className="button border icon">
                  <span className="psr-icons icon-plus"></span><span className="btn-text">Create a team</span>
                </Link> */}
                <Link to="/dashboard/invite" className="button border icon">
                  <span className="psr-icons icon-plus"></span><span className="btn-text">Invite an athlete</span>
                </Link>
              </div>
              <div className="sports-filter">
                <Select choices={['Athlete', 'Team']}
                  onSelected={this.changeFilter}
                  index={['Athlete', 'Team'].findIndex(c => c == this.curType)}/>
              </div>

              <label className="search" >
                search
                <input type="text"
                       placeholder={"Search for " + ('Athlete' == this.curType ? 'an athlete' : 'a team')}
                       value={this.searchStr}
                       onChange={e => this.searchStr = e.target.value}/>
              </label>
              <div className="search-result">

                {this.sections
                  .map(section => <EntitySection {...section}
                                                             entType={this.curType}
                                                             key={section.letter} />)
                  }

                  
              </div>
          </div>
        </div>

        <EmptyPopup ref="emptyPopup" userType={this.user && this.user.user_type}
          msg={this.emptyMsg} actionLink={this.actionLink}
          emptyType={this.emptyType}
        />
      </div>
    )
  }
}))
