import React, { Component } from 'react';
import './Playlist.css';

import TrackList from '../TrackList/TrackList';

class Playlist extends Component {

  constructor(props) {
    super(props);
    this.handleNameChange = this.handleNameChange.bind(this); // instructions: onNameChange() ?
  }

  handleNameChange( e ) {
    this.props.onNameChange( e.target.value );
  }


  render() {
    return (
      <div className="Playlist">
        <input defaultValue={this.props.name} onChange={this.handleNameChange}/>
        <TrackList tracks={this.props.tracks} isRemove onRemove={this.props.onRemove} />
        <a className="Playlist-save" onClick={this.props.onSave}> SAVE TO SPOTIFY </a>
      </div>
    );
  }
}

export default Playlist;