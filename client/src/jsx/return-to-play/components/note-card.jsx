import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import Api from '../../api'

class NoteCard extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { });
  }

  componentDidMount() {

  }

  onDelete = (e) => {
    e.preventDefault();
    this.props.deleteNote(this.props.noteId)
  }

  render() {

    return (
      <div className="card note-card">
        <div className="row">
          {this.props.viewLink ?
            <Link to={this.props.viewLink} className="column view-link">
              <h4 className="group-title">{this.props.title}</h4>
              <div>
                {this.props.doctor ? this.props.doctor : ''}
                {this.props.doctor && this.props.doctorType ? ', ' : ''}
                {this.props.doctorType ? this.props.doctorType : ''}
              </div>
              {this.props.recipient ?
                <div>{this.props.recipient}</div> : null }
              {this.props.creator ?
                <div>Created by: {this.props.creator}</div> : null }
              <div>{this.props.createdDate}</div>
            </Link> :
            <div className="column view-link">
              <h4 className="group-title">{this.props.title}</h4>
              <div>
                {this.props.doctor ? this.props.doctor : ''}
                {this.props.doctor && this.props.doctorType ? ', ' : ''}
                {this.props.doctorType ? this.props.doctorType : ''}
              </div>
              {this.props.recipient ?
                <div>{this.props.recipient}</div> : null }
              {this.props.creator ?
                <div>Created by: {this.props.creator}</div> : null }
              <div>{this.props.createdDate}</div>
            </div>}

          {this.props.editLink ?
            <div className="column shrink col-right">
              <Link to="/athlete-log/delete-note">
                <span className="psr-icons icon-trash theme" onClick={this.onDelete}></span>
              </Link>
              <Link to={this.props.editLink} className="edit-btn">
                <span className="psr-icons icon-pen theme"></span>
              </Link>
            </div> : null }
        </div>
      </div>
    )
  }
}

export default observer(NoteCard)
