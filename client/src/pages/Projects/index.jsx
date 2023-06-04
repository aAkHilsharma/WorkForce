import { Button, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import ProjectForm from './ProjectForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../redux/loadersSlice';
import { GetAllProjects } from '../../apicalls/project';
import { getDateFormat } from '../../utils/helper';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Description',
    dataIndex: 'description',
  },
  {
    title: 'Status',
    dataIndex: 'status',
  },
  {
    title: 'CreatedAt',
    dataIndex: 'createdAt',
    render: (text) => getDateFormat(text),
  },
  {
    title: 'Action',
    dataIndex: 'action',
    render: (text, record) => {
      return (
        <div className='flex gap-5'>
          <i className='ri-delete-bin-line cursor-pointer'></i>
          <i className='ri-pencil-line cursor-pointer'></i>
        </div>
      );
    },
  },
];

const Projects = () => {
  const [show, setShow] = useState(false);
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllProjects({ owner: user?._id });
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  }, [dispatch, user?._id]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <div className='flex justify-end'>
        <Button
          onClick={() => {
            setShow(true);
          }}
        >
          Add Project
        </Button>
      </div>
      <Table columns={columns} dataSource={projects} className='mt-4' />
      {show && (
        <ProjectForm show={show} setShow={setShow} reloadData={getData} />
      )}
    </div>
  );
};

export default Projects;
