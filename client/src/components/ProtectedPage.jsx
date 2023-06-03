import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetLoggedInUser } from '../apicalls/users';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/usersSlice';
import { SetLoading } from '../redux/loadersSlice';

const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.users);
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
  return (
    <div>
      <div className='flex justify-between items-center bg-primary text-white px-5 py-4'>
        <h1 className='text-2xl'>Work-Force</h1>
        <div className='flex items-center bg-white px-5 py-2 rounded'>
          <span
            className='text-primary underline cursor-pointer'
            onClick={() => {
              navigate('/profile');
            }}
          >
            {user && user?.firstName}
          </span>
          <i className='ri-notification-2-line text-white bg-gray-500 mx-2 rounded-full p-2 cursor-pointer'></i>
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
    </div>
  );
};

export default ProtectedPage;
