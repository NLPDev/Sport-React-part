import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observable, observe, intercept} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import TeamLogo from '../../images/team-logo.png'

import BarChart from './components/bar-chart'
import LineChart from './components/line-chart'
import Select from '../components/select'
import DP from '../utils/data-proc'
import InfoPopupTechnicalPhysical from './components/info-popup-technical-physical'
import InfoPopupTechnicalPhysicalWithVideo from './components/info-popup-technical-physical-with-video'

import videoLinks from './video-links'
import HistoryBtn from '../components/history-btn'

export default inject('user', 'setUser', 'assDefs', 'assessments')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curCategory: '',
                       curCategoryIndex: computed(() => {
                                           return this.physicalChoices.findIndex(c => c == this.curCategory); }),
                       curSubCat: 0,
                       physicalDefs: computed(() => { return DP.getPhysicalDefs(this.props.assDefs,
                                                                                this.props.assessments,
                                                                                true) }),
                       physicalChoices: computed(() => { console.log(this.physicalDefs.map(ss => ss.name));
                                                         return this.physicalDefs.map(ss => ss.name); }),
                       curCategoryId: computed(() => {
                                        if (this.physicalDefs.length && this.curCategoryIndex >= 0) {
                                          return this.physicalDefs[this.curCategoryIndex].id;
                                        } else {
                                          return 0;
                                        }
                                      }),
                       curHistories: computed(() => { return DP.getHistory(this.physicalDefs,
                                                                           this.curCategoryIndex,
                                                                           this.curSubCat); }),
                       assessmentDates: computed(() => {
                                          if (this.curHistories.histories.length) {
                                            return this.curHistories.histories[0].values.map(v => v.date_assessed.substr(0, 10));
                                          }
                                          return [];
                                        }),
                       curInfoPopupType: 'info-popup-technical-physical-with-video'
                     });
  }

  componentWillMount() {

    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
    this.disposer = observe(this,
                            'physicalChoices',
                            change => {
                              if (this.props.match.params.cat_id) {
                                const catIndex = this.physicalDefs.findIndex(ss => ss.id == this.props.match.params.cat_id);
                                this.curCategory = this.physicalChoices[catIndex];
                              } else {
                                this.curCategory = change.newValue[0];
                              }
                            });
  }

  componentWillUnmount() {
    $('body').scrollTop(0);
    this.disposer();
  }

  setCategory = cat => {

    this.curCategory = cat;
    if ('Fundamental Movement Skills' == cat) {
      this.curInfoPopupType = 'info-popup-technical-physical-with-video';
    } else {
      this.curInfoPopupType = 'info-popup-technical-physical';
    }
    //this.refs.history.resetIndex();
    this.setSubCat(null, 0);
  }

  setSubCat = (ev, subCat) => {

    if (ev) {
      $(ev.target).siblings().removeClass('active');
      $(ev.target).addClass('active');
    } else {
      $('.pill-nav').children().removeClass('active');
      $('.pill-nav').children().first().addClass('active');
    }
    //this.refs.history.resetIndex();
    this.curSubCat = subCat;
    $('#physical-video').attr('src', videoLinks.show[this.physicalDefs[this.curCategoryIndex].childs[subCat].name]);
  }

  popupTechnicalPhysical = () => {
    $(`#${this.curInfoPopupType}`).foundation('open');
  }

  render() {

    return (
      <div className="physical" ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">

            <h2 className="content-heading text-center">Assess yourself or invite a coach to assess your skills.</h2>

            <div className="group-section">
              <h3 className="group-heading">Invite Coaches</h3>
              <Link to={{ pathname: '/dashboard/invite', state: { from: 'physical' } }}
                    className="button border icon">
                <span className="psr-icons icon-plus"></span><span> Invite a coach</span>
              </Link>
              <hr className="divider show-for-large"/>
            </div>

            <div className="group-section">
              <div className="group-heading-wrap">
                <h3 className="group-heading">Create a New Assessment</h3>
                <div className="button-group">
                  <HistoryBtn history={this.props.history}
                              user={this.props.user}
                              link={`physical/${this.curCategoryId}`}
                              dates={this.assessmentDates}/>
                  <Link to={`/dashboard/physical/new-assessment/${this.curCategoryId}`}
                        className="button border responsive add">
                    <span className="psr-icons icon-plus"></span>
                    <span className="show-for-large">Add new</span>
                  </Link>
                </div>
              </div>
              <hr className="divider show-for-large"/>
            </div>

            <div className="group-section">
              <div className="group-heading-wrap sports-filter-wrap row">
                <h3 className="group-heading column small-12">Select Your Assessment to View</h3>
                <div className="column small-12">
                  <div className="sports-filter">
                    <Select placeholder="select"
                            choices={this.physicalChoices}
                            onSelected={this.setCategory}
                            index={this.curCategoryIndex}/>
                      {/* <button className="button theme">Go</button> */}
                  </div>
                </div>
              </div>
              <hr className="divider show-for-large"/>
            </div>

            <div className="group-section">
              <div className="pill-nav-container">
                <div className="pill-nav">
                  {this.physicalDefs.length && this.curCategoryIndex >= 0 ?
                    this.physicalDefs[this.curCategoryIndex].childs.map((def, i) =>
                      <div className={"nav-item " + (0 == i ? "active" : "")}
                          key={i}
                          onClick={ev => { this.setSubCat(ev, i) }}>{def.name}</div>) :
                    null}
                </div>
              </div>
              {/*
              <BarChart title="Athlete Overview" subTitle="Speed - 20m / 40m / 60m" skills={[]}/>
              */}
              <LineChart title="Athlete Progress"
                         subTitle=""
                         singleLine={true}
                         unit={this.curHistories.unit}
                         onInfoPopup={this.popupTechnicalPhysical}
                         histories={this.curHistories.histories}
                         ref='history'/>
            </div>

          </div>
        </div>

        <InfoPopupTechnicalPhysical />
        <InfoPopupTechnicalPhysicalWithVideo />
      </div>
    )
  }
}))
