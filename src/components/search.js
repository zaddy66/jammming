import React, { useState } from 'react';
import SearchBar from './SearchBar';
import Tracklist from './Tracklist';
import SearchResult from './SearchResult';

function SearchComponent({ details }) {
  const [searchField, setSearchField] = useState('');

  const filteredSongs =
    searchField.trim() === ''
      ? []
      : details.filter((song) => {
          return (
            song.name.toLowerCase().includes(searchField.toLowerCase()) ||
            song.artist.toLowerCase().includes(searchField.toLowerCase()) ||
            song.album.toLowerCase().includes(searchField.toLowerCase())
          );
        });

  function onChange(e) {
    console.log('changing');
  }

  function onSubmit(e) {
    const searchInput = document.querySelector('.search-input');
    e.preventDefault();
    console.log(searchInput.value);
    setSearchField(searchInput.value);
  }

  return (
    <>
      <SearchBar onChange={onChange} onSubmit={onSubmit} />
      <div className='bottom-column'>
        <div className='column search-result-wrap'>
          <h2>Results</h2>
          <SearchResult filteredSongs={filteredSongs} />
        </div>
        <Tracklist />
      </div>
    </>
  );
}

export default SearchComponent;
