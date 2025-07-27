import generateRandomString from './generateRandomString';
import { sha256, base64encode } from './generateCodeChallenge';

const Spotify = {
  client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
  redirect_URI: 'http://127.0.0.1:8000/callback',
  scopes: 'playlist-modify-public',
  state: generateRandomString(16),
  //CODE VERIFIER
  codeVerifier: generateRandomString(64),

  search: async (term) => {
    const accessToken = localStorage.getItem('access_token');
    const apiUrl = `https://api.spotify.com/v1/search?q=${term}&type=track`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        if (jsonResponse.tracks) {
          const tracks = jsonResponse.tracks.items;
          return tracks.map((item) => ({
            uri: item.uri,
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            album: item.album.album_type,
          }));
        }
        return [];
      }
    } catch (err) {
      console.error('Error searching for tracks:', err);
    }
  },

  getUserID: async () => {
    const accessToken = localStorage.getItem('access_token');
    const apiUrl = `https://api.spotify.com/v1/me`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: headers,
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.id;
      }
    } catch (err) {
      console.error('Error fetching the user ID:', err);
    }
  },
  createPlaylist: async (userID, playlistName) => {
    const accessToken = localStorage.getItem('access_token');
    const apiUrl = `https://api.spotify.com/v1/users/${userID}/playlists`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const data = JSON.stringify({
      name: playlistName,
      description: 'Custom playlist with jamming',
    });

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: data,
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse.id;
      }
    } catch (err) {
      console.error(`couldn't add playlist: ${err}`);
    }
  },

  addTracksToPlaylist: async (playlistID, trackURIs) => {
    const accessToken = localStorage.getItem('access_token');
    const apiUrl = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const data = JSON.stringify({
      uris: trackURIs,
    });
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: data,
      });
      if (response.ok) {
        console.log('Tracks added to the playlist successfully');
      }
    } catch (err) {
      console.error(`Error adding items to playlist: ${err}`);
    }
  },
};

export async function spotifyAuth() {
  const urlParams = new URLSearchParams(window.location.search);
  let code = urlParams.get('code');

  // console.log(code);

  if (code) {
    await Spotify.getAccessToken(code);
    return;
  }

  const accessToken = localStorage.getItem('access_token');

  function isAccessTokenValid() {
    const expiresAt = localStorage.getItem('access_token_expires_at');
    return expiresAt && Date.now() < Number(expiresAt);
  }
  console.log(accessToken);
  if (!accessToken || !isAccessTokenValid()) {
    console.log('is logged out');
    const hashed = await sha256(Spotify.codeVerifier);
    const codeChallenge = base64encode(hashed);
    const authURL = new URL('https://accounts.spotify.com/authorize');

    // storing in localStorage
    window.localStorage.setItem('code_verifier', Spotify.codeVerifier);

    const params = {
      response_type: 'code',
      client_id: Spotify.client_id,
      scope: Spotify.scopes,
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: Spotify.redirect_URI,
    };

    authURL.search = new URLSearchParams(params).toString();
    window.location.href = authURL.toString();
    return;
  }
}

Spotify.getAccessToken = async (code) => {
  // stored in the previous step
  const codeVerifier = localStorage.getItem('code_verifier');

  const url = 'https://accounts.spotify.com/api/token';
  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: Spotify.client_id,
      grant_type: 'authorization_code',
      code,
      redirect_uri: Spotify.redirect_URI,
      code_verifier: codeVerifier,
    }),
  };

  const body = await fetch(url, payload);
  const response = await body.json();

  // console.log(response.access_token);

  if (response.access_token && response.expires_in) {
    const expiresAt = Date.now() + response.expires_in * 1000;
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('access_token_expires_at', expiresAt.toString());
  }

  window.history.replaceState(null, '', '/callback');
};

export default Spotify;
