import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Form, Input, Modal, Tabs, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { CreateTask, UpdateTask, UploadImage } from '../../../apicalls/tasks';
import { SetLoading } from '../../../redux/loadersSlice';
import { AddNotification } from '../../../apicalls/notifications';

const TaskForm = ({
  showTaskForm,
  setShowTaskForm,
  project,
  task,
  reloadData,
}) => {
  const [email, setEmail] = useState('');
  const [selectedTab, setSelectedTab] = useState(1);
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const [file, setFile] = useState(null);
  const [images, setImages] = useState(task.attachments || []);

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
        if (!task) {
          // send notification to employee
          AddNotification({
            user: response.data.assignedTo,
            title: `You have been assigned to a new task in ${project.name}`,
            onClick: `project/${project._id}`,
            description: values.description,
          });
        }
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

  const uploadImage = async () => {
    try {
      dispatch(SetLoading(true));
      const formData = new FormData();
      formData.append('file', file);
      formData.append('taskId', task._id);
      const response = await UploadImage(formData);
      if (response.success) {
        alert(response.message);
        setImages([...images, response.data]);
        reloadData();
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  };

  const deleteImage = async (image) => {
    try {
      dispatch(SetLoading(true));
      const attachments = images.filter((img) => img !== image);
      const response = await UpdateTask({
        _id: task._id,
        attachments,
      });
      if (response.success) {
        alert(response.message);
        setImages(attachments);
        reloadData();
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error);
    }
  };

  const items = [
    {
      key: '1',
      label: 'Task Details',
      children: (
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
      ),
    },
    {
      key: '2',
      label: 'Attachments',
      children: (
        <div>
          <div className='flex gap-5 mb-4'>
            {images.map((image) => {
              return (
                <div className='flex gap-3 border-solid border-gray-400 rounded'>
                  <img
                    src={image}
                    alt=''
                    className='w-20 h-20 object-contain p-2  '
                  />
                  <i
                    className='ri-delete-bin-line cursor-pointer text-red-500 p-1'
                    onClick={() => {
                      deleteImage(image);
                    }}
                  ></i>
                </div>
              );
            })}
          </div>
          <Upload
            beforeUpload={() => false}
            onChange={(info) => {
              if (info.file) {
                setFile(info.file);
              }
            }}
            listType='picture'
          >
            <Button type='dashed'>Upload Images</Button>
          </Upload>
          <div className='flex justify-end gap-5 mt-4'>
            <Button
              onClick={() => {
                setShowTaskForm(false);
              }}
            >
              Cancel
            </Button>
            <Button type='primary' onClick={uploadImage} disabled={!file}>
              Upload
            </Button>
          </div>
        </div>
      ),
      disabled: !task,
    },
  ];

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
        okText={task ? 'UPDATE' : 'CREATE'}
        {...(selectedTab === '2' && { footer: null })}
      >
        <Tabs
          defaultActiveKey='1'
          items={items}
          onChange={(key) => setSelectedTab(key)}
        />
      </Modal>
    )
  );
};

export default TaskForm;
