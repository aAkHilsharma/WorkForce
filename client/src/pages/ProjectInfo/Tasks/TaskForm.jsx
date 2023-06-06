import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CreateTask, UpdateTask } from '../../../apicalls/tasks';
import { SetLoading } from '../../../redux/loadersSlice';

const TaskForm = ({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
}) => {
  const [email, setEmail] = useState('');
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const onFinish = async (values) => {
    try {
      let response = null;
      dispatch(SetLoading(true));
      if (task) {
        response = await UpdateTask({
          ...values,
          project: project._id,
          assignedTo: task.assignedTo._id,
          _id: task._id,
        });
      } else {
        const assignedToMember = project.members.find(
          (member) => member.user.email === email
        );
        const assignedToUserId = assignedToMember.user._id;
        const assignedBy = user._id;

        response = await CreateTask({
          ...values,
          project: project._id,
          assignedTo: assignedToUserId,
          assignedBy,
        });
      }
      if (response.success) {
        reloadData();
        alert(response.message);
        setShowTaskForm(false);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  };

  const validateEmail = () => {
    const employeesInProject = project.members.filter(
      (member) => member.role === 'employee'
    );
    const isEmailValid = employeesInProject.find(
      (employee) => employee.user.email === email
    );
    return isEmailValid ? true : false;
  };

  return (
    project && (
      <Modal
        title={task ? 'UPDATE TASK' : 'ADD TASK'}
        open={showTaskForm}
        onCancel={() => setShowTaskForm(false)}
        centered
        onOk={() => {
          formRef.current.submit();
        }}
        okText='ADD'
      >
        <Form
          layout='vertical'
          ref={formRef}
          onFinish={onFinish}
          initialValues={task}
        >
          <Form.Item label='Task Name' name='name'>
            <Input />
          </Form.Item>
          <Form.Item label='Description' name='description'>
            <TextArea />
          </Form.Item>
          <Form.Item label='Assign To' name='assignedTo'>
            <Input
              placeholder='Enter email of the employee'
              onChange={(e) => setEmail(e.target.value)}
              disabled={task ? true : false}
            />
          </Form.Item>
          {email && !validateEmail() && (
            <div className='bg-red-700 text-sm p-2'>
              <span className='text-white'>
                Email is not valid or employee in the project
              </span>
            </div>
          )}
        </Form>
      </Modal>
    )
  );
};

export default TaskForm;
