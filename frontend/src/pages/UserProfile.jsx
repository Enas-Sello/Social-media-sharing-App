import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from '../utils/data';
import client from '../client';
import MasonryLayout from '../components/MasonryLayout';
import Spinner from '../components/Spinner';

const activeBtnStyles =
  'bg-red-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
  'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [userpfofile, setUserPfofile] = useState();
  const [pins, setPins] = useState();
  const [text, setText] = useState('Created');
  const [activeBtn, setActiveBtn] = useState('created');

  //cover
  const cover =
    'https://source.unsplash.com/1600x900/?nature,photography,technology,health';

  //Logout
  const Logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    const query = userQuery(userId);
    client.fetch(query).then((data) => {
      setUserPfofile(data[0]);
    });
  }, [userId]);

  //saved and created
  useEffect(() => {
    if (text === 'Created') {
      const createdPinsQuery = userCreatedPinsQuery(userId);

      client.fetch(createdPinsQuery).then((data) => {
        setPins(data);
      });
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);

      client.fetch(savedPinsQuery).then((data) => {
        setPins(data);
      });
    }
  }, [text, userId]);
  if (!user) {
    return <Spinner message={'lodaing Profile ...'} />;
  }
  return (
    <div className=" relative pb-2 h-full justify-center items-center">
      <div className="flex flex-col pb-5">
        <div className=" relative flex flex-col mb-7">
          <div className="flex flex-col justify-center items-center">
            <img
              src={cover}
              alt="cover"
              className="w-full h-370 2xl:h-510 shadow-xl object-cover"
            />{' '}
            <img
              src={user.image}
              alt="profile"
              className=" bg-slate-800 rounded-full w-20 h-20 -mt-10 shadow-xl object-cover"
            />
            <h1 className="font-bold text-xl text-center mt-3">
              {user.userName}
            </h1>
            <div className=" absolute top-0 right-0 p-2 z-1">
              {userId === user._id && (
                <GoogleLogout
                  clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                  render={(renderProps) => (
                    <button
                      type="button"
                      className="bg-mainColor flex justify-center items-center gap-2 p-2 rounded-lg cursor-pointer outline-none shadow-md opacity-75 hover:opacity-100"
                      onClick={renderProps.onClick}
                      disabled={renderProps.disabled}
                      onTouchCancel={false}
                    >
                      <AiOutlineLogout color="red" fontSize={21} /> Sign out
                    </button>
                  )}
                  onLogoutSuccess={Logout}
                  cookiePolicy="single_host_origin"
                />
              )}
            </div>
          </div>
          <div className="text-center mb-7 mt-3">
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('created');
              }}
              className={`${
                activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              Created
            </button>
            <button
              type="button"
              onClick={(e) => {
                setText(e.target.textContent);
                setActiveBtn('saved');
              }}
              className={`${
                activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles
              }`}
            >
              saved
            </button>
          </div>
          {pins?.length ? (
            <div className="px-2">
              <MasonryLayout pins={pins} />
            </div>
          ) : (
            <div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
              No Pins Found!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
