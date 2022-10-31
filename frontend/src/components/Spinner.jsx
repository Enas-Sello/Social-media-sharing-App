import React from 'react';
import { Grid } from 'react-loader-spinner';

const Spinner = ({ message }) => {
  return (
    <div className="mt-10 m-auto flex flex-col justify-center items-center w-full h-full">
      <Grid height="80" width="80" color="#ef4444" className="mt-10 m-auto" />
      <p className="text-lg text-center px-2">{message}</p>
    </div>
  );
};

export default Spinner;
