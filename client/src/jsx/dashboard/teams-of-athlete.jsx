import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'

import Api from '../api'
import ContentCard from './components/content-card'
import AvatarTeam from '../../images/avatar-team.png'
// import TeamLogo from '../../images/team-logo.png'

const EmptyCard = (props) => (
        <div>
          <h2 className="content-heading text-center">
            Sports is all about team. With your Personal Sport Record you can
            connect with teams and coaches to record the data that maters.
          </h2>
          <div className="team-empty-state text-center">
            <p>Once connected to your team you can: </p>
            <p>1. Get invaluable feedback and data from your coach.</p>
            <p>2. See how you're doing vs. the rest of your team and how you're improving.</p>
          </div>

          <ContentCard forEmpty={true}
                       name="Team Name"
                       tagline="catchphease"
                       themeColor="team-empty"
                       avatar={null}
                       sports={["Sport"]} />
        </div>
)

export default inject('user')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { curSubCat: 0,
                       isCoach: computed(() => this.props.user && 'coach' == this.props.user.user_type),
                       skillSets: computed(() => { return DP.constructSkillSet(this.props.assDefs,
                                                                               this.props.assessments,
                                                                               'general-leadership',
                                                                               0,
                                                                               true) }),
                       subCats: computed(() => this.skillSets.map(ss => ss.setName)),
                       skillsMentalA: computed(() => {
                                        return DP.getSkillsMental(this.skillSets,
                                                                  this.curSubCat,
                                                                  true);
                                      }),
                       skillsMentalC: computed(() => {
                                        return DP.getSkillsMental(this.skillSets,
                                                                  this.curSubCat,
                                                                  false);
                                      })
                     });
  }

  componentDidMount() {

  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  setSubCat = (ev, index) => {

    $(ev.target).siblings().removeClass("active");
    $(ev.target).addClass("active");
    this.curSubCat = index;
  }

  renderCards = () => {

    if (!this.props.user) return null;

    if (this.props.user.team_memberships.length) {

      return (
        <div className="group-section">
          <h3 className="group-heading">My Teams</h3>
          {this.props.user.team_memberships.map(team =>

            <ContentCard name={team.name}
                         sports={[team.sport]}
                         avatar={team.team_picture_url || AvatarTeam}
                         tagline={team.tagline}
                         season={team.season}
                         themeColor='red'/>
          )}
        </div>
      )

    } else {
      return <EmptyCard />
    }
  }

  render() {

    return (
      <div ref="me">
        <div className="row align-center main-content-container">
          <div className="column content-column">


            {this.renderCards()}
          </div>
        </div>
      </div>
    )
  }
}))
