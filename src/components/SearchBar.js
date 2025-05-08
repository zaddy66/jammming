import React from 'react';

function SearchBar() {
  return (
    <form className='search-form'>
      <input className='search-input' type='text' value='' />
      <input className='submit-butn' type='submit' value='SEARCH' />
    </form>
  );
}

export default SearchBar;
