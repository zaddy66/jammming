import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Tracklist from './Tracklist';
import Track from './Track';

const spotifyClientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;

function SearchComponent({ details }) {
  //USE STATES
  const [searchField, setSearchField] = useState('');
  const [playlistTrack, setPlaylistTrack] = useState([]);
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    const authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body:
        'grant_type=client_credentials&client_id=' +
        spotifyClientId +
        '&client_secret=' +
        spotifyClientSecret,
    };
    fetch('https://accounts.spotify.com/api/token', authParameters)
      .then((result) => result.json())
      .then((tokenResponse) => {
        console.log(tokenResponse.access_token);
        setToken(tokenResponse.access_token);
      });
  }, []);

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

  async function onSubmit(e) {
    const searchInput = document.querySelector('.search-input');
    e.preventDefault();
    const values = searchInput.value;
    // console.log(searchInput.value);
    setSearchField(values);
    console.log(values);

    //get request using search to get the artist ID
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    };

    var returnedTracks = await fetch(
      'https://api.spotify.com/v1/search?q=' + values + '&type=track',
      searchParameters
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.tracks.items);
        setTracks(data.tracks.items);
      });

    //Display those albums to users
  }

  // console.log(tracks);

  function addToPlayList(e) {
    const parent = e.target.closest('.result-item');
    parent.style.pointerEvents = 'none';
    // console.log('adding');

    const parentAttr = Number(parent.getAttribute('data-index'));
    details.filter((track) => {
      if (track.id !== parentAttr) return false;
      else {
        const newTrack = {
          id: track.id,
          song: track.name,
          artist: track.artist,
          album: track.album,
        };
        console.log(newTrack);
        setPlaylistTrack((prev) => [...prev, newTrack]);
        return true;
      }
    });
  }

  function removeItem(indexToRemove) {
    const resultPlaylist = document.querySelector('.result-playlist');
    const resultItem = resultPlaylist.querySelector(
      `.result-item[data-index="${indexToRemove}"]`
    );
    resultItem.style.pointerEvents = 'auto';
    console.log(resultItem);
    setPlaylistTrack((prev) =>
      prev.filter((item) => item.id !== indexToRemove)
    );
  }

  return (
    <>
      <SearchBar onChange={onChange} onSubmit={onSubmit} />
      <div className='bottom-column'>
        <div className='column search-result-wrap'>
          <h2>Results</h2>

          <Track addButnClicked={addToPlayList} filterSongs={filteredSongs} />
        </div>
        <Tracklist playlistTrack={playlistTrack} removeItem={removeItem} />
      </div>
    </>
  );
}

export default SearchComponent;
