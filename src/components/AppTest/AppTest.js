import React, { useEffect, useState } from 'react';
import SearchBar from '../SearchBar2/SearchBar';
import { spotifyAuth } from '../utils/spotify';
import Spotify from '../utils/spotify';
import Track from '../Track';

function AppTest() {
  const [isTokenReady, setIsTokenReady] = useState(false);
  const [searchItems, setSearchItems] = useState([]);
  const [playlistTrack, setPlaylistTrack] = useState([]);

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

  function addToPlayList(e) {
    console.log('hello');
    const trackItem = e.target.closest('.result-item');
    trackItem.style.pointerEvents = 'none';
    const trackItemAttr = trackItem.getAttribute('data-index');

    //Filter items
    searchItems.filter((item) => {
      if (item.id !== trackItemAttr) return false;
      const newTracks = {
        uri: item.uri,
        id: item.id,
        name: item.name,
        artist: item.artist,
        album: item.album,
      };
      setPlaylistTrack((prev) => [...prev, newTracks]);
      return true;
    });
  }

  function removeFromPlaylist(e) {
    console.log('removing...');
    const playListItem = e.target.closest('.result-item');
    console.log(playListItem);
    const playListItemAttr = playListItem.getAttribute('data-index');
    const trackItem = document.querySelector(
      `.result-item[data-index='${playListItemAttr}']`
    );

    trackItem.style.pointerEvents = 'auto';
    playListItem.remove();
    console.log(trackItem);
  }

  return (
    <>
      <SearchBar onSearch={search} />
      <div className='bottom-column'>
        <div className='column search-result-wrap'>
          <h2>Results</h2>
          <div className='result-playlist'>
            {searchItems.map((item) => (
              <Track
                // key={item.id}
                uri={item.uri}
                id={item.id}
                name={item.name}
                artist={item.artist}
                album={item.album}
                buttonTxt='Add'
                addButnClicked={addToPlayList}
              />
            ))}
          </div>
        </div>
        <div className='column track-result-wrap'>
          <input
            id='playlist-name'
            className='playlist-name'
            type='text'
          ></input>
          <div className='track-inner-column'>
            {playlistTrack.map((item) => (
              <Track
                // key={item.id}
                uri={item.uri}
                id={item.id}
                name={item.name}
                artist={item.artist}
                album={item.album}
                buttonTxt='remove'
                addButnClicked={removeFromPlaylist}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default AppTest;
