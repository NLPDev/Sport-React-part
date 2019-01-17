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
                     { note: {} });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    const getNoteFunc = 'athlete' == this.props.match.params.type ? Api.getAthleteNote : Api.getCoachNote;

    getNoteFunc(this.props.match.params.id)
      .then(note => {
        note.links = note.links.map((url, index) => ({ url,
                                                       isConfirmed: true, 
                                                       key: index }));
        note.links.push({ url: '', key: note.links.length });
        this.form.wrappedInstance.setNote(note)
      });
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  onSave = () => {
    if('athlete' == this.props.user.user_type) {
      this.form.wrappedInstance.trySubmit();
    } else {
      this.form.wrappedInstance.trySubmit();
    }
  }

  onCancel = () => {
    this.props.history.push('/athlete-log')
  }

  submitForm = async (note, filesToAdd, filesToDelete, userType) => {
    $('#save-confirmation').foundation('open');

    const addedFiles = [];

    while (filesToDelete.length) {

      const fileId = filesToDelete.pop();
      const index = note.files.findIndex(f => f.id == fileId);
      note.files.splice(index, 1);
      const result = await Api.deleteFile(fileId);
    }

    while (filesToAdd.length) {

      const formData = new FormData();

      formData.append('file', filesToAdd.pop());
      const file = await Api.uploadFile(formData);
      addedFiles.push(file);
    }

    note.links = note.links.map(l => l.url)
                   .filter(url => url);
    note.files = note.files.map(f => f.id).concat(addedFiles.map(f => f.id));

    const updateFunc = 'athlete' == this.props.user.user_type ? Api.updateAthleteNote : Api.updateCoachNote;
    updateFunc(note)
      .then(result => {

        this.showConfirmation();
      })
      .catch(err => {

        this.showApiError();
      });
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
        <UtilBar title="Edit note"
                 onCancel={this.onCancel}
                 onSave={this.onSave}
                 noAutoPopup={true}/>
        <div className="row align-center main-content-container">
          <div className="column content-column">
            {this.props.user && 'athlete' == this.props.user.user_type ?
              <AthleteNoteForm ref={r => { this.form = r; }}
                               action="edit"
                               onSubmit={this.submitForm}/>
              :
              <CoachNoteForm ref={r => { this.form = r; }}
                             action="edit"
                             onSubmit={this.submitForm}/>
            }
          </div>
        </div>

        <SaveConfirmation userType={this.props.user && this.props.user.user_type}
            msg="Your note has been changed successfully."
            apiMsg="There is a problem submitting note."
            onClose={this.onCancel}
            ref="saveConfirmation"/>
      </div>
    )
  }
}))
