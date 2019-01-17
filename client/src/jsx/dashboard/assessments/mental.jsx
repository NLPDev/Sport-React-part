import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../../components/util-bar'
import Api from '../../api'
import PerfLevelSet from '../components/level14-set'
import PerfLevel14 from '../components/performance-level'
import SkillSet from '../components/skill-set'
import DP from '../../utils/data-proc'
import SaveConfirmation from '../../components/save-confirmation'
import Select from '../../components/select'
import InfoPopupLeadership from '../components/info-popup-leadership'

class MentalAss extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curCategory: 'Social / Emotional',
                       withAss: false,
                       mentalDefs: computed(() => { return DP.getMentalDefs(this.props.assDefs,
                                                                            this.props.assessments,
                                                                            this.withAss,
                                                                            this.props.match.params.date) }),
                       mentalChoices: computed(() => this.mentalDefs.length ?
                                                       this.mentalDefs[0].childs.map(def => def.name) : []),
                       curDef: computed(() => { return this.mentalDefs && this.mentalDefs.length ?
                                                  this.mentalDefs[0].childs.find(a => a.name == this.curCategory) :
                                                  null }),
                       title: 'New Assessment',
                       isValidationErr: false,
                     });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    const catIndex = parseInt(this.props.match.params.catIndex);

    if (catIndex) {
      this.curCategory = 'Mental / Psychological';
    }

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    if(this.props.title) {
      this.title = this.props.title;
      if ('History' == this.title) {
        this.withAss = true;
      }
    }

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = (e) => {
    e.preventDefault();
    $('#save-confirmation').foundation('open');

    const newAss = this.curDef.childs.filter(s => s.modified);

    if (newAss && newAss.length) {
      this.isValidationErr = false;
      Api.newAssessments(newAss.map(s => ({ assessment_id: s.id,
                                            assessor_permission: "read_write",
                                            value: "" + s.level })),
                         this.props.match.params.aId || this.props.user.id)
        .then(result => {
          this.refs.saveConfirmation.showConfirmation();
          this.props.refreshAssessment();
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.isValidationErr = true;
      this.refs.saveConfirmation.showValidationError();
    }
  }

  onCancel = () => {
    if ('coach' == this.props.user.user_type) {
      this.props.history.push('/dashboard/directory/athlete-management/' + this.props.match.params.aId + '/leadership');
    } else {
      this.props.history.push('/dashboard/leadership');
    }
  }

  onClose = () => {
    if (this.isValidationErr) return;
    this.onCancel();
  }

  onUnitToggle = () => {

  }

  setCategory = category => {

    this.curCategory = category;
  }

  render() {

    return (
      <div ref="me">
        <UtilBar title={this.title} onCancel={this.onCancel} onSave={this.onSave} readonly={false}/>
        <div className="row align-center main-content-container">
          <div className="column content-column ">
            <h3 className="group-heading">Select your Assessment</h3>
            <div className="sports-filter">
              <Select choices={this.mentalChoices}
                      onSelected={this.setCategory}
                      index={this.mentalChoices.findIndex(c => c == this.curCategory)}/>
            </div>
            <h3 className="group-heading text-right">
              Assessment Legend
              <span className="psr-icons icon-info" data-open="info-popup-leadership"></span>
            </h3>
            <form>
              <legend className="skillset-heading">{this.curCategory}
                <span className="psr-icons icon-info" data-open="info-popup-leadership"></span>
              </legend>
              {/*this.curDef && this.curDef.childs ? this.curDef.childs.map(skillSet => <PerfLevelSet levelSet={skillSet} />) : null*/}
              {this.curDef ?
                <ul className="no-bullet">
                  {this.curDef.childs.map(skill => <PerfLevel14 skill={skill}
                                                                readonly={this.props.readonly} />)}
                </ul>: null}
              <button type="submit" className="button theme float-right" onClick={this.onSave}>Save</button>
            </form>
          </div>
        </div>

        <InfoPopupLeadership />
        <SaveConfirmation userType={this.props.user ? this.props.user.user_type : ""}
                          msg="New assessment has been created successfully."
                          validationMsg="Please make sure you have made an assessment to at least one item."
                          noAutoPopup={true}
                          onClose={this.onClose}
                          ref="saveConfirmation"/>
      </div>
    )
  }
}

export default inject('user', 'assDefs', 'assessments', 'refreshAssessment')(observer(MentalAss))
