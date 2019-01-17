import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

import Select from './select'

class CountryProvince extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { provinceChoices: computed(() => { return 0 == this.props.countryIndex ?
                                          this.provinces.map(p => p[1]) : this.states.map(s => s[1]) }),
                       curProvinceIndex: computed(() => {
                                           return this.provinceChoices.findIndex(c => c == this.props.province)})
                     });

    this.provinces = [
      ["BC", "British Columbia"],
      ["ON", "Ontario"],
      ["NL", "Newfoundland and Labrador"],
      ["NS", "Nova Scotia"],
      ["PE", "Prince Edward Island"],
      ["NB", "New Brunswick"],
      ["QC", "Quebec"],
      ["MB", "Manitoba"],
      ["SK", "Saskatchewan"],
      ["AB", "Alberta"],
      ["NT", "Northwest Territories"],
      ["NU", "Nunavut"],
      ["YT", "Yukon Territory"]
    ];
    this.states = [
      ['AL', 'Alabama'],
      ['AK', 'Alaska'],
      ['AZ', 'Arizona'],
      ['AR', 'Arkansas'],
      ['CA', 'California'],
      ['CO', 'Colorado'],
      ['CT', 'Connecticut'],
      ['DE', 'Delaware'],
      ['DC', 'District of Columbia'],
      ['FL', 'Florida'],
      ['GA', 'Georgia'],
      ['HI', 'Hawaii'],
      ['ID', 'Idaho'],
      ['IL', 'Illinois'],
      ['IN', 'Indiana'],
      ['IA', 'Iowa'],
      ['KS', 'Kansas'],
      ['KY', 'Kentucky'],
      ['LA', 'Louisiana'],
      ['ME', 'Maine'],
      ['MD', 'Maryland'],
      ['MA', 'Massachusetts'],
      ['MI', 'Michigan'],
      ['MN', 'Minnesota'],
      ['MS', 'Mississippi'],
      ['MO', 'Missouri'],
      ['MT', 'Montana'],
      ['NE', 'Nebraska'],
      ['NV', 'Nevada'],
      ['NH', 'New Hampshire'],
      ['NJ', 'New Jersey'],
      ['NM', 'New Mexico'],
      ['NY', 'New York'],
      ['NC', 'North Carolina'],
      ['ND', 'North Dakota'],
      ['OH', 'Ohio'],
      ['OK', 'Oklahoma'],
      ['OR', 'Oregon'],
      ['PA', 'Pennsylvania'],
      ['RI', 'Rhode Island'],
      ['SC', 'South Carolina'],
      ['SD', 'South Dakota'],
      ['TN', 'Tennessee'],
      ['TX', 'Texas'],
      ['UT', 'Utah'],
      ['VT', 'Vermont'],
      ['VA', 'Virginia'],
      ['WA', 'Washington'],
      ['WV', 'West Virginia'],
      ['WI', 'Wisconsin'],
      ['WY', 'Wyoming']
    ];
  }

  componentWillMount() {
  }

  setCountry = (country) => {

    this.props.setCountry(country);
  }

  showInfo = () => {
    $(ReactDOM.findDOMNode(this.refs.infoPopup)).addClass('active').outerWidth();
    $(ReactDOM.findDOMNode(this.refs.infoPopup)).addClass('fade-in');
    $(ReactDOM.findDOMNode(this.refs.infoIcon)).fadeOut();
  }

  hideInfo = () => {
    const self = $(ReactDOM.findDOMNode(this.refs.infoPopup));
    self.removeClass('fade-in').one('transitionend', () => self.removeClass('active'));
    $(ReactDOM.findDOMNode(this.refs.infoIcon)).fadeIn();
  }

  validate = () => {
    const countryValid = this.countrySelect.validate();
    const provinceValid = this.provinceSelect.validate();
    return  countryValid && provinceValid;
  }

  setProvince = (province) => {

    this.props.setProvince(province)
  }

  render() {

    return (
      <div>
        { this.props.countryReadOnly ?
            <div className="custom-select">
              <label>Country
                <span className="psr-icons icon-info" onClick={this.showInfo} ref="infoIcon"></span>
                <div className="info-popup" ref="infoPopup">
                  <div className="info-popup-header">
                    <span className="psr-icons icon-info"></span>
                    <span className="psr-icons icon-x" onClick={this.hideInfo}></span>
                  </div>
                  <div className="info-popup-body">
                    <p>At this time you are unable to change your country of residence. This is due to personalsportrecord.com's data storage policies. In order to comply with federal laws and the rules and regulations put forth by our partner sport organizations, we must store your data within the country that you currently reside in. Our goal is to keep your data as secure as possible so that we can ensure that your data is never accessed by any unauthorized parties. If you have any questions or concerns about these policies, please don't hesitate to contact our support team at <a href="mailto:info@personalsportrecord.com">info@personalsportrecord.com</a></p>
                  </div>
                </div>
              </label>
              <div className='selected read-only'>{0 == this.props.countryIndex ? 'Canada' : 'US'}</div>
            </div> :
            <Select placeholder="select"
                    title="Country"
                    choices={['Canada', 'US']}
                    ref={r => this.countrySelect = r}
                    onSelected={this.setCountry}
                    index={this.props.countryIndex}
                    tabIndex={this.props.tabIndex ? (this.props.tabIndex + '.1') : ''}
                  />
        }
        <Select placeholder="select"
                title="Province/State"
                ref={r => this.provinceSelect = r}
                choices={this.provinceChoices}
                onSelected={this.setProvince}
                index={this.curProvinceIndex}
                tabIndex={this.props.tabIndex ? (this.props.tabIndex + '.2') : ''}
              />
      </div>
    )
  }
}

export default observer(CountryProvince)
