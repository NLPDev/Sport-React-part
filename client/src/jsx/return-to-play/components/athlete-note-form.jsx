import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, toJS, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import loadImage from 'blueimp-load-image'
import GetVideoId from 'get-video-id'
import moment from 'moment'

import Api from '../../api'
import Select from '../../components/select'
import Attachments from './attachments'
import Urls from './urls'


export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       doctorTypes: ["Chiropractor", "Massage Therapist", "Physiotherapist"],
                       note: { title: '',
                               doctor: '',
                               return_to_play_type: '',
                               note: '',
                               links: [{url: '', key: 0}],
                               only_visible_to: [],
                              },
                        existingNoteFiles: [],
                        fileError: false,
                        visibleToEveryone: true
                      });
  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    Api.getRTPTypes()
      .then(types => {
        this.doctorTypes = types.map(t => t.value);
      })
      .catch(err => {
        console.log(err);
      });

    $(ReactDOM.findDOMNode(this.refs.me))
      .on("forminvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        this.scrollToError();
        return;
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        if (!this.refs.urls.validate()) {
          setTimeout(() => this.scrollToError(), 0);
        } else {
          this.props.onSubmit(this.note,
                              this.refs.attachments.getFilesToAdd(),
                              this.refs.attachments.getFilesToDelete(),
                              'athlete');
        }
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  trySubmit = () => {
    $(ReactDOM.findDOMNode(this.refs.me)).submit();
  }

  scrollToError = () => {
//    const errorField = $('.Form-Error.Is-Visible')[0];
    $('html, body').scrollTop($('.form-error.is-visible, .form-error.visible').first().offset().top - 200);
  }

  setNote = note => {

    this.note = note;
    this.refs.urls.setUrls(note.links);
    this.existingNoteFiles = note.files.map(file => {
                                              const lastSlash = file.file.lastIndexOf('/');
                                              const name = file.file.substr(lastSlash + 1);

                                              return { id: file.id, name };
                                            });
    if (note.only_visible_to.length) {
      this.visibleToEveryone = false;
    }
  }

  setTitle = e => {
    this.note.title = e.target.value;
  }

  setDoctor = e => {
    this.note.doctor = e.target.value;
  }

  setDoctorType = (doctorType) => {
    this.note.return_to_play_type = doctorType;
  }

  setNoteField = (e) => {
    this.note.note = e.target.value;
  }

  setVisibility = (ev, coach) => {

    if (ev.target.checked) {
      this.note.only_visible_to.push(coach.id);
      this.visibleToEveryone = false;
    } else {
      this.note.only_visible_to = this.note.only_visible_to.filter(c => c != coach.id);
    }
  }

  setVisibleToEveryone = (ev) => {

    if (ev.target.checked) {
      this.visibleToEveryone = true;
      this.note.only_visible_to = [];
    } else {
      this.visibleToEveryone = false;
    }
  }

  render() {

    return (
      <form data-abide noValidate ref="me" className="note-form">
        <label>Note Title
          <input type="text" name="tilte"
                 placeholder="Insert note title"
                 required
                 value={this.note.title}
                 onChange={this.setTitle} />
          <span className="form-error">This field is required.</span>
        </label>
        <label>Who gave you the note (Coach, Trainer, Doctor etc.)
          <input type="text" name="doctor"
                 placeholder="E.g. Linda McDonald"
                 required
                 value={this.note.doctor}
                 onChange={this.setDoctor} />
          <span className="form-error">This field is required.</span>
        </label>
        <label>Note type
          <Select choices={this.doctorTypes}
                  onSelected={this.setDoctorType}
                  placeholder="Select a type of note"
                  index={this.doctorTypes.findIndex(c => c == this.note.return_to_play_type)}/>
        </label>
        <label>Share your notes here (ie: exercises / dates / etc.)
          <textarea placeholder="Start typing..." rows="6"
                    value={this.note.note}
                    onChange={this.setNoteField}></textarea>
          <span className="form-error">This field is required.</span>
        </label>
        <Attachments oldFiles={this.existingNoteFiles} ref='attachments'/>
        <Urls urls={this.note.links} ref="urls"/>

        <fieldset>
          <legend className="">Note visibility</legend>
          <label className="custom-checkbox">
            <input type="checkbox"
                   name="visibility"
                   value="everyone"
                   onChange={this.setVisibleToEveryone}
                   checked={this.visibleToEveryone}/>
            <span className="checkbox-indicator"></span>
            <span>Everyone</span>
          </label>
          {this.user && this.user.linked_users.map(coach => {
            return <label className="custom-checkbox" key={coach.id}>
                     <input type="checkbox"
                            name="visibility"
                            value={coach.id}
                            checked={this.note.only_visible_to ?
                                       this.note.only_visible_to.find(v => v == coach.id) : false }
                            onChange={e => { this.setVisibility(e, coach); }}/>
                     <span className="checkbox-indicator"></span>
                     <span>{`${coach.first_name} ${coach.last_name}`}</span>
                   </label>
           })}
        </fieldset>

        <button type="submit"
                className="button expanded theme"
                value="Save">Save</button>
      </form>
    )
  }
}))
