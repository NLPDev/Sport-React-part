import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'


class PreCompeteLevel extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { spanClasses: ['perf-level-unreached',
                                     'perf-level-unreached',
                                     'perf-level-unreached',
                                     'perf-level-unreached'],
                       curActive: -1,
                       levelOrg: computed(() => this.props.level) });
  }

  componentDidMount() {

    if (this.props.level && this.props.level > 0) {
      this.updateLevel(this.props.level);
    } else {
      const disposer = observe(this,
                               'levelOrg',
                               change => {
                                 if (change.newValue) {
                                   this.updateLevel(change.newValue);
                                   disposer();
                                 }
                               });
    }
  }

  setLevel = (level) => {

    if (!this.props.setLevel || level - 1 == this.curActive) return;

    this.updateLevel(level);

    this.props.setLevel(level);
  }

  updateLevel = (level) => {

    if (this.curActive >= 0) {
      this.spanClasses[this.curActive] = 'perf-level-unreached';
    }
    this.curActive = level - 1;
    this.spanClasses[this.curActive] = 'perf-level' + level;
  }

  render() {

    return <li className="row rating-row">
              <div className="small-6 column">{this.props.title}</div>
              <div className="small-6 column text-right">
                <div className={"perf-wrap with-letter " +
                                ('Hydration' == this.props.title ? '' : 'reversed') +
                                (this.props.readOnly ? " readonly" : "")}>
                  <span className={`perf-level ${this.spanClasses[0]}`}
                        onClick={this.props.readOnly ? null : () => { this.setLevel(1); }}></span>
                  <span className={`perf-level ${this.spanClasses[1]}`}
                        onClick={this.props.readOnly ? null : () => { this.setLevel(2); }}></span>
                  <span className={`perf-level ${this.spanClasses[2]}`}
                        onClick={this.props.readOnly ? null : () => { this.setLevel(3); }}></span>
                  <span className={`perf-level ${this.spanClasses[3]}`}
                        onClick={this.props.readOnly ? null : () => { this.setLevel(4); }}></span>
                </div>
              </div>
            </li>
  }
}

export default observer(PreCompeteLevel)
