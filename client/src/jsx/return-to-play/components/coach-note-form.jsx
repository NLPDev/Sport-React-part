import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed, toJS, observe} from 'mobx'
import {observer, inject} from 'mobx-react'
import loadImage from 'blueimp-load-image'
import GetVideoId from 'get-video-id'
import moment from 'moment'

import Api from '../../api'
import SegSelect from '../../components/segmented-select'
import Attachments from './attachments'
import Urls from './urls'
import AvatarRed from '../../../images/avatar-red.png'
import AvatarTeam from '../../../images/avatar-team.png'

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       note: { title: '',
                               athlete_id: '',
                               team_id: '',
                               note: '',
                               links:[{url: '', key: 0}],
                              },
                       existingNoteFiles: [],
                       althleteOrTeamValid: true,
                       curRecipientIndex: -1,
                       listAthleteCoach: computed(() => {
                                           if (!this.user) return [];

                                           const athletes = this.user.linked_users.map(a =>({id: a.id,
                                                                                             type: 'athlete',
                                                                                             name: `${a.first_name} ${a.last_name}`,
                                                                                             pictureUrl: a.profile_picture_url || AvatarRed
                                                                                           }))
                                           const teams = this.user.team_ownerships.concat(this.user.team_memberships)
                                                           .map(t => ({id: t.id,
                                                                       type: 'team',
                                                                       name: t.name,
                                                                       pictureUrl: t.team_picture_url || AvatarTeam
                                                                     }));
                                           const allItems = athletes.concat(teams);
                                           const all = allItems.reduce((acc, item) => {
                                                           if (!acc.find(letter => letter == item.name[0].toUpperCase())) {
                                                             acc.push(item.name[0].toUpperCase());
                                                           }
                                                           return acc;
                                                         }, [])
                                                         .sort((a, b) => a > b)
                                                         .map(letter => {
                                                           const entities = allItems
                                                               .filter(item => {
                                                                  return item.name[0].toUpperCase() == letter;
                                                                });

                                                           return { letter, entities }
                                                         })
                                                         .map(item => {
                                                           return [{id: -1, name: item.letter, isHeader: true}].concat(item.entities);
                                                         })
                                                         .reduce((acc, items) => {
                                                           acc = acc.concat(items);
                                                           return acc;
                                                         }, []);
                                           return all;
                                         }),
                       fileError: false
                      });
  }

  componentDidMount() {

    $(ReactDOM.findDOMNode(this.refs.me)).foundation();

    const disposer = observe(this,
                             'listAthleteCoach',
                             change => {
                               if (change.newValue) {
                                 if (this.note.id) {
                                   this.curRecipientIndex = this.listAthleteCoach.findIndex(ac => {
                                     const type = this.note.athlete_id ? 'athlete' : 'team';
                                     return (ac.id == (this.note.athlete_id || this.note.team_id)) &&
                                            (ac.type == type);
                                   });
                                 }
                                 disposer();
                               }
                             });

    $(ReactDOM.findDOMNode(this.refs.me))
      .on("forminvalid.zf.abide", (ev,frm) => {
        ev.preventDefault();
        this.refs.athleteTeamSelect.validate();
        this.scrollToError();
        return;
      })
      .on("formvalid.zf.abide", (ev,frm) => {
        if (!(this.refs.athleteTeamSelect.validate() && this.refs.urls.validate())) {
          setTimeout(() => this.scrollToError(), 0);
          return;
        }
        this.props.onSubmit(this.note,
                            this.refs.attachments.getFilesToAdd(),
                            this.refs.attachments.getFilesToDelete(),
                            'coach');
      })
      .on("submit", ev => {
        ev.preventDefault();
      });
  }

  trySubmit = () => {
    $(ReactDOM.findDOMNode(this.refs.me)).submit();
  }

  scrollToError = () => {
    $('html, body').scrollTop($('.form-error.is-visible, .form-error.visible').first().offset().top - 200);
  }

  setNote = (note) => {

    this.note = note;
    this.refs.urls.setUrls(note.links);
    this.existingNoteFiles = note.files.map(file => {
                                              const lastSlash = file.file.lastIndexOf('/');
                                              const name = file.file.substr(lastSlash + 1);

                                              return { id: file.id, name };
                                            });
    this.curRecipientIndex = this.listAthleteCoach.findIndex(ac => {
                               const type = note.athlete_id ? 'athlete' : 'team';
                               return (ac.id == (note.athlete_id || note.team_id)) &&
                                      (ac.type == type);
                             });
  }

  setTitle = e => {
    this.note.title = e.target.value;
  }

  setRecipient = (recipient, i) => {
    if ('athlete' == recipient.type) {
      this.note.athlete_id = recipient.id;
    } else {
      this.note.team_id = recipient.id;
    }
    this.curRecipientIndex = i;
  }

  setNoteField = (ev) => {
    this.note.note = ev.target.value;
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

        <SegSelect choices={this.listAthleteCoach}
                   title="Select an athlete or team"
                   onSelected={this.setRecipient}
                   placeholder="Select an athlete or team"
                   ref="athleteTeamSelect"
                   index={this.curRecipientIndex}/>

        <label>Share your notes here (ie: exercises / dates / etc.)
          <textarea placeholder="Start typing..."
                    rows="6"
                    value={this.note.note}
                    onChange={this.setNoteField}></textarea>
        </label>
        <Attachments oldFiles={this.existingNoteFiles} ref='attachments'/>
        <Urls urls={this.note.links} ref="urls"/>
        <button type="submit"
                className="button expanded theme"
                value="Save">Save</button>

      </form>
    )
  }
}))
