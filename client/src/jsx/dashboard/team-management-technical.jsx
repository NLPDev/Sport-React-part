import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import Select from '../components/select'
import DP from '../utils/data-proc'
import TeamAssessForm from './components/team-assess-form'
import UnitLabel from '../misc/unit-label'

export default inject('user', 'assDefs', 'team')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curSubsportName: '',
                       curSubsport: null,
                       subsports: computed(() => { return this.subsportsFromDefs() }),
                       subsportChoices: computed(() => { return this.subsports.map(ss => ss.name); }),
                       curAssessments: computed(() => { return this.getCurAssessments(); }),
                       assessmentChoices: computed(() => { return this.curAssessments.map(a => a.name); }),
                       curAssessment: null,
                       curAssessmentName: '',
                       curAssessmentIndex: 0,
                       assValues: [],
                       curAssLabel: computed(() => {
                                      if (!this.curAssessment) {
                                        return this.curAssessmentName;
                                      } else {
                                        return `${this.curAssessmentName} - ${UnitLabel[this.curAssessment.ass.unit]}`;
                                      }
                                    })
                     });
  }

  componentDidMount() {

    if (this.props.assDefs && this.props.team) {

      this.initializeChoices();
    } else {
      const disposer = observe(this,
                               'subsportChoices',
                               change => {
                                 if (change.newValue.length) {
                                   this.initializeChoices();
                                   disposer();
                                 }
                               });
    }
  }

  initializeChoices = () => {

    this.curSubsport = this.subsports[0];
    this.curSubsportName = this.curSubsport.name;
    this.curAssessment = this.curAssessments[0];
    this.curAssessmentName = this.curAssessment.name;
    this.curAssessmentIndex = 0;

    this.retrieveAssessments();
  }

  subsportsFromDefs = () => {

    if (!this.props.assDefs || !this.props.team) return [];

    return this.props.assDefs.find(assDef => assDef.id == this.props.team.sport_id).childs;
  }

  getCurAssessments = () => {

    if (!this.curSubsport) return [];

    return this.curSubsport.childs.reduce((acc, ass) => {

             if (ass.is_flat || undefined === ass.is_flat) {
               acc.push({ name: ass.name,
                          ass: ass });
             } else {
               const leafs = ass.childs.map(a => ({ name: `${ass.name} - ${a.name}`,
                                                    ass: a}));

               acc = acc.concat(leafs);
             }
             return acc;
           }, []);
  }

  onSubsport = (subsport) => {

    this.curSubsportName = subsport;
    this.curSubsport = this.subsports.find(s => s.name == subsport);

    this.onAssessmentType(this.assessmentChoices[0]);
  }

  onAssessmentType = assType => {

    this.curAssessmentName = assType;
    this.curAssessmentIndex = this.assessmentChoices.findIndex(a => a == assType);
    this.curAssessment = this.curAssessments[this.curAssessmentIndex];

    this.retrieveAssessments();
  }

  retrieveAssessments = () => {

    Api.getTeamAssessments(this.props.match.params.t_id, this.curAssessment.ass.id)
      .then(assessments => {
        this.assValues = assessments;
      })
      .catch(err => { console.log(err); });
  }

  linkFunc = (ent) => {

    return `/dashboard/directory/team-management/${this.props.team && this.props.team.id}/technical-tactical/new-assessment/${ent.id}/${this.curSubsport && this.curSubsport.id}`;
  }

  render() {

    return (
      <div className="team-management-content">
        <div className="sports-filter">
          <Select choices={this.subsportChoices}
                  onSelected={this.onSubsport}
                  index={this.subsportChoices.findIndex(c => c == this.curSubsportName)}/>
        </div>
        <div className="sports-filter">
          <Select choices={this.assessmentChoices}
                  onSelected={this.onAssessmentType}
                  index={this.curAssessmentIndex}/>
        </div>

        <h3 className="group-heading">{this.curAssLabel}</h3>

        <TeamAssessForm readOnly={true}
                        assValues={this.assValues}
                        linkFunc={this.linkFunc}
                        assessmentDef={this.curAssessment && this.curAssessment.ass}/>

      </div>

    )
  }
}))
