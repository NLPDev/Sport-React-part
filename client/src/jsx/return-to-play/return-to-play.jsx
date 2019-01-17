import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import moment from 'moment'

import Api from '../api'
import NoteCard from './components/note-card'
import TwoStepConfirmation from '../components/two-step-confirmation'

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       athleteNotes: [],
                       coachNotes: [],
                       teamNotes: [],
                       deleteFunc: null,
                       deletingNoteId: -1
                     });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {

    if (this.user) {
      this.getNotes();
    } else {
      const disposer = observe(this,
                               "user",
                               change => {
                                 if (change.newValue) {
                                   this.getNotes();
                                   disposer();
                                 }
                               });
    }
  }

  getNotes = () => {

    const sortFunc = (n1, n2) => { return moment(n1.date_created) < moment(n2.date_created); };
    const getNotesFunc = 'athlete' == this.user.user_type ? Api.getAthleteNotes : Api.getCoachNotes;
    getNotesFunc()
      .then(([notesA, notesC]) => {
        this.athleteNotes = notesA.sort(sortFunc);

        const notesT = notesC.filter(n => n.team_id);
        this.teamNotes = notesT.reduce((acc, note) => {

          const team = acc.find(item => item.team_id == note.team_id);

          if (team) {
            team.notes.push(note);
          } else {
            acc.push({team_id: note.team_id,
                      teamName: note.team_name,
                      notes: [note]});
          }
          return acc;
        }, []);
        this.teamNotes = this.teamNotes.map(tn => ({ team_id: tn.team_id,
                                                     teamName: tn.teamName,
                                                     notes: tn.notes.sort(sortFunc) }))

        notesC = notesC.filter(n => !n.team_id);
        this.coachNotes = notesC.reduce((acc, note) => {

          const coach = acc.find(item => item.coach_id == note.owner);

          if (coach) {
            coach.notes.push(note);
          } else {
            acc.push({coach_id: note.owner,
                      coachName: note.owner_name,
                      notes: [note]});
          }
          return acc;
        }, []);
        this.coachNotes = this.coachNotes.map(cn => ({ coach_id: cn.coach_id,
                                                       coachName: cn.coachName,
                                                       notes: cn.notes.sort(sortFunc) }));
      })
      .catch(err => {
        console.log(err);
      });
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  deleteAthleteNote = (noteId) => {

    this.deletingNoteId = noteId;
    this.deleteFunc = Api.deleteAthleteNote;
    $('#remove-confirmation').foundation('open');
  }

  deleteCoachNote = (noteId) => {

    this.deletingNoteId = noteId;
    this.deleteFunc = Api.deleteCoachNote;
    $('#remove-confirmation').foundation('open');
  }

  doDeleteNote = () => {
    this.refs.removeConfirmation.showSpinner();

    this.deleteFunc(this.deletingNoteId)
      .then(result => {

        this.refs.removeConfirmation.showConfirmation();
        this.getNotes();
        this.deletingNoteId = -1;
        this.deleteFunc = null;
      })
      .catch(err => {

        this.refs.removeConfirmation.showApiError();
      })
  }

  getNoteCreator = (note) => {
    if (!this.user || 'athlete' == this.user.user_type) return '';

    if (!note.owner_name) {
      const athlete = this.user.linked_users.find(u => u.id == note.owner);

      return athlete.first_name + ' ' + athlete.last_name;
    }
    return '';
  }
  
  render() {

    return (
      <div className="row align-center main-content-container" ref="me">
        <div className="column content-column">
          <p className="text-center">
            {this.user && ('athlete' == this.user.user_type) ?
              'Welcome to your Athlete Log. To get the most out of PSR, this section is for tracking personal health and training notes to get you back healthy and game ready, collecting and tracking notes from any of your trainers and health professionals and coaches. Add any recovery exercises, health updates or details you want to share with your coaches so everyone is on the same page. And your coaches can share important notes or updates with you and the entire team.'
              :
              'Welcome to our Athlete Log. To get the most out of PSR, this section is for coaches like you to get valuable and real time health and training updates from your team by getting access from any of your athlete\'s, their trainers and their health professionals. And as a coach, you can share valuable updates, and information to individual athletes or your whole team.'
            }
          </p>

          <div className="group-section">
            <div className="group-heading-wrap">
              <h3 className="group-heading">Add a new note</h3>
              <Link to="/athlete-log/add-note" className="button border responsive add" >
              <span className="psr-icons icon-plus"></span>
              <span className="show-for-large">Add a new note</span>
            </Link>
            </div>
            <hr className="divider" />
          </div>

          <div className="group-section">
            <h3 className="group-heading">{(this.user && this.user.user_type == "athlete") ? "My Notes" : "Athlete's notes"}</h3>
            {0 == this.athleteNotes.length && 0 == this.coachNotes.length ?
              <div>
                <hr className="divider" />
                <p className="text-center">Your notes are empty. Try adding one now.</p>
                <Link to="/athlete-log/add-note" className="button theme expanded">Add a new note</Link>
              </div> : null }
            {this.athleteNotes.map(note => (
              <NoteCard title={note.title} key={note.id}
                        noteId={note.id}
                        deleteNote={this.deleteAthleteNote}
                        doctor={note.doctor}
                        doctorType={note.return_to_play_type}
                        creator={this.getNoteCreator(note)}
                        createdDate={moment(note.date_created).format("MMM D, YYYY")}
                        editLink={this.user && 'athlete' == this.user.user_type ?
                                     `/athlete-log/edit-note/athlete/${note.id}` : ''}
                        viewLink={`/athlete-log/view-note/athlete/${note.id}/${this.user && 'coach' == this.user.user_type ? note.owner : ''}`} />))}
          </div>

          {this.coachNotes.map((coach, index) =>

            <div className="group-section" key={index}>
              <h3 className="group-heading">Coach {coach.coachName} Notes</h3>
              {coach.notes.map((note, nIndex) => {

                if (!this.user) return null;

                let recipient;

                if ('athlete' == this.user.user_type) {
                  recipient = note.owner_name;
                } else {
                  if (note.team_id) {
                    const theTeam = this.user.team_ownerships.concat(this.user.team_memberships)
                                      .find(at => at.id == note.team_id);
                    recipient = theTeam ? theTeam.name : '';
                  }
                  const theAthlete = this.user.linked_users.find(u => u.id == note.athlete_id);
                  recipient = theAthlete ? theAthlete.first_name + ' ' + theAthlete.last_name : '';
                }

                return <NoteCard title={note.title} key={nIndex}
                                 noteId={note.id}
                                 deleteNote={this.deleteCoachNote}
                                 recipient={recipient}
                                 createdDate={note.date_created}
                                 editLink={this.user && 'coach' == this.user.user_type ?
                                             `/athlete-log/edit-note/coach/${note.id}` : ''}
                                 viewLink={`/athlete-log/view-note/coach/${note.id}/${note.owner}`} />
              })}
            </div>
          )}

          {this.teamNotes.map((team, index) =>

            <div className="group-section" key={index}>
              <h3 className="group-heading">Team {team.teamName} Notes</h3>
              {team.notes.map((note, nIndex) =>

                <NoteCard title={note.title} key={nIndex}
                          noteId={note.id}
                          deleteNote={this.deleteCoachNote}
                          recipient={`${note.team_name}, Team`}
                          createdDate={note.date_created}
                          editLink={this.user && 'coach' == this.user.user_type ?
                                      `/athlete-log/edit-note/coach/${note.id}` : ''}
                          viewLink={`/athlete-log/view-note/team/${note.id}/${note.owner}`} />
              )}
            </div>
          )}

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
