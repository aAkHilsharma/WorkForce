import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetLoggedInUser } from '../apicalls/users';

const ProtectedPage = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await GetLoggedInUser();
        console.log(response.data);
        if (response.success) {
          setUser(response.data);
        } else {
          throw new Error(response.message);
        }
      } catch (error) {
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
  }, [navigate]);
  return (
    <div>
      <h1>ProtectedPage</h1>
      <h1>
        Welcome {user?.firstName} {user?.lastName}{' '}
      </h1>
      {children}
    </div>
  );
};

export default ProtectedPage;
