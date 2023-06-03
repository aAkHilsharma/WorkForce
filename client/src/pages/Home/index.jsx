import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const { user } = useSelector((state) => state.users);
  return (
    <div>
      <h2>
        Hey {user?.firstName} {user?.lastName}, Welcome to your Work-Force
      </h2>
    </div>
  );
};

export default Home;
