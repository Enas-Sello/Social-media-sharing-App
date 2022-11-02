import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import { IoIosArrowForward } from 'react-icons/io';
import logo from '../assets/logo.png';
import { categories } from '../utils/data';

const isNotActiveStyle =
  'flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';

const isActiveStyle =
  'flex items-center px-5 gap-3 font-extrabold border-l-2 border-black  transition-all duration-200 ease-in-out capitalize';

const Sidebar = ({ closeToggle, user }) => {
  const handelcloseToggle = () => {
    if (handelcloseToggle) handelcloseToggle(false);
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar">
      <div className="flex flex-col">
        <Link
          to="/"
          className="flex px-5 pt-1 gap-2 my-6 w-109 items-center"
          onClick={handelcloseToggle}
        >
          <img src={logo} alt="logo" className="w-32" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveStyle : isNotActiveStyle
            }
            onClick={handelcloseToggle}
          >
            <RiHomeFill />
            Home
          </NavLink>
          <h3 className="mt-1 px-5 text-base 2xl:text-xl">
            discover cateogries
          </h3>
          {/* categories */}
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              to={`category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveStyle : isNotActiveStyle
              }
              key={category.name}
              onClick={handelcloseToggle}
            >
              <IoIosArrowForward />
              <img
                src={category?.image}
                alt="user-profile"
                className="rounded-full w-8 h-8"
              />
              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {/* user  */}
      {user && (
        <Link
          to={`user-profile/${user._id}`}
          className="flex items-center my-6 mx-3 gap-4 bg-gray-200 rounded-lg drop-shadow-2xl  w-fit p-2"
          onClick={handelcloseToggle}
        >
          <img
            src={user?.image}
            alt="user-profile"
            className="rounded-full w-10 h-10"
          />
          <p>{user?.userName}</p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
