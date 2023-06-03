import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Divider from '../../components/Divider';
import { LoginUser } from '../../apicalls/users';
import { useDispatch, useSelector } from 'react-redux';
import { SetButtonLoading } from '../../redux/loadersSlice';

const Login = () => {
  const navigate = useNavigate();
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await LoginUser(values);
      dispatch(SetButtonLoading(false));
      const { success, data, message } = response;
      if (success) {
        localStorage.setItem('token', data);
        alert(message);
        navigate('/');
      } else {
        throw new Error(message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      alert(error.message);
    }
  };
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/');
    }
  }, [navigate]);
  return (
    <div className='grid grid-cols-2'>
      <div className='bg-primary h-screen flex flex-col justify-center items-center'>
        <div>
          <h1 className='text-7xl text-white mb-2'>WORK-FORCE</h1>
          <span className='text-white'>
            One place to track all your business records
          </span>
        </div>
      </div>
      <div className='flex justify-center items-center'>
        <div className='w-[500px]'>
          <h1 className='text-2xl text-gray-700'>LOGIN TO YOUR ACCOUNT</h1>
          <Divider />
          <Form onFinish={onFinish} layout='vertical'>
            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input type='email' />
            </Form.Item>
            <Form.Item
              label='Password'
              name='password'
              rules={[{ required: true, message: 'Required' }]}
            >
              <Input type='password' />
            </Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              block
              loading={buttonLoading}
            >
              {buttonLoading ? 'Loading' : 'Login'}
            </Button>

            <div className='flex justify-center mt-5'>
              <span>
                Don't have an account <Link to='/register'>Register</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
