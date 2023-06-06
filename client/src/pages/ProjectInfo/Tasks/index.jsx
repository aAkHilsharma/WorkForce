import React, { useCallback, useEffect, useState } from 'react';
import { Button, Modal, Table } from 'antd';
import TaskForm from './TaskForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { DeleteTask, GetAllTasks, UpdateTask } from '../../../apicalls/tasks';
import Divider from '../../../components/Divider';
import { getDateFormat } from '../../../utils/helper';
import { AddNotification } from '../../../apicalls/notifications';

const Tasks = ({ project }) => {
  const [viewTask, setViewTask] = useState(null);
  const [showViewTask, setShowViewTask] = useState(false);
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

  const onStatusUpdate = async ({ task, status }) => {
    try {
      dispatch(SetLoading(true));
      const response = await UpdateTask({
        _id: task._id,
        status,
      });
      if (response.success) {
        getTasks();
        alert(response.message);
        AddNotification({
          user: task.assignedBy._id,
          title: 'Status Update',
          description: `${task.name} status has been updated to ${status}`,
          onClick: `/project/${project?._id}`,
        });
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
      render: (text, record) => (
        <p
          className='text-[14px] cursor-pointer underline'
          onClick={() => {
            setViewTask(record);
            setShowViewTask(true);
          }}
        >
          {record.name}
        </p>
      ),
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
      render: (text, record) => {
        return (
          <select
            value={record.status}
            onChange={(e) => {
              onStatusUpdate({
                task: record,
                status: e.target.value,
              });
            }}
            disabled={record.assignedTo._id !== user?._id && isEmployee}
          >
            <option value='pending'>Pending</option>
            <option value='inprogress'>In Progress</option>
            <option value='completed'>Completed</option>
            <option value='closed'>Closed</option>
          </select>
        );
      },
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => {
        return (
          <div className='flex gap-6'>
            <i
              className='ri-delete-bin-line cursor-pointer text-red-500'
              onClick={() => {
                deleteHandler(record._id);
              }}
            ></i>
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
  if (isEmployee) {
    columns.pop();
  }
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

      {showViewTask && (
        <Modal
          title='TASK DETAILS'
          open={showViewTask}
          onCancel={() => {
            setShowViewTask(false);
          }}
          centered
          footer={null}
        >
          <Divider />
          <h2 className='text-2xl text-primary'>{viewTask.name}</h2>
          <span className='text-gray-500 text-[14px]'>
            {viewTask.description}
          </span>
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
