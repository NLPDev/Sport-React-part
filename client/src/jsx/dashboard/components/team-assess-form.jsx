import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../../components/util-bar'
import Api from '../../api'
import PerfLevelSet from '../components/level14-set'
import AthletePerfLevel14 from '../components/athlete-performance-level'
import SkillSet from '../components/skill-set'
import DP from '../../utils/data-proc'
import AvatarRed from '../../../images/avatar-red.png'
import Select from '../../components/select'
import SaveConfirmation from '../../components/save-confirmation'
import InfoPopupTechnicalPhysical from '../components/info-popup-technical-physical'
import EntitySectionAss from './entity-section-ass'

class TeamTechnicalAss extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { sections: computed(() => {

                         if (!this.props.team) return [];

                         return this.props.team.athletes.reduce((acc, a) => {
                                  if (!acc.find(letter => letter == a.first_name[0].toUpperCase())) {
                                    acc.push(a.first_name[0].toUpperCase());
                                  }
                                  return acc;
                                }, [])
                                .sort((a, b) => a > b)
                                .map(letter => {
                                  const entities = this.props.team.athletes
                                                     .filter(e => e.first_name[0].toUpperCase() == letter)
                                                     .map(e => {
                                                       const value = this.props.assValues.find(v => v.assessed.id == e.id);

                                                       if (value && !isNaN(parseFloat(value.value))) {
                                                         e.value = parseFloat(value.value);
                                                       } else {
                                                         e.value = '';
                                                       }
                                                       return e;
                                                     });

                                  return { letter, entities }
                                }); }) });
  }

  componentWillMount() {

    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();
  }

  render() {

    return (
      <form>
        {this.sections.map(section => <EntitySectionAss {...section}
                                                        assessmentDef={this.props.assessmentDef}
                                                        linkFunc={this.props.linkFunc}
                                                        key={section.letter} />)}
      </form>
    )
  }
}

export default inject('user', 'assDefs', 'team')(observer(TeamTechnicalAss))
