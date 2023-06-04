import React from 'react';

const Spinner = () => {
  return (
    <div className='fixed inset-0 flex justify-center items-center bg-black opacity-70 z-[99999]'>
      <div className='h-10 w-10 border-solid border-3 border-gray-200 border-l-transparent rounded-full animate-spin'></div>
    </div>
  );
};

export default Spinner;
