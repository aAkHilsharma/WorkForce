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
  const [filters, setFilters] = useState({
    status: 'all',
    assignedTo: 'all',
    assignedBy: 'all',
  });
  const [viewTask, setViewTask] = useState(null);
  const [showViewTask, setShowViewTask] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [task, setTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const isEmployee = project.members.find(
    (member) => member.role === 'employee' && member.user._id === user?._id
  );

  const getTasks = useCallback(async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllTasks({
        project: project._id,
        ...filters,
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
  }, [dispatch, project._id, filters]);

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

  useEffect(() => {
    getTasks();
  }, [filters, getTasks]);
  return (
    <div>
      <div className='flex justify-end'>
        {!isEmployee && (
          <Button
            onClick={() => {
              if (selectedTask) {
                setSelectedTask(null);
              }
              setShowTaskForm(true);
            }}
          >
            Add Task
          </Button>
        )}
      </div>
      <div className='flex gap-5'>
        <div>
          <span>Status</span>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({
                ...filters,
                status: e.target.value,
              });
            }}
          >
            <option value='all'>All</option>
            <option value='pending'>Pending</option>
            <option value='inprogress'>In Progress</option>
            <option value='completed'>Completed</option>
          </select>
        </div>
        <div>
          <span>Assigned By</span>
          <select
            value={filters.assignedBy}
            onChange={(e) => {
              setFilters({
                ...filters,
                assignedBy: e.target.value,
              });
            }}
          >
            <option value='all'>All</option>
            {project.members
              .filter(
                (member) => member.role === 'admin' || member.role === 'owner'
              )
              .map((member) => (
                <option value={member.user._id}>
                  {member.user.firstName + ' ' + member.user.lastName}
                </option>
              ))}
          </select>
        </div>
        <div>
          <span>Assigned To</span>
          <select
            value={filters.assignedTo}
            onChange={(e) => {
              setFilters({
                ...filters,
                assignedTo: e.target.value,
              });
            }}
          >
            <option value='all'>All</option>
            {project.members
              .filter((member) => member.role === 'employee')
              .map((member) => (
                <option value={member.user._id}>
                  {member.user.firstName + ' ' + member.user.lastName}
                </option>
              ))}
          </select>
        </div>
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
          <div>
            <h2 className='text-[14px] text-primary font-bold'>
              {viewTask.name}
            </h2>
            <span className='text-gray-500 text-[14px]'>
              {viewTask.description}
            </span>
            <div className='flex gap-5'>
              {viewTask.attachments.map((image) => {
                return (
                  <img
                    src={image}
                    alt=''
                    className='w-40 h-40 object-contain p-2 border-solid border-gray-400 rounded'
                  />
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Tasks;
