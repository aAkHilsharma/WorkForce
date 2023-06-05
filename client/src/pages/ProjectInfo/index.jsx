import React, { useCallback, useEffect, useState } from 'react';
import { GetProjectById } from '../../apicalls/project';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SetLoading } from '../../redux/loadersSlice';
import { getDateFormat } from '../../utils/helper';
import Divider from '../../components/Divider';
import { Tabs } from 'antd';
import Tasks from './Tasks';
import Members from './Members';

const ProjectInfo = () => {
  const { user } = useSelector((state) => state.users);
  const [userRole, setUserRole] = useState('');
  const [project, setProject] = useState(null);
  const { id } = useParams();
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectById(id);
      if (response.success) {
        setProject(response.data);
        const currentUser = response.data.members.find(
          (member) => member.user._id === user?._id
        );
        setUserRole(currentUser?.role);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  }, [dispatch, id, user?._id]);

  useEffect(() => {
    getData();
  }, [getData]);

  const items = [
    {
      key: '1',
      label: 'Task',
      children: <Tasks project={project} />,
    },
    {
      key: '2',
      label: 'Members',
      children: <Members project={project} reloadData={getData} />,
    },
  ];
  return (
    project && (
      <div>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-primary text-2xl font-semibold uppercase'>
              {project.name}
            </h2>
            <span className='text-gray-600 text-sm'>{project.description}</span>
            <div className='flex gap-5'>
              <span className='text-gray-600 text-sm font-semibold'>Role</span>
              <span className='text-gray-600 text-sm uppercase'>
                {userRole}
              </span>
            </div>
          </div>
          <div>
            <div className='flex gap-5'>
              <span className='text-gray-600 text-sm font-semibold'>
                Created At
              </span>
              <span className='text-gray-600 text-sm'>
                {getDateFormat(project.createdAt)}
              </span>
            </div>
            <div className='flex gap-5'>
              <span className='text-gray-600 text-sm font-semibold'>
                Created By
              </span>
              <span className='text-gray-600 text-sm'>
                {project.owner.firstName} {project.owner.lastName}
              </span>
            </div>
          </div>
        </div>
        <Divider />
        <Tabs defaultActiveKey='1' items={items} />
      </div>
    )
  );
};

export default ProjectInfo;
