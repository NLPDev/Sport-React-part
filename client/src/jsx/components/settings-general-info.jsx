import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer} from 'mobx-react'

import CountryProvince from '../components/country-province'
import Api from '../api'


class SettingsGeneralInfo extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       countryIndex: computed(() => { 
                                       return this.props.user ? ('ca' == this.props.user.country ? 0 : 1) : -1 }),
                       curProvince: ''
                     })
  }

  componentDidMount() {

    this.disposer = observe(this, 'user', change => {
      this.curProvince = change.newValue.province_or_state;
    })
  }

  setCountry = country => {

    this.props.user.country = country;
  }

  setProvince = province => {

    this.curProvince = province;
    this.props.user.province_or_state = province;
  }

  setUnitPreferrence = e => {

    this.props.user.measuring_system = e.target.value;
  }

  setCity = e => {

    this.props.user.city = e.target.value;
  }

  updateGeneralInfo = (e) => {
    e.preventDefault();
    Api.updateUser(this.props.user)
      .then(result => {
        console.log(result);
        this.props.onSuccess();
      })
      .catch(err => console.log(err));
  }

  render() {

    return (
      <div className="content-section general-info">
        <h2 className="section-heading">General</h2>
        <form>
          <fieldset>
            <legend>Preferred measuring system</legend>
            <label className="custom-radio">
              <input type="radio" name="measuring" value="imperial" id="imperial" required
                checked={'imperial' == (this.props.user && this.props.user.measuring_system)}
                onChange={this.setUnitPreferrence}/>
                <span className="radio-indicator"></span><span>Imperial</span>
              </label>
              <label className="custom-radio">
                <input type="radio" name="measuring" value="metric" id="metric"
                  checked={'metric' == (this.props.user && this.props.user.measuring_system)}
                  onChange={this.setUnitPreferrence}/>
                  <span className="radio-indicator"></span><span>Metric</span>
                </label>
              </fieldset>
              <fieldset>
                <legend className="location-label">Location</legend>
                <CountryProvince setProvince={this.setProvince}
                                 countryIndex={this.countryIndex}
                                 province={this.curProvince}
                                 countryReadOnly={true} />
                <label>City
                  <input type="text"
                         placeholder="vancouver"
                         value={this.props.user ? this.props.user.city : ''}
                         onChange={this.setCity} />
                  <span className="form-error"> This field is required.</span>
                </label>
              </fieldset>
              <button type="submit"
                      className="button theme"
                      value="update"
                      data-open="save-confirmation"
                      onClick={this.updateGeneralInfo}>Update</button>
        </form>

      </div>
    )
  }
}

export default observer(SettingsGeneralInfo)
