import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../../api'
import BarChart from './bar-chart'
import RadarChart from './radar-chart'
import LineChart from './line-chart'
import Select from '../../components/select'
import DP from '../../utils/data-proc'

export default inject('user', 'assDefs', 'assessments')(observer(class extends Component {

  constructor(props) {

    super(props);
    extendObservable(this,
                     { physicalDefs: computed(() => { return DP.getPhysicalDefs(this.props.assDefs,
                                                                                this.props.assessments,
                                                                                true) }),
                       physicalChoices: computed(() => { return this.physicalDefs.map(ss => ss.name); }),
                       curCategory: '',
                       curCategoryIndex: computed(() => {
                                           return this.physicalChoices.findIndex(c => c == this.curCategory); }),
                       curCategoryId: computed(() => {
                                        if (!this.physicalDefs.length || !this.curCategory) return 0;
                                        return this.physicalDefs.find(def => def.name == this.curCategory).id;
                                      }),
                       curSubCatPhysical: 0,
                       curHistories: computed(() => { return DP.getHistory(this.physicalDefs,
                                                                           this.curCategoryIndex,
                                                                           this.curSubCatPhysical); }),
                     });
  }

  componentDidMount() {

    if (this.physicalDefs.length) {
      this.curCategory = this.physicalDefs[0].name;
    } else {
      const disposer = observe(this,
                               'physicalDefs',
                               change => {
                                 if (change.newValue.length) {
                                   this.curCategory = this.physicalDefs[0].name;
                                   disposer();
                                 }
                               });
    }
  }

  setCategory = cat => {

    this.curCategory = cat;
    this.setSubCatPhysical(null, 0);
  }

  setSubCatPhysical = (ev, subCat) => {

    if (ev) {
      $(ev.target).siblings().removeClass('active');
      $(ev.target).addClass('active');
    } else {
      $('.pill-nav.physical-cat').children().removeClass('active');
      $('.pill-nav.physical-cat').children().first().addClass('active');
    }
    this.curSubCatPhysical = subCat;
  }

  newAssUrl = () => {

    if (this.props.match.params.t_id) {

      return `/dashboard/directory/team-management/${this.props.match.params.t_id}/physical/new-assessment/${this.props.match.params.a_id}/${this.curCategoryId}`
    } else {

      return `/dashboard/physical/new-assessment/${this.curCategoryId}/${this.props.match.params.a_id}`;
    }
  }

  render() {

    return (
      <div className="" ref="physical">
        <div className="group-section">
          <div className="group-heading-wrap">
            <h3 className="group-heading">Create a New Assessment</h3>
            <div className="button-group">
              {/*<button className="button border responsive" ref="calendar">
                <span className="psr-icons icon-calender"></span>
                <span className="show-for-large"> History</span>
              </button>*/}
              <Link to={this.newAssUrl()} className="button border responsive add">
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
            <div className="pill-nav physical-cat">
              {this.physicalDefs.length && this.curCategoryIndex >= 0 ?
                this.physicalDefs[this.curCategoryIndex].childs.map((def, i) =>
                  <div className={"nav-item " + (0 == i ? "active" : "")}
                      key={i}
                      onClick={ev => { this.setSubCatPhysical(ev, i) }}>{def.name}</div>) :
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
                     histories={this.curHistories.histories}
                     ref='history'/>
        </div>
      </div>
    )
  }
}));
