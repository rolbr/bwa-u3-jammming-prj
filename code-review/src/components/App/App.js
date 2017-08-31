import React, { Component } from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

import Spotify from '../../util/Spotify';
let spotify = null;

class App extends Component {
  constructor(props){
    super(props);

    spotify = new Spotify();

    // hardcoded. TODO: make dynamic
    let tracks = [
      // {id: Math.random().toString(), name:'Tiny Dancer', artist:'Elton John', album:'Madman Across The Water',},
      // {id: Math.random().toString(), name:'The Water', artist:'Tiny Dancer', album:'Elton John',},
      // {id: Math.random().toString(), name:'Elton John', artist:'Tiny Dancer', album:'Madman Across',},
      // {id: Math.random().toString(), name:'Madman', artist:'Across The Water', album:'Tiny Dancer',},
    ];

    this.state = {
      searchResults: tracks,
      playlistName: 'New Playlist',
      playlistTracks: [],
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }


  addTrack( track ) {
    let tracks = this.state.playlistTracks;
    let exists = tracks.some( t => t.id === track.id );
    if (!exists) { tracks.push( track ) };

    // TODO: do we really need setState?
    // EDIT: Yep, we do :/
    this.setState({
      playlistTracks: tracks
    });
  }


  removeTrack( track ) {
    console.log('A removeTrack', track, this.state.playlistName );

    let tracks = this.state.playlistTracks.filter( t => t.id !== track.id );

    this.setState({
      playlistTracks: tracks
    });
  }


  updatePlaylistName( name ) {
    this.setState({
      playlistName: name
    });
  }


  savePlaylist(){
    let trackURIs = this.state.playlistTracks.map( t => {return 'spotify:track:'+t.id} );
    // console.log('A savePlaylist', trackURIs)
    // return trackURIs;

    let that = this;

    spotify.savePlaylist( this.state.playlistName, trackURIs, () => {
      console.log( 'successfully saved playlist to spotify !' )
      
      // reset
      that.setState({
        playlistName: 'New Playlist', // TODO: this doesn't get updated in Playlist.js ?!
        playlistTracks: [] // this does ✔
      });

    });
  }


  search( term ) {
    console.log('A search', term);

    let that = this;

    spotify.search( term, (results) => {
      that.setState({
        searchResults: results
      });
    });

  }


  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults results={this.state.searchResults} onAdd={this.addTrack} onRemove={this.removeTrack} />
            <Playlist name={this.state.playlistName} tracks={this.state.playlistTracks} onRemove={this.removeTrack} 
                      onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
