import { Modal } from 'antd';
import moment from 'moment';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  DeleteAllNotifications,
  ReadNotifications,
} from '../apicalls/notifications';
import { SetNotifications } from '../redux/usersSlice';
import { SetLoading } from '../redux/loadersSlice';

const Notifications = ({
  showNotifications,
  setShowNotifications,
  reloadNotification,
}) => {
  const { notifications } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const readNotifications = async () => {
    try {
      const response = await ReadNotifications();
      if (response.success) {
        dispatch(SetNotifications(response.data));
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const clearAllNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteAllNotifications();
      if (response.success) {
        dispatch(SetNotifications([]));
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {}
    dispatch(SetLoading(false));
  };

  useEffect(() => {
    if (notifications.filter((notification) => !notification.read).length > 0) {
      readNotifications();
    }
  }, []);

  return (
    <Modal
      title='Notifications'
      open={showNotifications}
      onCancel={() => setShowNotifications(false)}
      centered
      footer={null}
      width={1000}
    >
      <div className='flex flex-col gap-5'>
        {notifications.length > 0 ? (
          <div className='flex justify-end'>
            <h1
              className='text-sm underline cursor-pointer'
              onClick={clearAllNotifications}
            >
              Clear All
            </h1>
          </div>
        ) : (
          <div className='flex justify-center'>
            <span>No Notifications</span>
          </div>
        )}
        {notifications.map((notification) => (
          <div
            className='flex justify-between items-end border-solid border-gray-300 p-2 rounded cursor-pointer'
            onClick={() => {
              setShowNotifications(false);
              navigate(notification.onClick);
            }}
          >
            <div className='flex flex-col'>
              <span className='text-xl font-semibold text-gray-700'>
                {notification.title}
              </span>
              <span className='text-sm'>{notification.description}</span>
            </div>
            <div>
              <span>{moment(notification.createdAt).fromNow()}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Notifications;
