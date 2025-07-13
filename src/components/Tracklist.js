import React from 'react';

function Tracklist({
  playlistTrack,
  removeItem,
  submitToSpotify,
  spotifyLoginHref,
}) {
  return (
    <div className='column track-result-wrap'>
      <input id='playlist-name' className='playlist-name' type='text'></input>
      <div className='track-inner-column'>
        {playlistTrack.map((track) => (
          <div key={track.id} data-index={track.id} className='result-item'>
            <h2 className='song-name'>{track.song}</h2>
            <div className='result-sub-cat'>
              <p className='song-artist'>{track.artist}</p>
              <p className='song-album'>{track.album}</p>
              <button
                onClick={() => removeItem(track.id)}
                className='button remove-butn'
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <button id='spotify-button' onClick={submitToSpotify}>
        Save to spotify
      </button>
    </div>
  );
}

export default Tracklist;
