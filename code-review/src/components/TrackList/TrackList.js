import React, { Component } from 'react';
import './TrackList.css';

import Track from '../Track/Track';

class TrackList extends Component {
  render() {
    return (
      <div className="TrackList">
        {this.props.tracks.map( track => <Track track={track} key={track.id} onAdd={this.props.onAdd} isRemove={this.props.isRemove}  onRemove={this.props.onRemove} /> )} 
      </div>
    );
  }
}

export default TrackList;


// TrackList.propTypes = {
//   tracks: React.PropTypes.array.isRequired,
//   // onAdd: React.PropTypes.function.isRequired,
// };

// without defining default props, the second TrackList (our playlist) would shortly have undefined props and throw an error during render.
TrackList.defaultProps = {
  tracks: [],
  onAdd: function(){},
  onRemove: function(){},
  isRemove: false,
};
