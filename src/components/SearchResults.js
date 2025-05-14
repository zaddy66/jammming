import React from 'react';
import Playlist from './Playlist';

function SearchResult() {
  return (
    <div className='column search-result-wrap'>
      <h2>Results</h2>
      <Playlist />
    </div>
  );
}

export default SearchResult;
