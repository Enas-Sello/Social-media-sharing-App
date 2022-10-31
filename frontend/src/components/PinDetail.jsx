import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiOutlineSend } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import client, { urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import { pinDetailMorePinQuery, pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const { pinId } = useParams();
  const [pins, setPins] = useState();
  const [pinDetail, setPinDetail] = useState();
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);

  //fech pin from sanity
  const fetchPinDetails = () => {
    let query = pinDetailQuery(pinId);
    //get one pin
    if (query) {
      client.fetch(query).then((data) => {
        setPinDetail(data[0]);

        // recomndation related pins
        if (data[0]) {
          query = pinDetailMorePinQuery(data[0]);
          client.fetch(query).then((res) => {
            setPins(res);
          });
        }
      });
    }
  };
  //addComment
  const addComment = () => {
    if (comment) {
      setAddingComment(true);

      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert('after', 'comments[-1]', [
          {
            comment,
            _key: uuidv4(),
            postedBy: { _type: 'postedBy', _ref: user._id },
          },
        ])
        .commit()
        .then(() => {
          fetchPinDetails();
          setComment('');
          setAddingComment(false);
          // window.location.reload();
        });
    }
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) {
    return <Spinner message="loading pins ... " />;
  }

  console.log(pinDetail);
  return (
    <>
      {pinDetail && (
        <div
          className="flex xl:flex-row flex-col m-auto bg-white"
          style={{ maxWidth: '1500px', borderRadius: '32px' }}
        >
          <div className="flex justify-center items-center md:items-start flex-initial">
            <img
              className=" rounded-t-3xl rounded-b-lg "
              src={pinDetail?.image && urlFor(pinDetail?.image).url()}
              alt="pin img"
            />
          </div>
          <div className="w-full p-5 flex-1 xl:min-w-620">
            <div className="flex items-center justify-between">
              <div className="flex gap-2 items-center">
                <a
                  href={`${pinDetail.image.asset.url}?dl=`}
                  download
                  className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center gap-1 text-dark opacity-75 hover:opacity-100 hover:bg-red-500 hover:text-white"
                >
                  <MdDownloadForOffline />
                  download
                </a>
              </div>
              <a
                href={pinDetail.destination}
                target="_blank"
                rel="noreferrer"
                className="text-gray-400 hover:text-red-500 hover:font-semibold"
              >
                {pinDetail.destination.length > 40
                  ? pinDetail.destination.slice(8, 22)
                  : pinDetail.destination.slice(8)}
              </a>
            </div>
            <div className="">
              <h1 className="text-4xl  font-bold mt-3 break-words">
                {pinDetail.title}
              </h1>
              <div className="flex gap-3 mt-3">
                <p className=" font-bold">{pinDetail.about}</p>
                <p className="text-gray-500 font-bold">{pinDetail.category}</p>
              </div>
            </div>
            <Link
              to={`/user-profile/${pinDetail.postedBy?._id}`}
              className="flex gap-2 items-center bg-white rounded-lg mt-5"
            >
              <img
                src={pinDetail.postedBy?.image}
                alt="posted By"
                className="rounded-full w-7 h-7 object-cover bg-slate-900"
              />
              <p className=" font-semibold capitalize">
                {pinDetail.postedBy.userName}
              </p>
              <span className="text-xs text-gray-400 tracking-wider">
                owner{' '}
              </span>
            </Link>
            <h2 className="mt-5 text-2xl">comments</h2>
            <div className=" max-h-370 overflow-y-auto hide-scrollbar">
              {/* comments */}
              {pinDetail?.comments?.map((comment, i) => (
                <div
                  className="flex gap-2 mt-5 items-center rounded-lg bg-white"
                  key={i}
                >
                  <img
                    src={comment.postedBy.image}
                    alt="user profile"
                    className="w-8 h-8 cursor-pointer rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="font-bold"> {comment.postedBy.userName}</p>
                    <p className=" border-2 px-1 rounded-lg">
                      {' '}
                      {comment.comment}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* add comments */}
            <div className="flex flex-wrap mt-6 gap-3">
              <Link to={`/user-profile/${user?._id}`} className="bg-white mt-2">
                <img
                  src={user?.image}
                  alt="posted By"
                  className="rounded-full w-7 h-7 object-cover bg-slate-900"
                />
              </Link>
              <input
                type="text"
                placeholder="Add comment"
                value={comment}
                className="flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300 "
                onChange={(e) => setComment(e.target.value)}
              />
              <button
                type="button"
                onClick={addComment}
                className="bg-red-500 text-white px-5  py-1 rounded-lg text-2xl font-bold outline-none"
              >
                {addingComment ? <FaSpinner /> : <AiOutlineSend />}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* related */}
      {pins?.length > 0 ? (
        <>
          <h2 className="text-center font-bold text-2xl mt-8 mb-4 ">
            more like this
          </h2>
          <MasonryLayout pins={pins} />
        </>
      ) : (
        <Spinner message="Loading more pins ..." />
      )}
    </>
  );
};

export default PinDetail;
