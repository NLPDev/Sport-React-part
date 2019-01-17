import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {extendObservable, computed} from 'mobx'
import {observer} from 'mobx-react'

class Select extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { listShown: false,
                       curIndex: computed(() => this.props.index),
                       curSelection: computed(() => this.curIndex >= 0 ? this.props.choices[this.props.index] :
                                                                         this.props.placeholder),
                       showError: false });
  }

  setValue = (item, i) => {

    if (item.isHeader) return;

    this.toggleList();

    if (item == this.curSelection) return;

    this.props.onSelected(item, i);
    this.showError = false;
  }

  toggleList = () => {
    this.listShown = !this.listShown;
  }

  validate = () => {
    if (this.props.placeholder == this.curSelection) {
      this.showError = true;
      return false;
    }
    this.showError = false;
    return true;
  }

  render() {

    return (
      <div className="custom-select">
        {this.props.title ?
          <label className={this.showError ? 'is-invalid-label' : ''}>{this.props.title}</label>
          : null
        }
        <div className={'selected' + (this.showError ? ' is-invalid-label' : '')}
             onClick={this.toggleList}
             ref='select'
             tabIndex={this.props.tabIndex ? this.props.tabIndex : ''}>
          {this.curSelection ?
            <div>
              <div className="profile-thumb"
                style={{background: `url(${this.curSelection.pictureUrl}) #fff no-repeat center center`}}>
              </div>
              {this.curSelection.name} 
            </div>
            : this.props.placeholder}</div>
        <ul className={(this.listShown ? 'show' : 'hide') + ' select-list no-bullet'}>
          {this.props.choices.map((item, i) => <li onClick={() => this.setValue(item, i)} key={item.name + i}>
                                                  <div className="profile-thumb"
                                                    style={{background: `url(${item.pictureUrl}) #fff no-repeat center center`}}>
                                                  </div>
                                                  {item.name}
                                               </li>)}
        </ul>
        <div className={"form-error label" + (this.showError ? " is-visible" : "")}>This field is required.</div>
      </div>
    )
  }
}

export default observer(Select);
