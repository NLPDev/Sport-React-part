import React, {Component} from 'react'
import ReactDOM from 'react-dom'
import {Link} from 'react-router-dom'
import {extendObservable} from 'mobx'
import {observer} from 'mobx-react'

import Api from '../../api'
import UploadedFile from './uploaded-file'

class Attachments extends Component {

  constructor() {
    super();
    extendObservable(this,
                      { 
                        newFiles: [],
                        filesToDelete: [],
                        fileError: false
                      });
  }

  isFileValid = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const supportFormat = ["pdf", "jpg", "jpeg","png", "mp4", "docx"];
    return supportFormat.indexOf(ext) > -1 && file.size <= 4 * 1024 * 1024;
  }

  addFile = (e) => {

    const file = e.target.files[0];
    if(this.isFileValid(file)) {
      this.fileError = false;
      this.newFiles.push(file)
    } else {
      this.fileError = true;
    }
  }

  removeFile = (file) => {
    
    if (file.id) {
      this.filesToDelete.push(file.id);
      const index = this.props.oldFiles.findIndex(f => f == file);
      this.props.oldFiles.splice(index, 1);
    } else {
      const index = this.newFiles.findIndex(f => f == file);
      this.newFiles.splice(index, 1);
    }
  }

  getFilesToDelete = () => {
    return this.filesToDelete;
  }

  getFilesToAdd = () => {
    return this.newFiles;
  }

  render() {

    return (
      <div>
        <h3 className="small-heading light-text">Attachments</h3>
        <p className="small">
          File types supported at the moment: <b>.pdf, .jpg, .png, mp4, .docx</b><br/>
          Max file size: <b>4mb</b>
        </p>
        <div className="file-list">
          {this.props.oldFiles.map((file, index) => <UploadedFile file={file}
                                                                  key={index}
                                                                  removeFile={this.removeFile}/>)}
          {this.newFiles.map((file, index) => <UploadedFile file={file}
                                                            key={index}
                                                            removeFile={this.removeFile}/>)}
        </div>
        <div className="upload-wrap">
          <p className={"form-error" + (this.fileError ? " visible" : "")}>
            Flag on the play! Your file type is too big or something we don't support.
            Try uploading a smalller file size or a different type of file.</p>
          <label htmlFor="file" className="underline">Upload a file</label>
          <input type="file" className="show-for-sr" id="file"
                 onChange={this.addFile}/>
        </div>
      </div>
    )
  }
}

export default observer(Attachments)
