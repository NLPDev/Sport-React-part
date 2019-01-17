import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import AthleteNoteForm from './components/athlete-note-form'
import CoachNoteForm from './components/coach-note-form'
import SaveConfirmation from '../components/save-confirmation'

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { fileIds: [] });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = () => {
    if('athlete' == this.props.user.user_type) {
      this.refs.athleteNoteForm.wrappedInstance.trySubmit();
    } else {
      this.refs.coachNoteForm.wrappedInstance.trySubmit();
    }
  }

  onCancel = () => {
    this.props.history.push('/athlete-log')
  }

  submitNote = (note, type) => {
    $('#save-confirmation').foundation('open');

    note.links = note.links.map(u => u.url).filter(u => u.length > 0);

    note.files = this.fileIds;

    const addNoteFunc = 'athlete' == type ? Api.addAthleteNote : Api.addCoachNote;

    if (!note.team_id) {
      delete note.team_id;
    }
    if (!note.athlete_id) {
      delete note.athlete_id;
    }
    addNoteFunc(note)
      .then(result => {
        this.showConfirmation();
      })
      .catch(err => {
        this.showApiError();
        console.log(err);
      });
  }

  onSubmit = (note, filesToAdd, filesToDelete, type) => {

    if (filesToAdd.length) {

      const formData = new FormData();

      formData.append('file', filesToAdd.pop());
      Api.uploadFile(formData)
        .then(result => {

          this.fileIds.push(result.id);
          this.onSubmit(note, filesToAdd, filesToDelete, type);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.submitNote(note, type);
    }
  }

  showApiError = () => {
    this.refs.saveConfirmation.showApiError();
  }

  showConfirmation = () => {
    this.refs.saveConfirmation.showConfirmation();
  }

  render() {

    return (
      <div className="add-note" ref="me">
        <UtilBar title="Add a new note"
                 onCancel={this.onCancel}
                 onSave={this.onSave}
                 noAutoPopup={true}/>
        <div className="row align-center main-content-container">
          <div className="column content-column">
            {this.props.user && 'athlete' == this.props.user.user_type ?
              <AthleteNoteForm ref="athleteNoteForm"
                               action="add"
                               onSubmit={this.onSubmit}/> :
              <CoachNoteForm ref="coachNoteForm"
                             action="add"
                             onSubmit={this.onSubmit}/>
            }
          </div>
        </div>

        <SaveConfirmation userType={this.props.user && this.props.user.user_type}
            msg="Your note has been added successfully."
            apiMsg="There is a problem submitting note."
            onClose={this.onCancel}
            ref="saveConfirmation"/>
      </div>
    )
  }
}))
