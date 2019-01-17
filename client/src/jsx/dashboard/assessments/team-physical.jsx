import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../../components/util-bar'
import Api from '../../api'
import PerfLevel14 from '../components/performance-level'
import SkillSet from '../components/skill-set'
import Select from '../../components/select'
import SaveConfirmation from '../../components/save-confirmation'
import InfoPopupTechnicalPhysical from '../components/info-popup-technical-physical'
import DP from '../../utils/data-proc'

class PhysicalAss extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { 
                       user: computed(() => this.props.user),
                       physicalDefs: computed(() => { return DP.getPhysicalDefs(this.props.assDefs,
                                                                                null,
                                                                                false) }),
                       physicalChoices: computed(() => {
                                          return this.physicalDefs.map(def => def.name) }),
                       curDef: computed(() => { return this.physicalDefs.find(a => a.name == this.curCategory) }),
                       curAssCompType: 'flat14',
                       curCategory: 'Fundamental Movement Skills',
                       skills: [],
                       title: 'New Assessment',
                       readonly: false,
                       isImperial: true,
                       isValidationErr: false,
                       isApiErr: false
                     });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    if(this.props.title) {
      this.title = this.props.title;
    }

    if(this.props.readonly) {
      this.readonly = this.props.readonly;
    }
    if (this.physicalDefs.length) {

      this.setCategory(this.physicalDefs.find(a => a.id == this.props.match.params.ass_id).name);
    } else {
      const disposer = observe(this,
                               'physicalDefs',
                               change => {
                                 if (change.newValue.length) {
                                   this.setCategory(this.physicalDefs.find(a => a.id == this.props.match.params.ass_id).name);
                                   disposer();
                                 }
                               })
    }
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = (e) => {
    e.preventDefault();
    $('#save-confirmation').foundation('open');

    switch (this.curAssCompType) {
      case 'flat14':
        const newAss = this.curDef.childs.filter(s => s.modified);

        if (newAss && newAss.length) {
          this.isValidationErr = false;
          Api.newTeamAssessments(newAss.map(s => ({ assessment_id: s.id,
                                                   assessed_id: this.props.match.params.a_id,
                                                   value: "" + s.level })),
                                 this.props.match.params.t_id)
            .then(result => {
              this.isApiErr = false;
              this.refs.saveConfirmation.showConfirmation();
            })
            .catch(err => {
              if (400 == err.status) {
                const errObj = JSON.parse(err.responseText);

                if (errObj.rejected) {
                  console.log(errObj.rejected);
                }
              }
            });
        } else {
          this.isValidationErr = true;
          this.refs.saveConfirmation.showValidationError();
        }
        break;
      case 'values':
        const newAssV = this.curDef.childs.reduce((acc, def) => {

                            acc = acc.concat(def.childs.slice());
                            return acc;
                          }, [])
                          .filter(ass => ass.modified);

        if (newAssV && newAssV.length) {
          this.isValidationErr = false;
          Api.newTeamAssessments(newAssV.map(s => {

              let value = 'stars' == s.unit ? s.level : parseFloat(s.value);

              switch (s.unit) {
                case 'cm':
                  value *= this.isImperial ? 30.48 : 100;
                  value = value.toFixed(2);
                  break;
                case 'kg':
                  value *= this.isImperial ? 0.453592 : 1;
                  value = value.toFixed(2);
                  break;
              }
              return { assessment_id: s.id,
                       assessed_id: this.props.match.params.a_id,
                       value: "" + value } }), this.props.match.params.t_id)
            .then(result => {
              this.isApiErr = false;
              this.refs.saveConfirmation.showConfirmation();
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
                  this.refs.saveConfirmation.showApiError();

                }
              }
            });
        } else {
          this.isValidationErr = true;
          this.refs.saveConfirmation.showValidationError();
        }
        break;
    }

  }

  onCancel = () => {

    this.props.history.push(`/dashboard/directory/team-management/${this.props.match.params.t_id}/physical`);
  }

  onClose = () => {
    if(this.isValidationErr || this.isApiErr) return;
    this.onCancel();
  }

  onUnitToggle = ev => {

    if (ev.target.checked) {
      this.isImperial = false;
    } else {
      this.isImperial = true;
    }
  }

  setCategory = (category) =>{

    this.curCategory = category;

    switch (category) {
      case 'Fundamental Movement Skills':
        this.curAssCompType = 'flat14';
        break;
      default:
        this.curAssCompType = 'values';
        break;
    }
    history.replaceState(null, "", `/dashboard/directory/team-management/${this.props.match.params.t_id}/physical/new-assessment/${this.props.match.params.a_id}/${this.curDef.id}`);
  }

  renderAssComp = () => {

    if (!this.curDef) return null;

    switch (this.curAssCompType) {
      case 'flat14':
        return <ul className="no-bullet">
                {this.curDef.childs.map(skill => <PerfLevel14 key={skill.name}
                                                                    readonly={false}
                                                                    skill={skill} />)}
              </ul>;
        break;
      case 'values':
        return this.curDef.childs.map(skill => <SkillSet key={skill.name}
                                                         readonly={this.props.readonly}
                                                         skillSet={skill}
                                                         isImperial={this.isImperial} />)

        break;
    }
  }

  render() {

    return (
      <div ref="me">
        <UtilBar title={this.title} onCancel={this.onCancel} onSave={this.onSave} readonly={this.readonly}/>
        <div className="row align-center main-content-container">
          <div className="column content-column ">
            <form>
              <h2 className="section-heading text-center">Physical Skills</h2>
              { this.physicalDefs && 'Fundamental Movement Skills' != this.curCategory ?
                <div className=" unit-switch-container">
                  <div className="switch">
                    <input id="unit-switch"
                           className="switch-input" type="checkbox"
                           name="unit-switch"
                           checked={this.user.measuring_system == 'imperial' ? '' : 'checked'}
                           onChange={this.onUnitToggle}/>
                    <label className="switch-paddle" htmlFor="unit-switch">
                      <span className="show-for-sr"></span>
                      <span className="switch-active" aria-hidden="true">lb/in</span>
                      <span className="switch-inactive" aria-hidden="true">kg/cm</span>
                    </label>
                  </div>
                </div> : null }
              <h3 className="group-heading">Select your Assessment</h3>
              <div className="sports-filter">
                <Select choices={this.physicalChoices}
                        onSelected={this.setCategory}
                        index={this.physicalChoices.findIndex(c => c == this.curCategory)}/>
              </div>
              <h3 className="group-heading text-right">
                Assessment Legend
                <span className="psr-icons icon-info" data-open="info-popup-technical-physical"></span>
              </h3>
              {this.renderAssComp()}
              <button type="submit" className="button theme float-right" onClick={this.onSave}>Save</button>
            </form>
          </div>
        </div>

        <InfoPopupTechnicalPhysical />
        <SaveConfirmation userType={this.props.user ? this.props.user.user_type : ""}
          msg="New assessment has been created successfully."
          validationMsg="Please make sure you have made an assessment to at least one item."
          apiMsg="The format of some fields are not correct, please enter in valid form and submit again."
          noAutoPopup={true}
          onClose={this.onClose}
          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'assDefs')(observer(PhysicalAss))
