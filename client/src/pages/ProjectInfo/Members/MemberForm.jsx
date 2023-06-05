import React, { useRef } from 'react';
import { Form, Input, Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { antdFormRules } from '../../../utils/helper';
import { AddMemberToProject } from '../../../apicalls/project';

const MemberForm = ({
  showMemberForm,
  setShowMemberForm,
  reloadData,
  project,
}) => {
  const formRef = useRef();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    const { members } = project;
    try {
      // if email is already a member
      const emailExists = members.find(
        (member) => member.user.email === values.email
      );
      if (emailExists) {
        throw new Error('User is already a part of this project');
      } else {
        dispatch(SetLoading(true));
        const response = await AddMemberToProject({
          projectId: project._id,
          email: values.email,
          role: values.role,
        });
        if (response.success) {
          alert(response.message);
          reloadData();
          setShowMemberForm(false);
        } else {
          throw new Error(response.message);
        }
        dispatch(SetLoading(false));
      }
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  };
  return (
    <Modal
      title='ADD MEMBER'
      open={showMemberForm}
      onCancel={() => setShowMemberForm(false)}
      centered
      okText='Add'
      onOk={() => {
        formRef.current.submit();
      }}
    >
      <Form ref={formRef} layout='vertical' onFinish={onFinish}>
        <Form.Item label='Email' name='email' rules={antdFormRules}>
          <Input placeholder='Email' />
        </Form.Item>
        <Form.Item label='Role' name='role' rules={antdFormRules}>
          <select>
            <option value=''>Select Role</option>
            <option value='admin'>Admin</option>
            <option value='employee'>Employee</option>
          </select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default MemberForm;
