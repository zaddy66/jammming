import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar2/SearchBar';
import { spotifyAuth } from '../utils/spotify';
import Spotify from '../utils/spotify';
import Track from '../Track';

function AppTest() {
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [searchItems, setSearchItems] = useState([]);

  useEffect(() => {
    spotifyAuth().then(() => {
      const token = localStorage.getItem('access_token');
      if (token) {
        setIsTokenReady(true);
      }
    });
  }, []);

  //SEARCH ITEMS
  const search = async (term) => {
    if (!isTokenReady) {
      console.log('Token not ready');
    }
    console.log(`Searching for: ${term}`);
    const tracks = await Spotify.search(term);
    console.log(tracks);
    setSearchItems(tracks);
  };

  return (
    <>
      <SearchBar onSearch={search} />
      <div className='bottom-column'>
        <div className='column search-result-wrap'>
          <h2>Results</h2>
          <div className='result-playlist'>
            {searchItems.map((item) => (
              <Track
                key={item.id}
                uri={item.uri}
                id={item.id}
                name={item.name}
                artist={item.artist}
                album={item.album}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AppTest;
