import React, { useState, useEffect, useRef } from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import client from '../client';
import { userQuery } from '../utils/data.js';
import logo from '../assets/logo.png';
//react icons
import { HiMenu } from 'react-icons/hi';
import { AiOutlineClose } from 'react-icons/ai';
//componants
import Sidebar from '../components/Sidebar';
import UserProfile from './UserProfile';
import Pins from '../pages/Pins';
import { fetchUser } from '../utils/fetchUser';

const Home = () => {
  const [toggle, setToggle] = useState(false);
  const [ user, setUser ] = useState( null );
  const scrollRef =useRef(null)
  //get userinfo from local storage
  const userInfo =
    fetchUser();
  //get user from sanity using deadmound useeffect
  useEffect(() => {
    const query = userQuery(userInfo?.googleId);
    client.fetch(query).then((data) => {
      // console.log(data);
      setUser(data[0]);
    });
  }, []);
 
  useEffect(() => {
   scrollRef.current.scrollTo(0,0)
  }, []);
 
  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transition-height duration-100 ease-out">
      <div className="hidden md:flex h-screen flex-initial shadow-xl">
        <Sidebar user={user && user} />
      </div>
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-xl">
          <HiMenu
            fontSize={30}
            className="cursor-pointer"
            onClick={() => setToggle(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Link to={`user-profile/${user?._id}`}>
            <img
              src={user?.image}
              alt="user-pic"
              className="w-9 h-9 rounded-full "
            />
          </Link>
        </div>
        {toggle && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-xl z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiOutlineClose
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggle(false)}
              />
            </div>
            <Sidebar closeToggle={setToggle} user={user && user} />
          </div>
        )}
      </div>
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <Routes>
          <Route
            path="/user-profile/:userId"
            element={<UserProfile user={user && user} />}
          />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
