import React from 'react';
import { Grid } from 'react-loader-spinner';

const Spinner = ({ message }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Grid
        height="80"
        width="80"
        color={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        className=" m-5"
      />
      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
