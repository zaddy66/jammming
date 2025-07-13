import React, { useState, useEffect } from 'react';
import SearchBar from './SearchBar';
import Tracklist from './Tracklist';
import Track from './Track';
import generateRandomString from './utils/generateRandomString';
import LoginPopup from './popup';
// import spotify from './utils/spotify';

//STATES
const state = generateRandomString(16);
const spotifyClientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
const scopes = 'user-read-email playlist-read-private';
const redirectURI = 'http://127.0.0.1:8000/callback';
const authURL = `https://accounts.spotify.com/authorize?client_id=${spotifyClientId}&response_type=code&redirect_uri=${encodeURIComponent(
  redirectURI
)}&scope=${encodeURIComponent(scopes)}&state=${state}`;

function SearchComponent({ details }) {
  //USE STATES
  // const [searchField, setSearchField] = useState('');
  const [playlistTrack, setPlaylistTrack] = useState([]);
  const [token, setToken] = useState('');
  const [tracks, setTracks] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    window.location.href = authURL;
  };

  // const bodyLogin = new URLSearchParams({
  //   grant_type: 'authorization_code',
  //   code: authorizationCode,
  //   redirect_uri: redirectURI,
  //   client_id: spotifyClientId,
  //   client_secret: spotifyClientSecret,
  // });

  // await fetchWebApi(
  //   'https://accounts.spotify.com/api/token',
  //   'POST',
  //   bodyLogin
  // );

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

  function onChange(e) {
    console.log('changing');
  }

  async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    });
    return await res.json();
  }

  async function onSubmit(e) {
    const searchInput = document.querySelector('.search-input');
    e.preventDefault();
    const values = searchInput.value;
    console.log(values);

    await fetchWebApi('v1/search?q=' + values + '&type=track', 'GET')
      // .then((response) => response.json())
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

    const parentAttr = parent.getAttribute('data-index');
    // console.log(parentAttr);
    tracks.filter((track) => {
      // console.log(track.id);
      if (track.id !== parentAttr) return false;
      else {
        const newTrack = {
          id: track.id,
          uri: track.uri,
          song: track.name,
          artist: track.artists[0].name,
          album: track.album.album_type,
        };
        // console.log(newTrack);
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
    // console.log(resultItem);
    setPlaylistTrack((prev) =>
      prev.filter((item) => item.id !== indexToRemove)
    );
  }

  //SUBMIT TO SPOTIFY FUNCTION
  async function submitToSpotify(e) {
    // console.log('clicking');
    e.preventDefault();
    const playlistName = document.getElementById('playlist-name');
    if (playlistName.value === '') {
      console.log('Give a Playlist name');
    } else {
      const uriArray = [];
      const savingPlaylistName = playlistName.value;
      playlistTrack.map((track) => uriArray.push(track.uri));
      console.log(uriArray);

      // await handleLogin();

      //get user ID
      const { id: user_id } = fetchWebApi('v1/me', 'GET');

      //playlist parameter
      const playlist = await fetchWebApi(
        `v1/users/${user_id}/playlists`,
        'POST',
        {
          name: `${savingPlaylistName}`,
          description:
            'Playlist created by the tutorial on developer.spotify.com',
          public: false,
        }
      );

      return playlist;
    }
  }

  return (
    <>
      <LoginPopup handleLogin={handleLogin} />
      <SearchBar onChange={onChange} onSubmit={onSubmit} />
      <div className='bottom-column'>
        <div className='column search-result-wrap'>
          <h2>Results</h2>
          <div className='result-playlist'>
            {tracks.map((song) => (
              <Track
                key={song.id}
                uri={song.uri}
                id={song.id}
                name={song.name}
                artist={song.artists[0].name}
                album={song.album.album_type}
                addButnClicked={addToPlayList}
              />
            ))}
          </div>
        </div>
        <Tracklist
          playlistTrack={playlistTrack}
          removeItem={removeItem}
          submitToSpotify={submitToSpotify}
        />
      </div>
    </>
  );
}

export default SearchComponent;
