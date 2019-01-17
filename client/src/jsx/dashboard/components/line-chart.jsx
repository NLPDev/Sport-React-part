import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed, observable, observe} from 'mobx'
import {observer} from 'mobx-react'

import Select from '../../components/select'


// props:
//  for single line chart:
//  histories: [{ name: cccc,
//                values: [{ date_assessed: cccccccc,
//                           value: [[1|2|3|4] | xxxx.yyy] }] }]
//  for multiple lines chart:
//  groups: [{ groupName: cccc,
//             histories: [{ name: cccc,
//                           values: [{ date_assessed: cccccccc,
//                                      value: [[1|2|3|4] | xxxx.yyy]
//                                    }]
//                         },
//                         { name: cccc,
//                           values: [{ date_assessed: cccccccc,
//                                      value: [[1|2|3|4] | xxxx.yyy]
//                                    }]
//                         },
//                         { name: cccc,
//                           values: [{ date_assessed: cccccccc,
//                                      value: [[1|2|3|4] | xxxx.yyy]
//                                    }]
//                         }]
//           }]
//

class LineChart extends Component {

  constructor() {
    super();
    extendObservable(this,
                     { curHistory: '',
                       curHistoryIndex: computed(() => {
                                          return this.historyChoices.findIndex(c => c == this.curHistory) }),
                       historyChoices: computed(() => {
                                         if (this.props.singleLine) {
                                           return this.props.histories.map(h => h.name);
                                         } else {
                                            return [];
                                         } }),
                       curGroupIndex: 0,
                       curGroup: computed(() => this.props.groups && this.props.groups[this.curGroupIndex]),
                       curUnit: computed(() => {
                                  if (this.props.singleLine) {
                                    if (this.props.histories.length) {
                                      return this.props.unit; // this.props.histories[0].values[0].level ? 'stars' : 'value';
                                    }
                                  } else {
                                    return 'stars';
                                  }
                                  return 'stars'; }),
                       maxGroupValue: computed(() => {
                                        if (this.props.singleLine) {
                                          if (!this.props.histories.length || this.curHistoryIndex < 0) return 0;

                                          const history = this.props.histories[this.curHistoryIndex];

                                          const max = history.values.reduce((acc, curValue) => Math.max(acc, parseFloat(curValue.value)),
                                                                            parseFloat(history.values[0].value));
                                          return Math.ceil(max);
                                        } else {
                                          if (!this.curGroup) return 0;

                                          const max = this.curGroup.histories.reduce((acc, history) => {

                                            const maxValue = history.values.reduce((acc, curValue) => Math.max(acc, parseFloat(curValue.value)),
                                                                                   parseFloat(history.values[0].value));
                                            return Math.max(acc, maxValue);
                                          }, 0);
                                          return Math.ceil(max);
                                        }
                                      }),
                       minGroupValue: computed(() => {
                                        if (this.props.singleLine) {
                                          if (!this.props.histories.length || this.curHistoryIndex < 0) return 0;
                                          const history = this.props.histories[this.curHistoryIndex];

                                          if (history.values.length > 1) {
                                            const min = history.values.reduce((acc, curValue) => Math.min(acc, parseFloat(curValue.value)),
                                                                         parseFloat(history.values[0].value));
                                            return Math.floor(min);
                                          } else {
                                            return 0;
                                          }
                                        } else {
                                          if (!this.curGroup) return 0;

                                          const min = this.curGroup.histories.reduce((acc, history) => {

                                            const minValue = history.values.reduce((acc, curValue) => Math.min(acc, parseFloat(curValue.value)),
                                                                                   parseFloat(history.values[0].value));
                                            return Math.min(acc, minValue);
                                          }, 999999);
                                          return Math.floor(min);
                                        }
                                      })
                     });

    this.xLabelH = 0.15;
    this.yCoords = [3, 2, 1, 0].map(i => Math.round((1 - this.xLabelH) / 3.15 * (i + 0.15) * 100));
  }

  componentDidMount(){

    this.disposer = observe(this, 'historyChoices', change => {
      console.log(change);
      this.curHistory = change.newValue[0] });
  }

  componentWillUnmount() {

    this.disposer();
  }

