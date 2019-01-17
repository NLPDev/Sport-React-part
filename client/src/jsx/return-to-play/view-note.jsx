import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'

import UtilBar from '../components/util-bar'
import Api from '../api'
import NoteCard from './components/note-card'
import TwoStepConfirmation from '../components/two-step-confirmation'

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       note: {},
                       doctor: '',
                       doctorType: '',
                       recipient: '',
                       editLink: computed(() => {
                         if (!this.user) return '';
                         if ('athlete' == this.user.user_type && 'athlete' != this.props.match.params.type) return '';
                         if ('coach' == this.user.user_type && 'athlete' == this.props.match.params.type) return '';
                         return `/athlete-log/edit-note/${this.props.match.params.type}/${this.props.match.params.id}`;
                       })
                     });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    if (this.user) {
      this.getNote();
    } else {
      const disposer = observe(this,
                               "user",
                               change => {
                                 if (change.newValue) {
                                   this.getNote();
                                   disposer();
                                 }
                               })
    }
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  getNote = () => {

    let noteGetFunc;

    if ('athlete' == this.user.user_type &&
        ('coach' == this.props.match.params.type || 'team' == this.props.match.params.type)) {

      noteGetFunc = Api.getCoachNote;
    } else {
      noteGetFunc = 'athlete' == this.props.match.params.type ? Api.getAthleteNote : Api.getCoachNote;
    }
    noteGetFunc(this.props.match.params.id, this.props.match.params.coachId)
      .then(note => {
        this.note = note;

        if ('athlete' == this.props.match.params.type) {
          this.doctor = note.doctor;
          this.doctorType = note.return_to_play_type;
        } else {
          if ('athlete' == this.user.user_type &&
              'athlete' == this.props.match.params.type) {
            this.recipient = `${this.user.first_name} ${this.user.last_name}`;
          } else {
            if (note.team_id) {
              this.recipient = note.team_name;
            } else if (note.athlete_id) {
              const athlete = this.user.linked_users.find(u => u.id == note.athlete_id);

              this.recipient = athlete ? athlete.first_name + ' ' + athlete.last_name :
                                         this.user.first_name + ' ' + this.user.last_name;
            } else {
              const owner = this.user.linked_users.find(u => u.id == note.owner);

              this.recipient = owner ? owner.first_name + ' ' + owner.last_name :
                                       this.user.first_name + ' ' + this.user.last_name;
            }
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  getNoteCreator = (note) => {
    if (!note.id || !this.user || 'athlete' == this.user.user_type) return '';

    if (!note.owner_name) {
      const athlete = this.user.linked_users.find(u => u.id == note.owner);

      return athlete.first_name + ' ' + athlete.last_name;
    }
    return '';
  }

  onCancel = () => {
    this.props.history.push('/athlete-log')
  }

  onDeleteNote = () => {
    $('#remove-confirmation').foundation('open');
  }

  doDeleteNote = () => {
    this.refs.removeConfirmation.showSpinner();
    const deleteFunc = 'athlete' == this.props.match.params.type ? Api.deleteAthleteNote : Api.deleteCoachNote;

    deleteFunc(this.props.match.params.id)
      .then(result => {

        this.refs.removeConfirmation.showConfirmation();
        this.props.history.push('/athlete-log');

        //maybe showConfirmation() should do this when it closes
        $('body').removeClass('is-reveal-open');

      })
      .catch(err => {

        this.refs.removeConfirmation.showApiError();
      })
  }

  coachNameFromId = (id) => {
    const coach = this.user.linked_users.find(user => id == user.id);

    return coach ? coach.first_name + ' ' + coach.last_name : '';
  }

  render() {

    return (
      <div className="view-note" ref="me">
        <UtilBar title="Note"
                 onCancel={this.onCancel}
                 cancelText="< Back"
                 readonly={true} />
        <div className="row align-center main-content-container">
          <div className="column content-column">
            <NoteCard title={this.note.title || ''}
                      doctor={this.doctor}
                      doctorType={this.doctorType}
                      recipient={this.recipient}
                      creator={this.getNoteCreator(this.note)}
                      createdDate={this.note.date_created || ''}
                      editLink={this.editLink}
                      viewLink=''
                      deleteNote={this.onDeleteNote} />
            <hr className="divider" />
            <div className="group-section">
              {this.note.note || ''}
            </div>
            <div className="group-section">
              <h3 className="gray-heading">Attachments</h3>
              <div className="file-list">
                {this.note.files ?
                  this.note.files.map((f, index) => {
                    const lastSlash = f.file.lastIndexOf('/');
                    return <a href={f.file}
                              key={index}
                              className="uploaded-file"
                              target="_blank">{f.file.substr(lastSlash + 1)}</a>
                  }) : null}
              </div>
            </div>
            <div className="group-section link-list">
              <h3 className="gray-heading">Links</h3>
              {this.note.links ?
                this.note.links.map(link =>
                  <div><a href={(link.indexOf('http') > -1 ? link : 'http://'+link )} className="dark-text" target="_blank">{link}</a></div>) : null}
                

            </div>
            <hr className="divider" />
            <div className="group-section">
              <h3 className="gray-heading">Note visibility</h3>
              <p>Visibility is about who can view your notes. You can update and change who can see your notes at any time.</p>
              {this.note.only_visible_to ?
                (0 == this.note.only_visible_to.length ?
                  <div className="dark-text">Everyone</div> :
                  this.note.only_visible_to.map((coach, index) => <div className="dark-text"
                                                                       key={index}>{this.coachNameFromId(coach)}
                                                                  </div>)
                ) : null}
            </div>
          </div>
        </div>

        <TwoStepConfirmation userType={this.user && this.user.user_type}
                             id="remove-confirmation"
                             msg="Are you sure you want to delete this note?"
                             btnText="Yes, delete my note"
                             cancelBtnText="No, on second thought, I don't want to delete this"
                             onProceed={this.doDeleteNote}
                             successMsg="Your note has been removed successfully."
                             apiMsg="We have problem processing your request, please try again later."
                             ref="removeConfirmation"/>

      </div>
    )
  }
}))
