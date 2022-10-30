import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import client from '../client';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/share.mp4';
import logowhite from '../assets/logowhite.png';
import { gapi } from 'gapi-script';
const Login = () => {
  const navigate = useNavigate();
  //google sigin fix
  window.gapi.load('client:auth2', () => {
    window.gapi.client.init({
      clientId: process.env.REACT_APP_GOOGLE_API_TOKEN,
      plugin_name: 'chat',
    });
  });
  //google signin func
  const responseGoogle = (response) => {
    console.log(response);
    localStorage.setItem('user', JSON.stringify(response.profileObj));
    const { name, googleId, imageUrl } = response.profileObj;
    const doc = {
      _id: googleId,
      _type: 'user',
      userName: name,
      image: imageUrl,
    };
    //conect google signin to back end
    client.createIfNotExists(doc).then(() => {
      navigate('/', { replace: true });
    });
  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />

        <div className="absolute right-0 bottom-0 top-0 left-0 flex flex-col justify-center items-center bg-blackOverlay">
          <div className="p-5">
            <img src={logowhite} alt="logo" width="130px" />
          </div>
          <div className=" shadow-2xl">
            <GoogleLogin
              clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  onTouchCancel={false}
                >
                  <FcGoogle className="mr-4" /> Sign in with google
                </button>
              )}
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
              cookiePolicy="single_host_origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