  pointsFromHistory = history => {

    if (history.length > 1) {
      const startT = new Date(history[0].date_assessed).getTime();
      const endT = new Date(history[history.length - 1].date_assessed).getTime();
      const timeSpan =  endT - startT;
      return history.map(p => {
        return {x: 0 == timeSpan ? 0 : (new Date(p.date_assessed).getTime() - startT) / timeSpan * 100,
                y: 'stars' == this.curUnit ?
                     this.yCoords[parseInt(p.value) - 1] :
                     (this.maxGroupValue - parseFloat(p.value))/(this.maxGroupValue - this.minGroupValue) * 82 + 3 }});
    } else {
      return [{x: 50,
               y: 'stars' == this.curUnit ?
                    this.yCoords[parseInt(history[0].value) - 1] :
                    (this.maxGroupValue - parseFloat(history[0].value))/(this.maxGroupValue - this.minGroupValue) * 82 + 3}];
    }
  }

  outputLine(x1, y1, x2, y2, className, key, colorIndex) {
    const opacity = 1 - colorIndex * 0.35;
    return <line x1={x1} y1={y1} x2={x2} y2={y2}
                 className={className}
                 vectorEffect="non-scaling-stroke"
                 key={'line_d_' + key}
                 style={{strokeOpacity: opacity}}/>
  }

  outputSharpLine(x1, y1, x2, y2, className, key) {
    return <line x1={x1} y1={y1} x2={x2} y2={y2}
                 className={className}
                 shapeRendering="crispEdges"
                 vectorEffect="non-scaling-stroke"
                 key={'sl_' + key}/>
  }

  outputGridLines() {
    return this.yCoords.map((y, i) => this.outputSharpLine(0, y + "%" , "100%", y + "%", 'grid-line', i))
  }

  outputDataLines(points, colorIndex) {

    if (points.length < 2) return null;

    const lines = [];
    for (let i = 1; i < points.length; i++ ) {
      const {x: x1, y: y1} = points[i - 1];
      const {x: x2, y: y2} = points[i];
      lines.push(this.outputLine(x1 + "%", y1 + "%", x2 + "%", y2 + "%", 'data-line', i, colorIndex));
    }

    return lines;
  }

  outputPolygon(points) {

    if (points.length < 2) return null;

    const startPt = [{x: 0, y: Math.round((1-this.xLabelH) *100)}];
    const endPt = [{x: 100, y: Math.round((1-this.xLabelH) *100)}];
    const ptsStr = startPt.concat(points)
                     .concat(endPt)
                     .map(p => (p.x + "," + p.y))
                     .join(' ');  // "0,85 0,57 8,57 36,28 44,57 100,0 100,85"

    return (
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" key="polygon">
        <polygon points={ptsStr} className="polygon"/>
      </svg>
    )
  }

  outputDot(x, y, key, colorIndex) {
    const opacity = 1 - colorIndex * 0.35;
    return <circle cx={x} cy={y} r="4"
                   className="dot"
                   key={'dot_' + key}
                   style={{strokeOpacity: opacity}}/>
  }

  outputDots(points, colorIndex) {

    if (points.length < 2) return this.outputDot('50%', points[0].y + '%', 0, colorIndex);

    const dots = [];
    for (let i = 1; i < points.length - 1; i++ ) {
      const {x, y} = points[i];
      dots.push(this.outputDot(x + "%", y + "%", i, colorIndex));
    }
    return dots;
  }

  drawSingleHistory = (history, colorIndex) => {

    if (!history.values.length) return null;

    const points = this.pointsFromHistory(history.values);
    return (
      <g key={'h_' + colorIndex}>
        {this.outputDataLines(points, colorIndex)}
        {this.outputPolygon(points)}
        {this.outputDots(points, colorIndex)}
      </g>
    )
  }

  getDateStr(date) {
    const month = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', "AUG", 'SEP', 'OCT', 'NOV', 'DEC'];
    const d = new Date(date);

    return month[d.getMonth()] + " " + d.getDate();
  }

  outputXLabels() {

    const histories = this.props.singleLine ? this.props.histories : (this.curGroup && this.curGroup.histories);

    if (!histories || !histories.length || !histories[0].values.length) return null;

    const values = 1 == histories[0].values.length ?
                     histories[0].values :
                     [histories[0].values[0], histories[0].values[histories[0].values.length - 1]];

    const points = this.pointsFromHistory(values);

    return (
      <g>
        {values.map((ass, i) => {
          return <text x={points[i].x + "%"} y="97%"
                       textAnchor={0 == i ? 'start' : 'end'}
                       alignmentBaseline="text-after-edge"
                       key={i}>{this.getDateStr(ass.date_assessed)}</text>
        })}
        <text x="100%" y="92%" textAnchor="end" alignmentBaseline="after-edge" className="trangle">▴</text>
      </g>
    )
  }

