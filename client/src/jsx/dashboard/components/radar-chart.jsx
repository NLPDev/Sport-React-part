import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import DummyPic from '../../../images/dummyPic.jpg'

class RadarChart extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curPartition: 0,
                       partitionSize: computed(() => {
                                        const numPartitions = Math.ceil(this.props.skills.length / 8);

                                        return Math.ceil(this.props.skills.length / numPartitions); }),
                       navs: computed(() => {
                               if (this.props.skills.length > 8) {
                                 const numPartitions = Math.ceil(this.props.skills.length / 8);
                                 const ret = ["Part A"];

                                 for (let i = 1; i < numPartitions; i++) {
                                  ret.push("Part " + String.fromCharCode("A".charCodeAt(0) + i));
                                 }
                                 return ret;
                               }
                               return []; }),
                       indexFirstAthleteAss: computed(() => {

                                               if (!(this.props.skills && this.props.skills.length)) return -1;

                                               for (let i = 0; i < this.props.skills[0].history.length; i++) {
                                                 const ass = this.props.skills[0].history[i];

                                                 if (ass.assessor_id == ass.assessed_id) {
                                                  return i;
                                                 }
                                               }
                                               return -1;
                                             }),
                       indexFirstCoachAss: computed(() => {

                                               if (!(this.props.skills && this.props.skills.length)) return -1;

                                               for (let i = 0; i < this.props.skills[0].history.length; i++) {
                                                 const ass = this.props.skills[0].history[i];

                                                 if (ass.assessor_id != ass.assessed_id) {
                                                  return i;
                                                 }
                                               }
                                               return -1;
                                             }),
                       skillsA: computed(() => {

                         if (this.indexFirstAthleteAss < 0) return [];

                         if (this.props.skills) {
                           let skillsPartition;

                           if (this.navs.length) {

                             skillsPartition = this.props.skills.slice(this.partitionSize * this.curPartition,
                                                                       this.partitionSize * (this.curPartition + 1));
                           } else {
                             skillsPartition = this.props.skills;
                           }
                           const skills = skillsPartition.map(skill => {
                                            const skillA = skill.history[this.indexFirstAthleteAss];

                                            return { level: skillA ? parseInt(skillA.value) : 0,
                                                     name: skill.name }
                                          })
                           return skills;
                         } else {
                            return [];
                         }
                       }),
                       skillsC: computed(() => {

                         if (this.indexFirstCoachAss < 0) return [];

                         if (this.props.skills) {
                           let skillsPartition;

                           if (this.navs.length) {

                             skillsPartition = this.props.skills.slice(this.partitionSize * this.curPartition,
                                                                       this.partitionSize * (this.curPartition + 1));
                           } else {
                             skillsPartition = this.props.skills;
                           }
                           const skills = skillsPartition.map(skill => {
                                            const skillA = skill.history[this.indexFirstCoachAss];

                                            return { level: skillA ? parseInt(skillA.value) : 0,
                                                     name: skill.name }
                                          });
                           return skills;
                         } else {
                            return [];
                         }
                       }),
                     });

    this.svgWidth = 480;
    this.svgHeight = 300;
    this.cx = this.svgWidth / 2;
    this.cy = 150;
    this.rp = 4;
    this.maxR =80;
  }

  componentDidMount() {

  }

  switchPartition = (e, i) => {

    $(e.target).siblings().removeClass('active');
    $(e.target).addClass('active');
    this.curPartition = i;
  }

  render() {

    return (
      <div className="card graph-card">
        <h4 className="group-title">{this.props.title}</h4>
        <p className="subheading">{this.props.subTitle}</p>
        <div className="info-wrap">
          <div className="psr-icons icon-info float-right"
               onClick={this.props.onInfoPopup}></div>
        </div>
        <div className="graph radar-chart">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox={"0 0 " + this.svgWidth + " " + this.svgHeight} >
          {[1, 2, 3, 4].map(r => <circle cx={this.cx}
                                         cy={this.cy}
                                         r={this.maxR * r / 4}
                                         key={r}
                                         className="grid-line" />)}

          {this.skillsA ?
            <polygon points={this.skillsA.reduce((acc, s, index, ss) => {
                              const step = ss.length  && (Math.PI * 2 / ss.length);
                              const xPt = this.cx + this.maxR * Math.cos(index * step) * s.level / 4;
                              const yPt = this.cy + this.maxR * Math.sin(index * step) * s.level / 4;

                              return acc + xPt + ',' + yPt + ' ';
                     }, '')}
                     className={"data-line polygon red"} /> : null }

          {this.skillsC ?
            <polygon points={this.skillsC.reduce((acc, s, index, ss) => {
                              const step = ss.length  && (Math.PI * 2 / ss.length);
                              const xPt = this.cx + this.maxR * Math.cos(index * step) * s.level / 4;
                              const yPt = this.cy + this.maxR * Math.sin(index * step) * s.level / 4;

                              return acc + xPt + ',' + yPt + ' ';
                     }, '')}
                     className={"data-line polygon blue"} /> : null }

          {this.skillsA.reduce((acc, s, index) => {

            const step = this.skillsA.length  && (Math.PI * 2 / this.skillsA.length);
            const xLabel = this.cx + (this.maxR + 10) * Math.cos(step * index);
            const yLabel = this.cy + (this.maxR + 10) * Math.sin(step * index);
            const anchor = xLabel > this.cx + 10 ? "start" : (xLabel < this.cx - 10 ? "end" : "middle");
            const alignment = yLabel < this.cy + this.maxR - 5 ? "baseline" :
                              (yLabel > this.cy - this.maxR + 5 ? "hanging" : "middle");
            const xPt = this.cx + this.maxR * Math.cos(index * step) * s.level / 4;
            const yPt = this.cy + this.maxR * Math.sin(index * step) * s.level / 4;
            acc.push(<line x1={this.cx}
                           y1={this.cy}
                           x2={this.cx + this.maxR * Math.cos(index * step)}
                           y2={this.cy + this.maxR * Math.sin(index * step)}
                           key={'line' + index}
                           className="grid-line"/>);
            acc.push(<text x={xLabel}
                           y={yLabel}
                           className="grid-label"
                           textAnchor={anchor}
                           alignmentBaseline={alignment}
                           key={s.name + index}>{s.name}</text>);
            acc.push(<circle cx={xPt}
                             cy={yPt}
                             r="4"
                             className={"dot red"}
                             key={'circle' + index} />);

            return acc;
          }, [])}

          {this.skillsC.reduce((acc, s, index) => {

            const step = this.skillsC.length  && (Math.PI * 2 / this.skillsC.length);
            const xPt = this.cx + this.maxR * Math.cos(index * step) * s.level / 4;
            const yPt = this.cy + this.maxR * Math.sin(index * step) * s.level / 4;
            if (!this.skillsA.length) {
              const anchor = xLabel > this.cx + 10 ? "start" : (xLabel < this.cx - 10 ? "end" : "middle");
              const xLabel = this.cx + (this.maxR + 10) * Math.cos(step * index);
              const yLabel = this.cy + (this.maxR + 10) * Math.sin(step * index);
              const alignment = yLabel < this.cy + this.maxR - 5 ? "baseline" :
                                (yLabel > this.cy - this.maxR + 5 ? "hanging" : "middle");
              acc.push(<line x1={this.cx}
                             y1={this.cy}
                             x2={this.cx + this.maxR * Math.cos(index * step)}
                             y2={this.cy + this.maxR * Math.sin(index * step)}
                             key={'line' + index}
                             className="grid-line"/>);
              acc.push(<text x={xLabel}
                             y={yLabel}
                             className="grid-label"
                             textAnchor={anchor}
                             alignmentBaseline={alignment}
                             key={s.name + index}>{s.name}</text>);
            }
            acc.push(<circle cx={xPt}
                             cy={yPt}
                             r="4"
                             className={"dot blue"}
                             key={'circle' + index} />);

            return acc;
          }, [])}

          {[1, 2, 3, 4].map(i => <text x={this.cx - 4}
                                       y={this.cy - this.maxR * i / 4}
                                       className="grid-num"
                                       key={i}>{i}</text>)}

          </svg>
          {this.navs.length ?
            <div className="pill-nav-container">
              <div className="pill-nav">
                {this.navs.map((s, i) => <div className={"nav-item " + (0 == i ? "active" : "")}
                                             onClick={e => this.switchPartition(e, i)}
                                             key={i}>{s}</div>)}
              </div>
            </div>
            : null
          }
          <div className="graph-legend">
            <div className="legend-item">
              <span className="dot red"></span>
              <span className="legend-title">Self Assessment</span>
            </div>
            <div className="legend-item">
              <span className="dot blue"></span>
              <span className="legend-title">Coach Assessment</span>
            </div>
          </div>

        </div>

      </div>
    )
  }
}

export default observer(RadarChart)
