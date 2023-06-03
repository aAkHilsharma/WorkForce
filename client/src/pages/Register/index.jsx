import { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import Divider from '../../components/Divider';
import { RegisterUser } from '../../apicalls/users';

const Register = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await RegisterUser(values);
      const { message, success } = response;
      if (success) {
        alert(message);
        navigate('/login');
      } else {
        throw new Error(message);
      }
    } catch (error) {
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
          <h1 className='text-2xl text-gray-700'>LET'S GET YOU STARTED</h1>
          <Divider />
          <Form onFinish={onFinish} layout='vertical'>
            <Form.Item label='First Name' name='firstName'>
              <Input />
            </Form.Item>
            <Form.Item label='Last Name' name='lastName'>
              <Input />
            </Form.Item>
            <Form.Item label='Email' name='email'>
              <Input type='email' />
            </Form.Item>
            <Form.Item label='Password' name='password'>
              <Input type='password' />
            </Form.Item>
            <Button type='primary' htmlType='submit' block>
              Submit
            </Button>

            <div className='flex justify-center mt-5'>
              <span>
                Already have an account? <Link to='/login'>Login</Link>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
