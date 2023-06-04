import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GetProjectsByRole } from '../../apicalls/project';
import { SetLoading } from '../../redux/loadersSlice';
import Divider from '../../components/Divider';
import { useNavigate } from 'react-router-dom';
import { getDateFormat } from '../../utils/helper';

const Home = () => {
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole();
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <h2>
        Hey {user?.firstName} {user?.lastName}, Welcome to your Work-Force
      </h2>
      <div className='grid grid-cols-4 gap-5 mt-5'>
        {projects.map((project) => (
          <div
            key={project._id}
            className='flex flex-col gap-1 border border-solid border-gray-400 rounded-md p-2 cursor-pointer'
            onClick={() => {
              navigate(`/project/${project._id}`);
            }}
          >
            <h2 className='text-primary text-lg uppercase font-semibold'>
              {project.name}
            </h2>
            <Divider />
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600 font-semibold'>
                Created At
              </span>
              <span className='text-sm text-gray-600'>
                {getDateFormat(project.createdAt)}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600 font-semibold'>Owner</span>
              <span className='text-sm text-gray-600'>
                {project.owner.firstName} {project.owner.lastName}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-sm text-gray-600 font-semibold'>
                Status
              </span>
              <span className='text-sm text-gray-600 uppercase'>
                {project.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
