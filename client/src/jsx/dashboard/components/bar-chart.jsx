import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import DummyPic from '../../../images/dummyPic.jpg'

class BarChart extends Component {

  render() {

    return (
      <div className="card graph-card">
        <h4 className="group-title">{this.props.title}</h4>
        <p className="subheading">{this.props.subTitle}</p>
        <div className="info-wrap">
          <div className="psr-icons icon-info float-right"></div>

        </div>
          <div className="graph bar-chart">
            <div className="y-label">
              <div className="y-title">No. of people</div>
              <div>20</div>
              <div>15</div>
              <div>10</div>
              <div>5</div>
              <div>0</div>
            </div>
            <div className="graph-right">
              <div className="chart-container">
                <div className="chart-base">
                  <hr className="chart-line"/>
                  <hr className="chart-line"/>
                  <hr className="chart-line"/>
                  <hr className="chart-line"/>
                  <hr className="chart-line"/>
                </div>
                <div className="chart-data">
                  <div className="data-group">
                    <div className="bar-wrap">
                      <div className="bar red" style={{height: '80%'}}></div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar light-blue" style={{height: '60%'}}></div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar blue" style={{height: '30%'}}></div>
                      <div className="connect-line blue"></div>
                      <div className="circle blue">
                        <img src={DummyPic} />
                      </div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar green" style={{height: '55%'}}></div>
                    </div>
                  </div>

                  <div className="data-group">
                    <div className="bar-wrap">
                      <div className="bar red" style={{height: '80%'}}></div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar light-blue" style={{height: '99%'}}></div>
                      <div className="connect-line light-blue"></div>
                      <div className="circle light-blue">
                        <img src={DummyPic} />
                      </div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar blue" style={{height: '70%'}}></div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar green" style={{height: '55%'}}></div>
                    </div>
                  </div>

                  <div className="data-group">
                    <div className="bar-wrap">
                      <div className="bar red" style={{height: '80%'}}></div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar light-blue" style={{height: '60%'}}></div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar blue" style={{height: '30%'}}></div>
                    </div>
                    <div className="bar-wrap">
                      <div className="bar green" style={{height: '100%'}}></div>
                      <div className="connect-line green"></div>
                      <div className="circle green">
                        <img src={DummyPic} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="x-label">
                <div>20m</div>
                <div>40m</div>
                <div>60m</div>
              </div>
            </div>
          </div>
      </div>
    )
  }
}

export default observer(BarChart)
