import React from 'react';
import Track from './Track';

function SearchResult({ filteredSongs }) {
  const filtered = filteredSongs.map((song) => (
    <Track key={song.id} song={song} />
  ));
  return <div className='result-playlist'>{filtered}</div>;
}

export default SearchResult;
