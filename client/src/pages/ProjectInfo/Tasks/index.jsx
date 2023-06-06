import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import TaskForm from './TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { DeleteTask, GetAllTasks } from '../../../apicalls/tasks';
import { getDateFormat } from '../../../utils/helper';

const Tasks = ({ project }) => {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [task, setTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const isEmployee = project.members.find(
    (member) => member.role === 'employee' && member.user._id === user._id
  );

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

  const deleteHandler = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteTask(id);
      if (response.success) {
        getTasks();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
    }
  };

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
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div className='flex gap-6'>
            {!isEmployee && (
              <i
                className='ri-delete-bin-line cursor-pointer text-red-500'
                onClick={() => {
                  deleteHandler(record._id);
                }}
              ></i>
            )}
            <i
              className='ri-pencil-line cursor-pointer'
              onClick={() => {
                setSelectedTask({
                  ...record,
                  assignedTo: record.assignedTo.email,
                });
                setShowTaskForm(true);
              }}
            ></i>
          </div>
        );
      },
    },
  ];

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
      <Table className='mt-4' columns={columns} dataSource={task} />

      {showTaskForm && (
        <TaskForm
          showTaskForm={showTaskForm}
          setShowTaskForm={setShowTaskForm}
          project={project}
          reloadData={getTasks}
          task={selectedTask}
        />
      )}
    </div>
  );
};

export default Tasks;
