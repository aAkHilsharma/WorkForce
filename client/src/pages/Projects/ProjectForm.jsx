import { Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../redux/loadersSlice';
import { CreateProject, EditProject } from '../../apicalls/project';

const ProjectForm = ({ show, setShow, reloadData, project }) => {
  const formRef = useRef(null);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);
  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      let response = null;
      if (project) {
        values._id = project._id;
        response = await EditProject(values);
        setShow(false);
      } else {
        values.owner = user._id;
        values.member = [
          {
            user: user._id,
            role: 'owner',
          },
        ];
        response = await CreateProject(values);
      }
      if (response.success) {
        alert(response.message);
        reloadData();
        setShow(false);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  };
  return (
    <Modal
      title={project ? 'EDIT PROJECT' : 'CREATE PROJECT'}
      open={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText='Save'
    >
      <Form
        initialValues={project}
        layout='vertical'
        ref={formRef}
        onFinish={onFinish}
      >
        <FormItem label='Project Name' name='name'>
          <Input placeholder='Project Name' />
        </FormItem>
        <FormItem label='Project Description' name='description'>
          <TextArea placeholder='Project Name' />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default ProjectForm;
