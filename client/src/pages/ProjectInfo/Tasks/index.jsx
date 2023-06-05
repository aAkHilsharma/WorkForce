import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import TaskForm from './TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { GetAllTasks } from '../../../apicalls/tasks';
import { getDateFormat } from '../../../utils/helper';

const Tasks = ({ project }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [tasks, setTask] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getTasks = useCallback(async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({
        project: project._id,
      });
      dispatch(SetLoading(false));
      if (response.success) {
        setTask(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  }, [dispatch, project._id]);

  useEffect(() => {
    getTasks();
  }, [getTasks]);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      render: (text, record) =>
        record.assignedTo.firstName + ' ' + record.assignedTo.lastName,
    },
    {
      title: 'Assigned By',
      dataIndex: 'assignedBy',
      render: (text, record) =>
        record.assignedBy.firstName + ' ' + record.assignedBy.lastName,
    },
    {
      title: 'Assigned On',
      dataIndex: 'createdAt',
      render: (text, record) => getDateFormat(text),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (text, record) => text.toUpperCase(),
    },
    {
      title: 'action',
      dataIndex: 'action',
    },
  ];

  const isEmployee = project.members.find(
    (member) => member.role === 'employee' && member.user._id === user._id
  );

  return (
    <div>
      <div className='flex justify-end'>
        {!isEmployee && (
          <Button
            onClick={() => {
              setShowTaskForm(true);
            }}
          >
            Add Task
          </Button>
        )}
      </div>
      <Table className='mt-4' columns={columns} dataSource={tasks} />

      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
        />
      )}
    </div>
  );
};

export default Tasks;
