import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetLoggedInUser } from '../apicalls/users';
import { useDispatch, useSelector } from 'react-redux';
import { SetNotifications, SetUser } from '../redux/usersSlice';
import { SetLoading } from '../redux/loadersSlice';
import { GetAllNotifications } from '../apicalls/notifications';
import { Avatar, Badge } from 'antd';
import Notifications from './Notifications';

const ProtectedPage = ({ children }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const { user, notifications } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  useEffect(() => {
    const getUser = async () => {
      try {
        dispatch(SetLoading(true));
        const response = await GetLoggedInUser();
        dispatch(SetLoading(false));
        if (response.success) {
          dispatch(SetUser(response.data));
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
        dispatch(SetLoading(false));
        alert(error.message);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    if (localStorage.getItem('token')) {
      getUser();
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  const getNotifications = async (req, res) => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllNotifications();
      if (response.success) {
        dispatch(SetNotifications(response.data));
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
    }
  };
  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  return (
    <div>
      <div className='flex justify-between items-center bg-primary text-white px-5 py-4'>
        <h1 className='text-2xl'>Work-Force</h1>
        <div className='flex items-center bg-white px-5 py-2 rounded'>
          <span
            className='mr-2 text-primary underline cursor-pointer'
            onClick={() => {
              navigate('/profile');
            }}
          >
            {user && user?.firstName}
          </span>
          <Badge
            count={
              notifications.filter((notification) => !notification.read).length
            }
          >
            <Avatar
              className='cursor-pointer'
              shape='square'
              size='large'
              icon={
                <i className='ri-notification-2-line text-white rounded-full cursor-pointer text-[10px] '></i>
              }
              onClick={() => {
                setShowNotifications(true);
              }}
            />
          </Badge>

          <i
            className='ml-10 ri-logout-box-r-line text-primary cursor-pointer'
            onClick={() => {
              localStorage.removeItem('token');
              navigate('/login');
            }}
          ></i>
        </div>
      </div>
      <div className='px-5 py-3'>{children}</div>
      {showNotifications && (
        <Notifications
          reloadNotification={getNotifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
        />
      )}
    </div>
  );
};

export default ProtectedPage;
