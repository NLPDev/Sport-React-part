import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import UtilBar from '../../components/util-bar'
import Api from '../../api'
import PerfLevelSet from '../components/level14-set'
import SkillSet from '../components/skill-set'
import DP from '../../utils/data-proc'
import Select from '../../components/select'
import SaveConfirmation from '../../components/save-confirmation'
import InfoPopupTechnicalPhysical from '../components/info-popup-technical-physical'

class TechnicalAss extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { sport: '',
                       curType: 0,
                       withAss: false,
                       skillSets: computed(() => { return DP.constructSkillSet(this.props.assDefs,
                                                                               this.props.assessments,
                                                                               this.sport,
                                                                               this.curType,
                                                                               this.withAss,
                                                                               this.props.match.params.date) }),
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
                       subCategories: computed(() => { return DP.getSubSports(this.props.assDefs,
                                                                              this.props.user,
                                                                              this.props.match.params.a_id)}),
                       curSubcategory: '',
                       curSubsportId: 0,
                       subCategoryChoices: computed(() => { return this.subCategories.map(sc => sc.name) }),
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

    this.curSubsportId = this.props.match.params.sport;

    if(this.props.title) {
      this.title = this.props.title;
      if ('History' == this.title) {
        this.withAss = true;
      }
    }
    if(this.props.readonly) {
      this.readonly = this.props.readonly;
    }
    if (this.props.match.params.a_id) {
      Api.retrieveAssessments(this.props.match.params.a_id)
        .then(assessments => this.assessments = assessments)
        .catch(err => console.log(err));
    }
    observe(this,
            'subCategories',
            change => {
              const cat = this.subCategories.find(sc => sc.id == this.curSubsportId);
              this.curSubcategory = cat && cat.name;
              this.sport = cat && cat.nameTop.toLowerCase();
              this.curType = cat.indexInTopCat; });
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
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
      Api.newAssessments(newAss.map(s => ({ assessment_id: s.assessment_id || s.id,
                                            assessor_permission: "read_write",
                                            value: s.level || parseFloat(s.value)})),
                         this.props.match.params.a_id)
        .then(result => {
          this.isApiErr = false;
          this.refs.saveConfirmation.showConfirmation();
          this.props.refreshAssessment();
        })
        .catch(err => {
          if (400 == err.status) {
            const errObj = JSON.parse(err.responseText);

            if (errObj.rejected) {
              for (let i = 0; i < errObj.rejected.length; i++) {
                $('.assessment_' + errObj.rejected[i].assessment_id).html(errObj.rejected[i].error).addClass('is-visible');
              }
              console.log(errObj.rejected);
              this.isApiErr = true;
              this.refs.saveConfirmation.showApiError()

            }
          }
        });
    } else {
      this.isValidationErr = true;
      this.refs.saveConfirmation.showValidationError();
    }
    /*
    const forUpdate = allSkills.filter(s => s.modified && s.id);

    if (!forUpdate || 0 == forUpdate.length) return;
    Api.updateAssessments(forUpdate.map(s => ({ id: s.id,
                                                assessor_permission: "read_write",
                                                value: "" + s.level })))

      .then(result => console.log(result))
      .catch(err => console.log(err));
    */
  }

  onCancel = () => {
    if ('coach' == this.props.user.user_type) {
      this.props.history.push('/dashboard/directory/athlete-management/' + this.props.match.params.a_id + '/' +
                              this.curSubsportId);
    } else {
      this.props.history.push('/dashboard/technical-tactical/' + this.curSubsportId);
    }
  }

  onClose = () => {
    if(this.isValidationErr || this.isApiErr) return;
    this.onCancel();
  }

  setSport = (sport) => {

    this.curSubcategory = sport;

    const cat = this.subCategories.find(sc => sc.name == sport);

    this.curSubsportId = cat.id;

    if (cat.nameTop != this.sport) {
      this.sport = cat.nameTop.toLowerCase();
    }
    const newRoute = 'History' == this.title ? `history/${this.props.match.params.date}` :
                                               `new-assessment/${this.props.match.params.a_id ? this.props.match.params.a_id : ''}`;
    history.replaceState(null,
                         "",
                         `/dashboard/technical-tactical/${this.curSubsportId}/${newRoute}`);
    this.curType = cat.indexInTopCat;
  }

  renderAssessor = () => {

    if (!this.skillSets.length || !this.skillSets[0].childs.length) return;
console.log(this.skillSets[0]);
    const assessorId = this.skillSets.length && this.skillSets[0].childs[0].history[0].assessor_id;

    let assessorName = '';
    if (assessorId) {
      if (assessorId == this.props.user.id) {
        assessorName = `${this.props.user.first_name} ${this.props.user.last_name}`;
      } else {
        const assessor = this.props.user.linked_users.find(lu => lu.id == assessorId);

        if (assessor) assessorName = `${assessor.first_name} ${assessor.last_name}`;
      }
    }
    return <p className="text-center">Assessment by {assessorName}</p>
  }

  render() {

    return (
      <div className="assess" ref="me">
        <UtilBar title={this.title} onCancel={this.onCancel} onSave={this.onSave} readonly={this.readonly}/>
        <div className="row align-center main-content-container">
          <div className="column content-column">
            { this.props.readonly ?
              <div>
                {this.props.match.params.date ?
                  <h3 className="section-heading text-center assess-date">
                    {moment(this.props.match.params.date).format('D MMM YYYY')}
                  </h3> : null
                }
                {this.renderAssessor()}
              </div>
              : ''
            }
            <h3 className="group-heading">Select your Assessment</h3>
            <div className="sports-filter">
              <Select choices={this.subCategoryChoices}
                      onSelected={this.setSport}
                      index={this.subCategoryChoices.findIndex(c => c == this.curSubcategory)}/>
            </div>
            <h3 className="group-heading text-right">
              Assessment Legend
              <span className="psr-icons icon-info" data-open="info-popup-technical-physical"></span>
            </h3>
            <form>
              {this.skillSets.map(skillSet => {
                                   if ('level14' == skillSet.setType) {
                                     return <PerfLevelSet levelSet={skillSet} 
                                                          readonly={this.props.readonly}/>
                                   } else {
                                     return <SkillSet key={skillSet.setName}
                                                      readonly={this.props.readonly}
                                                      skillSet={skillSet}
                                                      isImperial={false} />
                                   }
                                 })}
              {this.props.readonly ? null :
                <button type="submit" className="button theme float-right" onClick={this.onSave}>Save</button>
              }
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

export default inject('user', 'assDefs', 'assessments', 'refreshAssessment')(observer(TechnicalAss))
