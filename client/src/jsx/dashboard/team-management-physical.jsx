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
                     { team: computed(() => this.props.team),
                       phyiscalDefs: computed(() => { return DP.getPhysicalDefs(this.props.assDefs); }),
                       categorieNames: computed(() => { return this.phyiscalDefs.map(def => def.name); }),
                       curAssessments: [],
                       curAssessmentsNames: [],
                       curCategory: null,
                       curCategoryName: '',
                       curAssessment: null,
                       curAssessmentName: '',
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

    if (this.props.assDefs) {

      this.initializeChoices();
    } else {
      const disposer = observe(this,
                               'phyiscalDefs',
                               change => {

                                 if (change.newValue && change.newValue.length) {
                                   this.initializeChoices();
                                   disposer();
                                 }
                               });
    }
  }

  initializeChoices = () => {

    this.onCategory(this.phyiscalDefs[0].name);
  }

  onCategory = (cat) => {
    this.curCategoryName = cat;
    this.curCategory = this.phyiscalDefs.find(def => def.name == cat);
    if (this.curCategory.is_flat) {

      this.curAssessments = this.curCategory.childs.map(ass =>({ name: ass.name,
                                                                 ass }));
    } else {

      this.curAssessments = this.curCategory.childs.reduce((acc, group) => {

                              acc = acc.concat(group.childs.map(ass => ({
                                      name: `${group.name} - ${ass.name}`,
                                      ass
                                    })));
                              return acc;
                            }, []);
    }
    this.curAssessmentsNames = this.curAssessments.map(a => a.name);
    this.onAssessment(this.curAssessmentsNames[0]);
  }

  onAssessment = (assName) => {

    this.curAssessmentName = assName;
    this.curAssessment = this.curAssessments.find(a => a.name == assName);
    
    Api.getTeamAssessments(this.props.match.params.t_id, this.curAssessment.ass.id)
      .then(assessments => {
        this.assValues = assessments;
      })
      .catch(err => { console.log(err); });
  }

  changeFilter = (type) => {
    this.curType = type;
  }

  linkFunc = (ent) => {

    return `/dashboard/directory/team-management/${this.team && this.team.id}/physical/new-assessment/${ent.id}/${this.curCategory && this.curCategory.id}`;
  }

  render() {

    return (
      <div className="team-management-content">
        <div className="sports-filter">
          <Select choices={this.categorieNames}
            onSelected={this.onCategory}
            index={this.categorieNames.findIndex(c => c == this.curCategoryName)}/>
        </div>
        <div className="sports-filter">
          <Select choices={this.curAssessmentsNames}
            onSelected={this.onAssessment}
            index={this.curAssessmentsNames.findIndex(c => c == this.curAssessmentName)}/>
        </div>

        <h3 className="group-heading">{this.curAssLabel}</h3>

        <TeamAssessForm readOnly={true}
                        assValues={this.assValues}
                        assessmentDef={this.curAssessment && this.curAssessment.ass}
                        linkFunc={this.linkFunc}/>

      </div>

    )
  }
}))
