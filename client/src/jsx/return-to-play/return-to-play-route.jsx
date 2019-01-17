import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Route, Switch, Link} from 'react-router-dom'
import {extendObservable, computed} from 'mobx'
import {observer, inject} from 'mobx-react'
import { CSSTransitionGroup } from 'react-transition-group'

import Api from '../api'
import ReturnToPlay from './return-to-play'
import AddNote from './add-note'
import EditNote from './edit-note'
import ViewNote from './view-note'
import Header from '../components/header'
import Sidebar from '../components/sidebar'
import Footer from '../components/footer'



export default inject('user', 'setUser')(observer(class extends Component {

  constructor() {

    super();
    extendObservable(this,
                     { user: computed(() => this.props.user) });
  }

  componentWillMount() {
    $('.reveal-overlay').remove();
  }

  componentDidMount() {
    if(!this.props.user) {
      Api.getUser()
        .then(user => {
          this.props.setUser(user);
        })
        .catch(err => this.props.history.push('/login'));
    } else {

    }
  }

  componentWillUnmount(){
    $('body').scrollTop(0);
  }

  render() {

    return (
      <div className={"content-container return-to-play " + (this.user ? this.user.user_type : "")}>
        <div className="row expanded">
          <div className="column show-for-large sidebar-container">
            <Sidebar curActive="ReturnToPlay" history={this.props.history}/>
          </div>

          <div className="column content-right">
            <Header pageTitle="Athelete Log" curActive="ReturnToPlay" history={this.props.history} showProfile={true}/>

            <CSSTransitionGroup className="transition-container"
                                transitionName='dashboard-transition'
                                transitionEnterTimeout={500}
                                transitionLeaveTimeout={300} >
              <Switch key={this.props.location.pathname} location={this.props.location}>
                <Route exact path='/athlete-log' component={ReturnToPlay} />
                <Route exact path='/athlete-log/add-note' component={AddNote} />
                <Route exact path='/athlete-log/edit-note/:type/:id' component={EditNote} />
                <Route exact path='/athlete-log/view-note/:type/:id/:coachId?' component={ViewNote} />
               </Switch>
             </CSSTransitionGroup>

          </div>

        </div>
        <Footer />
      </div>
    )
  }
}))
