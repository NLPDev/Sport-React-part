import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import ContentCard from './components/content-card'

import BarChart from './components/bar-chart'
import RadarChart from './components/radar-chart'
import LineChart from './components/line-chart'
import DP from '../utils/data-proc'
import EmptyPopup from './components/empty-popup'
import InfoPopupTechnicalPhysical from './components/info-popup-technical-physical'
import InfoPopupLeadership from './components/info-popup-leadership'


export default inject('user', 'assDefs', 'assessments')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       curSport: '',
                       sports: [],
                       skills: [],
                       mentalAsses: [],
                       curType: 0,
                       emptyMsg: '',
                       actionLink: '',
                       emptyType: '',
                       infoPopupType: 'technicalPhysical',
                       skillSets: computed(() => { return DP.constructSkillSet(this.props.assDefs,
                                                                               this.props.assessments,
                                                                               this.curSport,
                                                                               this.curType,
                                                                               true) }),
                       flattenSkillSet: computed(() => {
                                          if ('Rugby' == this.curSport ||
                                              'Tennis' == this.curSport) return [];

                                          const ss = this.skillSets.reduce((acc, skillSet) => {
                                                       acc = acc.concat(skillSet.childs.slice());
                                                       return acc;
                                                     }, []);
                                          if (ss.length) {
                                            //this.getHistory(ss[0].assessment_id);
                                          }
                                          console.log('flattened', ss);
                                          return ss;
                                        }),
                       isRadarChart: computed(() => {
                                       return (('Baseball' == this.curSport ||
                                                'Basketball' == this.curSport ||
                                                'Hockey' == this.curSport ||
                                                'Soccer' == this.curSport ||
                                                'Volleyball' == this.curSport) && this.flattenSkillSet.length);
                                     })
                     });
  }

  compoentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    this.showSelectedSport();

    observe(this,
            'user',
            change => {
              if (change.newValue) {
                this.showSelectedSport();
                if (!this.props.user.chosen_sports.filter(cs => cs.is_displayed).length) {
                  this.showNoSports();
                } else if (!this.props.user.linked_users.length) {
                  this.showNoCoach();
                }
              }
            });

    if (!this.props.user) return;
    if (!this.props.user.chosen_sports.filter(cs => cs.is_displayed).length) {
      this.showNoSports();
    } else if (!this.props.user.linked_users.length && !window.emptyConnectionPopupShown) {
      this.showNoCoach();
      window.emptyConnectionPopupShown = true;
    }
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  showNoSports = () => {
    this.emptyMsg = "Looks like you haven't chosen any sports yet. Don't worry, you can add them now.",
    this.actionLink = "/dashboard/add-sport";
    this.emptyType = "sport";

    this.showEmptyPopup();
  }

  showNoCoach = () => {
    this.emptyMsg = "Looks like you haven't connected to any coaches yet. Don't worry, you can invite your coach now.",
    this.actionLink = "/dashboard/invite";
    this.emptyType = "link";

    this.showEmptyPopup();
  }

  showEmptyPopup = () => {
    const popup = new Foundation.Reveal($('#empty-popup'));
    popup.open();
  }

  showSelectedSport = () => {

    if (!this.user) return;

    this.sports = this.user.chosen_sports.filter(s => s.is_displayed);

    if (this.sports.length) {
      this.setSport(null, this.sports[0].sport);
    }
  }

  updateSkills = () => {

    const curTopSportDef = this.props.assDefs.find(topSportDef => topSportDef.name.toLowerCase() ==
                                                                  this.curSport);
    const curSubCatDef = curTopSportDef.childs[0];
    const curTopSportAss = this.props.assessments.find(topAss => topAss.name.toLowerCase() == this.curSport);
    const curSubCatAss = curTopSportAss.childs[0];

    this.flattenSkillSet = DP.getFlattenedAss(curSubCatDef, curSubCatAss);
  }

  setSport = (ev, sport) => {

    if (ev) {
      $(ev.target).siblings().removeClass("active");
      $(ev.target).addClass("active");
    }
    this.curSport = sport;
    //this.props.setSport(sport);
    if (this.props.assDefs && this.props.assessments) {
      //this.updateSkills();
    }
  }

  popupTechnicalPhysical = () => {
    $('#info-popup-technical-physical').foundation('open');
  }

  popupLeadership = () => {
    $('#info-popup-leadership').foundation('open');
  }

  render() {

    return (
      <div className="overview" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">

              <h2 className="content-heading">{'Hi, ' + ((this.user && this.user.first_name) ? this.user.first_name : '') +'!'}</h2>

              <div className="group-section">
                <h3 className="group-heading">My Sports</h3>
                <div className="button-group sports">
                  {this.sports.map((s, i) =>
                    <button className={"button border" + (0 == i ? " active" : "")}
                            onClick={(e) => this.setSport(e, s.sport)}>{s.sport}</button>)}
                  <Link to="/dashboard/add-sport" className="button border responsive add right">
                    <span className="psr-icons icon-plus"></span><span className="show-for-large">Add sport</span>
                  </Link>
                </div>
                <hr className="divider show-for-large"/>
              </div>

              <div className="group-section">
                <h3 className="group-heading">My Coaches</h3>
                <Link to={{ pathname: '/dashboard/invite', state: { from: 'overview' } }}
                      className="button border icon">
                <span className="psr-icons icon-plus"></span> Invite a coach</Link>
                <hr className="divider show-for-large"/>
              </div>

              {/* comment for phase 1 launch */}
              {/* <div className="row">
                <div className="column small-12 large-6 team-block">
                  <div className="group-section">
                    <h3 className="group-heading">Team</h3>
                    <ContentCard />
                  </div>
                </div>
                <div className="column small-12 large-6">
                  <div className="group-section">
                    <h3 className="group-heading">Latest Awards</h3>
                    <AwardCard color="blue" title="Fair Play" organization="Soccer Junior Nationals" date="6 May 2016, Vancouver BC"/>
                    <AwardCard color="red" title="Personal Goal" organization="Soccer senior Nationals" date="17 May 2015, Vancouver BC"/>
                  </div>
                </div>
              </div> */}

              <div className="group-section">
                <h3 className="group-heading">My Assessment Overview</h3>

                  <div className="row">
                    {this.isRadarChart ?
                      <div className="column small-12 large-6">
                        <RadarChart title="Athlete Overview"
                                    subTitle="Technical/Tactical Skills"
                                    onInfoPopup={this.popupTechnicalPhysical}
                                    skills={this.flattenSkillSet}/>
                      </div> : null}
                    {/*
                    <div className="column small-12 large-6">
                      <BarChart title="Overview" subTitle="Physical"/>
                    </div>
                    */}
                  </div>
                {/*
                <div className="row">
                  <div className="column small-12 large-6">
                    <RadarChart title="Overview"
                                subTitle="Leadership"
                                skills={this.skills}/>
                  </div>
                  <div className="column small-12 large-6">
                    <RadarChart title="Overview"
                                subTitle="Fundamental Movement Skills (Part A)"
                                skills={this.skills}/>
                  </div>
                </div>
                */}
              </div>

          </div>
        </div>

        <InfoPopupTechnicalPhysical />
        <InfoPopupLeadership />
        <EmptyPopup ref="emptyPopup" userType={this.user && this.user.user_type}
          msg={this.emptyMsg} actionLink={this.actionLink}
          emptyType={this.emptyType}
        />
      </div>
    )
  }
}))
