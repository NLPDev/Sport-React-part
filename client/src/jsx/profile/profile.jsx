import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'
import GetVideoId from 'get-video-id'
import moment from 'moment'

import Api from '../api'
import ContentCard from '../dashboard/components/content-card'
import AvatarRed from '../../images/avatar-red.png'
import AvatarBlue from '../../images/avatar-blue.png'
import AvatarTeam from '../../images/avatar-team.png'
import AwardCard from '../dashboard/components/award-card'
import AwardCardGR from '../dashboard/components/award-card-gr'
import SchoolCard from '../dashboard/components/school-card'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'
import VideoField from '../components/video-field'

export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user),
                       sports: computed(() => {
                                 if (!this.user) return [];

                                 const chosen = this.user.chosen_sports
                                                  .filter(s => s.is_chosen);
                                 return chosen.map(s => s.sport);
                               }),
                       goals: [],
                       noGoal: computed(() => 0 == this.goals.length),
                       pendingGoals: computed(() => this.goals.filter(g => !g.is_achieved)),
                       goalsAchieved: computed(() => this.goals.filter(g => g.is_achieved)),
                       forContentCard: computed(() => {
                                         let props = { themeColor: 'red',
                                                       sports: [] }
                                         if (this.user) {
                                           props.name = `${this.user.first_name} ${this.user.last_name}`;
                                           props.themeColor = 'coach' == this.user.user_type ? 'blue' : 'red';
                                           props.tagline = this.user.tagline;
                                           props.avatar = this.user.profile_picture_url ||
                                                            ('coach' == this.user.user_type ? AvatarBlue : AvatarRed);
                                         }
                                         return props;
                                       }),
                       videos: [],
                       newVideos: [],
                       newVideoComps: [],
                       awards: []
                     });
  }

  playerUrls = { 'vimeo': 'https://player.vimeo.com/video/',
                 'youtube': 'https://www.youtube.com/embed/' }

  // playerSize = { 'vimeo': { width: 640, height: 360 },
  //                'youtube': { width: 560, height: 315 } }

  componentDidMount() {
    $('.reveal-overlay').remove();

    Api.retrieveGoals()
      .then(goals => {

        this.goals = goals;
      })
      .catch(err => console.log(err));

    this.getVideos();

    this.retrieveAwards();
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  getVideos = () => {

    Api.getVideos()
      .then(videos => {
        this.videos = videos;
        this.newVideos = [];
      })
      .catch(err => {
        console.log(err);
      });
  }

  retrieveAwards = () => {

    Api.retrieveAwards()
      .then(awards => {

        this.awards = awards;
      })
      .catch(err => {
        console.log(err);
      });
  }

  addVideoFields = () => {
    this.newVideos.push({ url: '' });
  }

  submitVideos = (ev) => {
    ev.preventDefault();

    let newVideosValid = true;
    const forSave = [];

    for(let i = 0; i < this.newVideos.length; i++) {
      if( i==0 || this.newVideos[i].url) {
        const videoId = GetVideoId(this.newVideos[i].url);
        if (!videoId) {
          newVideosValid = false;
          this.newVideoComps[i].showError();
        } else {
          this.newVideoComps[i].hideError();
          forSave.push(this.newVideos[i]);
        }
      } else {
        this.newVideoComps[i].hideError();
      }
    }
    if(!newVideosValid) return;
    this.saveVideos(forSave);
  }

  saveVideos = (forSave) => {

    Api.addVideo(forSave)
      .then(response => {

        this.getVideos();
      })
      .catch(err => {
        console.log(err);
      });
  }

  clearNewVideos = () => {
      this.newVideos = []
  }

  render() {

    return (
      <div className="row align-center main-content-container" ref="me">
        <div className="column content-column">

          <div className="group-section">
            <ContentCard {...this.forContentCard}
                         sports={this.sports}
                         link='/profile/edit'
                         status={["injured", "active"]}/>
          </div>

          {/* {'athlete' == (this.props.user && this.props.user.user_type) ?
            <div className="group-section">
              <h3 className="group-heading">GPA</h3>
              <SchoolCard title="St.George school"
                          attending={true}/>
            </div> : ''} */}

          <div className="group-section">
            <h3 className="group-heading">My Videos</h3>
            {this.videos.map(v => (
              <div className="responsive-embed widescreen">
                <iframe src={`${this.playerUrls[v.video_type]}${v.video_id}`}
                        width="560"
                        height="315"
                        frameBorder="0"
                        allowFullScreen></iframe>
              </div>))}
            {/*
            <div className="responsive-embed widescreen">
              <iframe src="https://player.vimeo.com/video/153011731" width="640" height="360" frameBorder="0" allowFullScreen></iframe>
            </div>
            <div className="responsive-embed widescreen">
              <iframe src="https://www.youtube.com/embed/WUgvvPRH7Oc" width="560" height="315" frameBorder="0" allowFullScreen></iframe>
            </div> */}

            <form>
              {this.newVideos.map((v, i) => <VideoField video={v}
                                                        key={i}
                                                        ref={r => { this.newVideoComps[i] = r; }}
                                                        videoIndex={i + 1} />)}
              <div className="add-wrap" onClick={this.addVideoFields}>
                <span className="psr-icons icon-add"></span><span>Add video</span>
              </div>
              {this.newVideos.length ?
                <div>
                  <button type="submit"
                    onClick={this.submitVideos}
                    className="button expanded theme"
                    value="Save">Save</button>

                  <div className="cancel text-center" onClick={this.clearNewVideos}>Cancel</div>
                </div>
               : null}

            </form>
          </div>

          <div className="group-section">
            <h3 className="group-heading">My Achievements</h3>
            {this.awards.map(award => <AwardCard imgId={award.badge_id - 1}
                                                 title={award.title}
                                                 content=''
                                                 team={award.team || ''}
                                                 footer={moment(award.date).format('MMM D, YYYY')}
                                                 link={`/profile/edit-achievement/${award.id}/p`}/>)}
            <Link to="/profile/add-achievement/p" className="add-wrap" >
              <span className="psr-icons icon-add"></span><span>Add achievement</span>
            </Link>
          </div>

          <div className="group-section">
            <h3 className="group-heading">My Goals</h3>
            { this.noGoal ? <AwardCardGR isGrey={true}
                                         title="No current goals"
                                         content="Add one with the pencil icon!"
                                         footer="-"
                                         link="/profile/add-goal"/> : null }
            { this.pendingGoals.map(goal =>
                <AwardCardGR isGrey={true}
                             title="Goal"
                             content={goal.description}
                             footer={`Achieve by: ${moment(goal.achieve_by).format('MMM D, YYYY')}`}
                             link={`/profile/edit-goal/${goal.id}/p`} /> )}
             <Link to="/profile/add-goal" className="add-wrap">
               <span className="psr-icons icon-add"></span><span>Add goal</span>
             </Link>
          </div>

          {this.goalsAchieved.length ?
            <div className="group-section">
              <h3 className="group-heading">Completed Goals</h3>
              {this.goalsAchieved.map(goal => <AwardCardGR isGrey={false}
                                                           title="Goal"
                                                           content={goal.description}
                                                           footer={`Achieve by: ${moment(goal.achieve_by).format('MMM D, YYYY')}`}
                                                           link={`/profile/edit-goal/${goal.id}/p`}/>)}
            </div> : null}
        </div>
      </div>
    )
  }
}))
