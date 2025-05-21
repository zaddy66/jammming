import React from 'react';

function Track({ song }) {
  return (
    <div className='result-item'>
      <h2>{song.name}</h2>
      <div className='result-sub-cat'>
        <p>{song.artist}</p>
        <p>{song.album}</p>
        <button className='add-butn'>Add</button>
      </div>
    </div>
  );
}

export default Track;
