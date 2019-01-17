import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../../components/util-bar'
import Api from '../../api'
import PerfLevelSet from '../components/level14-set'
import SkillSet from '../components/skill-set'
import DP from '../../utils/data-proc'
import AvatarRed from '../../../images/avatar-red.png'
import Select from '../../components/select'
import SaveConfirmation from '../../components/save-confirmation'
import InfoPopupTechnicalPhysical from '../components/info-popup-technical-physical'
import TeamAssessForm from '../components/team-assess-form'

class TeamTechnicalAss extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { team: null,
                       sport: '',
                       skillSets: computed(() => { return DP.constructSkillSet(this.props.assDefs,
                                                                               null,
                                                                               this.sport,
                                                                               this.curSubsportIndex) }),
                       flattenSkillSet: computed(() => {
                                          const ss = this.skillSets.reduce((acc, skillSet) => {
                                                       acc = acc.concat(skillSet.skills.slice());
                                                       return acc;
                                                     }, []);
                                          if (ss.length) {
                                            this.getHistory(ss[0].assessment_id);
                                          }
                                          console.log('flattened', ss);
                                          return ss;
                                        }),
                       subSports: computed(() => { return this.getSubSports(); }),
                       curSubsport: '',
                       curSubsportId: 0,
                       curSubsportIndex: 0,
                       curSubsportChoices: computed(() => { return this.subSports.map(sc => sc.name) }),
                       title: 'New Assessment',
                       readonly: false,
                       isValidationErr: false,
                       isApiErr: false,
                       assessments: [] });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    this.curSubsportId = this.props.match.params.s_id;
    if (this.subSports.length) {
      this.curSubsportIndex = this.subSports.findIndex(ss => ss.id == this.curSubsportId);
    } else {
      const disposer = observe(this,
                               'subSports',
                               change => {
                                 if (change.newValue.length) {
                                   this.curSubsportIndex = this.subSports.findIndex(ss => ss.id == this.curSubsportId);
                                   disposer();
                                 }
                               });
    }
    Api.getTeamInfo(this.props.match.params.t_id)
        .then(team => {
          this.team = team;
          return Api.getSports();
        })
        .then(sports => {
          this.sport = sports.find(s => s.id == this.team.sport_id).name;
          if (this.subSports.length) {
            this.curSubsport = this.subSports.find(sc => sc.id == this.curSubsportId).name;
          } else {
            const disposer = observe(this,
                                     'subSports',
                                     change => {
                                       if (change.newValue) {
                                         this.curSubsport = this.subSports.find(sc => sc.id == this.curSubsportId).name;
                                         disposer();
                                       }
                                     });
          }
        })
        .catch(err => console.log(err));
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  getSubSports = () => {

    if (!(this.props.assDefs && this.team)) return [];

    const sport = this.props.assDefs.find(assDef => assDef.id == this.team.sport_id);

    return sport.childs;
  }

  onSave = (e) => {
    e.preventDefault();
    $('#save-confirmation').foundation('open');

    const allSkills = this.skillSets.reduce((acc, skillSet) => {
                                              acc = acc.concat(skillSet.childs.slice());
                                              return acc;
                                            }, []);
    const newAss = allSkills.filter(s => s.modified);

    if (newAss && newAss.length) {
      this.isValidationErr = false;
      Api.newTeamAssessments(newAss.map(s => ({ assessment_id: s.assessment_id || s.id,
                                                assessed_id: this.props.match.params.a_id,
                                                value: s.level || parseFloat(s.value).toFixed(2)})),
                             this.props.match.params.t_id)
        .then(result => {
          this.isApiErr = false;
          this.refs.saveConfirmation.showConfirmation();
          this.props.refreshAssessment();
        })
        .catch(err => {
          this.isApiErr = true;
          this.refs.saveConfirmation.showApiError()
        });
    } else {
      this.isValidationErr = true;
      this.refs.saveConfirmation.showValidationError();
    }
  }

  onCancel = () => {
    this.props.history.push('/dashboard/directory/team-management/' + this.props.match.params.t_id + '/technical-tactical');
  }

  onClose = () => {
    if(this.isValidationErr || this.isApiErr) return;
    this.onCancel();
  }

  setSport = (subsport) => {

    this.curSubsport = subsport;
    const curSS = this.subSports.find(ss => ss.name == subsport);

    this.curSubsportId = curSS.id;
    this.curSubsportIndex = this.subSports.findIndex(ss => ss.name == subsport);
    history.replaceState(null,
                         "",
                         `/dashboard/directory/team-management/${this.props.match.params.t_id}/technical-tactical/new-assessment/${this.props.match.params.a_id}/${this.curSubsportId}`);
  }

  onToggle = () => {

  }

  render() {

    return (
      <div className="assess" ref="me">
        <UtilBar title={this.title} onCancel={this.onCancel} onSave={this.onSave} readonly={this.readonly}/>
        <div className="row align-center main-content-container">
          <div className="column content-column">

            <h3 className="group-heading">Select your Assessment</h3>
            <div className="sports-filter">
              <Select choices={this.curSubsportChoices}
                      onSelected={this.setSport}
                      index={this.curSubsportChoices.findIndex(c => c == this.curSubsport)}/>
            </div>
            <h3 className="group-heading text-right">
              Assessment Legend
              <span className="psr-icons icon-info" data-open="info-popup-technical-physical"></span>
            </h3>
            <form>
            {this.skillSets.map(skillSet => {
                                  if ('level14' == skillSet.setType) {
                                    return <PerfLevelSet levelSet={skillSet} key={skillSet.setName}/>
                                  } else {
                                    return <SkillSet key={skillSet.setName}
                                                     readonly={false}
                                                     skillSet={skillSet}
                                                     isImperial={false} />
                                  }
                                })}
              <button type="submit" className="button theme float-right" onClick={this.onSave}>Save</button>
            </form>
          </div>
        </div>

        <InfoPopupTechnicalPhysical />
        <SaveConfirmation userType={this.props.user ? this.props.user.user_type : ""}
          msg="New assessment has been created successfully."
          apiMsg="The format of some fields are not correct, please enter in valid form and submit again."
          validationMsg="Please make sure you have made an assessment to at least one item."
          noAutoPopup={true}
          onClose={this.onClose}
          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'assDefs', 'refreshAssessment')(observer(TeamTechnicalAss))
