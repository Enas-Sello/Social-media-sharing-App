import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client, { urlFor } from '../client';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { fetchUser } from '../utils/fetchUser';

const Pin = ({ pin: { postedBy, image, destination, _id, save } }) => {
  // console.log(pin.image.asset.url);
  const navigate = useNavigate();
  const [postHovered, setPostHovered] = useState(false);
  const [savingPost, setSavingPost] = useState(false);

  //get alreadySave
  const userInfo = fetchUser();
  // console.log(postedBy);
  const alreadySaved = !!save?.filter(
    (item) => item.postedBy._id === userInfo.googleId
  )?.length;

  const savePin = (id) => {
    if (!alreadySaved) {
      setSavingPost(true);

      client
        .patch(id)
        .setIfMissing({ save: [] })
        .insert('after', 'save[-1]', [
          {
            _key: uuidv4(),
            userId: userInfo?.googleId,
            postedBy: {
              _type: 'postedBy',
              _ref: userInfo?.googleId,
            },
          },
        ])
        .commit()
        .then(() => {
          window.location.reload();
          setSavingPost(false);
        });
    }
  };

  const deletePin = (id) => {
    client.delete(id).then(() => {
      window.location.reload();
    });
  };
  return (
    <div className="m-2">
      <div
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden translate-all   ease-outdu"
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => {
          navigate(`/pin-details/${_id}`);
        }}
      >
        <img
          src={urlFor(image).width(250).url()}
          alt="user-post"
          className=" rounded-xl w-full"
        />
        {postHovered && (
          <div className="absolute bg-black opacity-75 top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex justify-center items-center text-dark text-2xl opacity-75 hover:opacity-100 hover:shadow-2xl  outline-none ml-1 "
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="text-white bg-red-500 rounded-3xl px-5 py-1 opacity-70 hover:opacity-100 font-bold text-base hover:shadow-xl outline-none "
                >
                  {save?.length}
                  Saved
                </button>
              ) : (
                <button
                  onClick={(e) => e.stopPropagation(savePin(_id))}
                  className="text-white bg-red-500 rounded-3xl px-5 py-1 opacity-70 hover:opacity-100 font-bold text-base hover:shadow-xl outline-none "
                >
                  save
                </button>
              )}
            </div>
            <div className="flex justify-center items-center gap-6 w-full">
              {destination && (
                <a
                  href={destination}
                  target="blank"
                  rel="noreferrer"
                  className="bg-white flex items-center justify-center gap-2 text-black font-bold p-2 pl-4 pr-4 rounded-full opacity-70 hover:opacity-100 hover:shadow-xl"
                >
                  <BsFillArrowUpRightCircleFill />
                  {destination.length > 20
                    ? destination.slice(8, 20)
                    : destination.slice(8)}
                </a>
              )}
              {postedBy?._id === userInfo.googleId && (
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation(deletePin(_id))}
                  className="text-white  bg-red-500 rounded-3xl p-2 opacity-70 hover:opacity-100 font-bold  hover:shadow-xl outline-none "
                >
                  <AiTwotoneDelete />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Link
        to={`user-proifle/${postedBy?._id}`}
        className="flex gap-2 items-center justify-start mt-2"
      >
        <img
          src={postedBy?.image}
          alt="posted By"
          className="rounded-full w-7 h-7 object-cover bg-slate-900"
        />
        <p className=" font-semibold capitalize">{postedBy.userName}</p>
      </Link>
    </div>
  );
};

export default Pin;
