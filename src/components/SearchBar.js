import React from 'react';

function SearchBar({ onChange, onSubmit }) {
  return (
    <>
      <form className='search-form' onSubmit={onSubmit}>
        <input
          onChange={onChange}
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
