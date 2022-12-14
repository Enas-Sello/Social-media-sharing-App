import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import { categories } from '../utils/data';
import client from '../client';
import Spinner from './Spinner';

const CreatePin = ({ user }) => {
  console.log(user);
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [loading, setLoading] = useState(false);
  const [destination, setDestination] = useState();
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];

    if (
      type === 'image/png' ||
      type === 'image/svg' ||
      type === 'image/jpeg' ||
      type === 'image/gif' ||
      type === 'image/tiff'
    ) {
      setWrongImageType(false);
      setLoading(true);

      //upload img to sanity and get it
      client.assets
        .upload('image', e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log('erro msg: ', err);
        });
    } else {
      setWrongImageType(true);
    }
  };


  //update db with the pin 
  const savePin = () => {
    if ( title && about && destination && imageAsset?._id && category )
    {
      //santity schema
      const doc = {
        _type: 'pin',
        title,
        about,
        destination,
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: 'postedBy',
          _ref: user._id,
        },
        category,
      };
      client.create(doc).then(() => {
        navigate('/');
      });
    } else {
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className="flex lg:-flex-row flex-col items-center justify-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <div className=" bg-secondaryColor p-3 flex flex-.7  w-full">
          <div className=" flex justify-center items-center flex-col border-2 border-gray-300 p- w-full h-420 border-dotted">
            {loading && <Spinner />}
            {wrongImageType && (
              <p className="text-red-500 mb-5 text-xl font-semibold transition-all duration-150 ease-in">
                wrong image type
              </p>
            )}
            {!imageAsset ? (
              <label>
                <div className=" flex flex-col items-center justify-center h-full ">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg font-semibold"> click to upload</p>
                  </div>
                  <p className="mt-20 text-gray-400">
                    Use high-quality JPG, JPEG, SVG, PNG, GIF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className=" relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="imageAsset"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  onClick={() => setImageAsset(null)}
                  className=" absolute bottom-3 right-3 text-dark  bg-white rounded-3xl p-3 text-xl hover:shadow-xl hover:bg-red-500 hover:text-white outline-none transition-all duration-500 ease-in-out cursor-pointer"
                >
                  <MdDelete />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-6 lg:pl-5 mt-5 w-full ">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className=" outline-none text-2xl sm:text-xl font-bold border-b-2 p-2 border-gray-200"
          />
          {user&& (
            <div className="flex gap-2 my-2 items-center bg-white rounded-lg ">
              <img
                src={user?.image}
                alt="user"
                className="bg-gray-600  w-8 h-8 object-cover rounded-full"
              />
              <p className="font-bold">{user?.userName}</p>
            </div>
          )}
          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell every one what your Pin is about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <input
            type="text"
            vlaue={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          />
          <div className="flex flex-col">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose Pin Category
              </p>
              <select
                onChange={(e) => {
                  setCategory(e.target.value);
                }}
                className=" outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white">
                  select Category
                </option>
                {categories.map((category) => (
                  <option
                    value={category.name}
                    className="text-base border-0 outline-none capitalize bg-white text-black "
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end items-end mt-5">
              {fields && (
                <p className="text-red-500 text-center mb-2 mr-2 text-lg transition-all duration-150 ease-in">
                  please fill all the fields .
                </p>
              )}
              <button
                type="button"
                onClick={savePin}
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePin;
