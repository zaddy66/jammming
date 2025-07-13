import React from 'react';

function Track(props) {
  return (
    <div className='result-item' data-index={props.id} uri={props.uri}>
      <h2 className='song-name'>{props.name}</h2>
      <div className='result-sub-cat'>
        <p className='song-artist'>{props.artist}</p>
        <p className='song-album'>{props.album}</p>
        <button onClick={props.addButnClicked} className='button add-butn'>
          {props.buttonTxt}
        </button>
      </div>
    </div>
  );
}

export default Track;