  switchAss = (e, i) => {

    $(e.target).siblings().removeClass('active');
    $(e.target).addClass('active');
    this.curGroupIndex = i;
    if (this.props.switchAss) {
      this.props.switchAss(i);
    }
  }

  renderLines = () => {

    if (this.props.singleLine) {

      if (this.props.histories.length && this.curHistoryIndex >= 0) {
        return this.drawSingleHistory(this.props.histories[this.curHistoryIndex]);
      }
    } else {
      return this.curGroup && this.curGroup.histories.map(this.drawSingleHistory);
    }
  }

  obtainMaxMin = () => {

    if (this.props.singleLine) {
      if (!this.props.histories.length) return;

      const history = this.props.histories[this.curHistoryIndex];

      this.maxGroupValue = history.values.reduce((acc, curValue) => Math.max(acc, parseFloat(curValue.value)),
                                                 parseFloat(history.values[0].value));
      if (history.values.length > 1) {
        this.minGroupValue = history.values.reduce((acc, curValue) => Math.min(acc, parseFloat(curValue.value)),
                                                   parseFloat(history.values[0].value));
      } else {
        this.minGroupValue = 0;
      }
    } else {
      if (!this.curGroup) return;

      this.maxGroupValue = this.curGroup.histories.reduce((acc, history) => {

        const maxValue = history.values.reduce((acc, curValue) => Math.max(acc, parseFloat(curValue.value)),
                                               parseFloat(history.values[0].value));
        return Math.max(acc, maxValue);
      }, 0);

      this.minGroupValue = this.curGroup.histories.reduce((acc, history) => {

        const minValue = history.values.reduce((acc, curValue) => Math.min(acc, parseFloat(curValue.value)),
                                               parseFloat(history.values[0].value));
        return Math.min(acc, minValue);
      }, 999999);
    }
  }

  setSport = historyName => {

    this.curHistory = historyName;
  }

  render() {
    //this.obtainMaxMin();

    return (
      <div className={"card graph-card " + (this.props.color ? this.props.color : '')}>
        <h4 className="group-title">{this.props.title}</h4>
        <p className="subheading">{this.props.subTitle}</p>

        {this.props.singleLine && this.props.histories.length > 1 ?
          <div className="sports-filter">
            <Select choices={this.historyChoices}
                    onSelected={this.setSport}
                    index={this.curHistoryIndex}
                    ref="selSubCats"/>
          </div> : null }
        <div className="info-wrap">
          <div className="psr-icons icon-info float-right"
               onClick={this.props.onInfoPopup}>
          </div>
        </div>

        <div className="graph line-chart">
          <div className="y-label">
            <div>{'stars' == this.curUnit ? 4 : this.maxGroupValue}</div>
            <div>{'stars' == this.curUnit ? 3 : ''}</div>
            <div>{'stars' == this.curUnit ? 2 : ''}</div>
            <div>{'stars' == this.curUnit ? 1 : this.minGroupValue}</div>
          </div>
          <div className="graph-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" >
              {this.outputGridLines()}

              {this.renderLines()}

              {this.outputXLabels()}
            </svg>
          </div>
        </div>

        {!this.props.singleLine && this.curGroup ?
          <div className="graph-legend">
            {this.curGroup.histories.map((history, i) =>
              <div className="legend-item" key={i}>
                <span className={"dot " + (0 == i ? "" : (1 == i ? "medium" : "light"))}></span>
                <span className="legend-title">{history.name}</span>
              </div>)}
          </div> : null }
        {!this.props.singleLine ?
          <div className="pill-nav-container">
            <div className="pill-nav">
              {this.props.groups.map((group, i) => <div className={"nav-item " + (0 == i ? "active" : "")}
                                                       onClick={(e) => { this.switchAss(e, i); }}
                                                       key={i}>{group.groupName}</div>)}
            </div>
          </div> : null}
      </div>
    )
  }
}

export default observer(LineChart)
