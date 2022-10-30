import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import client from '../client';
import { feedQuery, searchQuery } from '../utils/data';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';

const Feed = () => {
  const [loding, setLoding] = useState(false);
  const [pins, setPins] = useState(null);
  const { categoryId } = useParams();

  useEffect(() => {
    if (categoryId) {
      setLoding(true);

      //feaching each category
      const query = searchQuery(categoryId);
      client.fetch(query).then((data) => {
        console.log(data);
        setPins(data);
        setLoding(false);
      });
    } else {
      setLoding(true);
      client.fetch(feedQuery).then((data) => {
        console.log(data);
        setPins(data);
        setLoding(false);
      });
    }
  }, [categoryId]);

  if (loding)
    return <Spinner message="We are adding new ideas to your feed!`" />;
  return <div>{ pins && <MasonryLayout pins={pins} />}</div>;
};

export default Feed;
