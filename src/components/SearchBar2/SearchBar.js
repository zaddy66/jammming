import React, { useState } from 'react';

function SearchBar({ onSearch }) {
  const [searchItem, setSearchItem] = useState('');
  function onSubmit(e) {
    e.preventDefault();
    if (searchItem) {
      onSearch(searchItem);
    }
  }
  return (
    <>
      <form className='search-form' onSubmit={onSubmit}>
        <input
          onChange={(e) => {
            setSearchItem(e.target.value);
          }}
          className='search-input'
          type='text'
          placeholder='Search...'
        />
        <button type='submit' className='submit-butn'>
          Search
        </button>
      </form>
    </>
  );
}

export default SearchBar;
