import React from 'react';

function LoginPopup({ handleLogin }) {
  return (
    <div className='popup'>
      <div className='popup-content'>
        <a href='/change' onClick={handleLogin} id='spotify-login'>
          Login with Spotify
        </a>
      </div>
      <div className='popupBg'></div>
    </div>
  );
}

export default LoginPopup;
