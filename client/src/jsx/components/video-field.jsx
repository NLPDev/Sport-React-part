import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {observer} from 'mobx-react'

class VideoField extends Component {


  updateVideoUrl = (ev) => {

    this.props.video.url = ev.target.value;
  }

  removeVideo = () => {

    this.props.removeVideo(this.props.video.id);
  }

  showError = () => {
    $(ReactDOM.findDOMNode(this.refs.me)).addClass('is-invalid-label');
    $(ReactDOM.findDOMNode(this.refs.formErr)).addClass('is-visible');
  }

  hideError = () => {
    $(ReactDOM.findDOMNode(this.refs.me)).removeClass('is-invalid-label');
    $(ReactDOM.findDOMNode(this.refs.formErr)).removeClass('is-visible');
  }

  render() {

    return <label ref="me" className="video-item">{this.props.video.name}

             {this.props.video.id ? <span className="psr-icons icon-remove"
                                          onClick={this.removeVideo}></span> :
                                    <textarea value={this.props.video.url}
                                              onChange={this.updateVideoUrl}
                                              placeholder="Paste your Youtube or Vimeo URL here"
                                              // onBlur={this.hideError}
                                              >
                                    </textarea>}
             <span className="form-error" ref="formErr">Please enter a valid youtube or vimeo video url.</span>
           </label>
  }
}

export default observer(VideoField)
