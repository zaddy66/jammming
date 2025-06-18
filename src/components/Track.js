import React from 'react';

function Track(props) {
  return (
    // <div className='result-playlist'>
    //   {filterSongs.map((song) => (
    //     <div className='result-item' key={song.id} data-index={song.id}>
    //       <h2 className='song-name'>{song.name}</h2>
    //       <div className='result-sub-cat'>
    //         <p className='song-artist'>{song.artist}</p>
    //         <p className='song-album'>{song.album}</p>
    //         <button onClick={addButnClicked} className='button add-butn'>
    //           Add
    //         </button>
    //       </div>
    //     </div>
    //   ))}
    // </div>

    <div className='result-item' data-index={props.id}>
      <h2 className='song-name'>{props.name}</h2>
      <div className='result-sub-cat'>
        <p className='song-artist'>{props.artist}</p>
        <p className='song-album'>{props.album}</p>
        <button onClick={props.addButnClicked} className='button add-butn'>
          Add
        </button>
      </div>
    </div>
  );
}

export default Track;
