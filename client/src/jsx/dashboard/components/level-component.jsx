import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer} from 'mobx-react'



class Performance14 extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { orgLevel: computed(() => this.props.skill.level),
                       clPerfLevel1: "perf-level-unreached",
                       clPerfLevel2: "perf-level-unreached",
                       clPerfLevel3: "perf-level-unreached",
                       clPerfLevel4: "perf-level-unreached" });
  }

  componentDidMount() {

    if (this.orgLevel) {

      this.setLevel(this.props.skill.level);
    } else {

      observe(this,
              'orgLevel',
              change => {
                if (change.newValue) {

                  this.setLevel(this.orgLevel);
                }
              });
    }
  }

  updateLevel = level => {

    if (this.props.readOnly) return;

    this.setLevel(level);
  }

  setLevel = level => {

    this.props.skill.level = level;
    if (level != this.orgLevel) {
      this.props.skill.modified = true;
    } else {
      this.props.skill.modified = false;
    }
    for (var i = 1; i <= level; i++) {
      this["clPerfLevel" + i] = "perf-level" + i;
    }
    for (i = level + 1; i < 5; i++) {
      this["clPerfLevel" + i] = "perf-level-unreached";
    }
  }

  render() {

    return (
      <div className={"perf-wrap" + (this.props.readOnly ? " readonly" : "")}>
        <span className={"perf-level " + this.clPerfLevel1} onClick={() => this.updateLevel(1)}></span>
        <span className={"perf-level " + this.clPerfLevel2} onClick={() => this.updateLevel(2)}></span>
        <span className={"perf-level " + this.clPerfLevel3} onClick={() => this.updateLevel(3)}></span>
        <span className={"perf-level " + this.clPerfLevel4} onClick={() => this.updateLevel(4)}></span>
      </div>
    )
  }
}

export default observer(Performance14)
