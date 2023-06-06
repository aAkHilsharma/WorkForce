import { Button, Table } from 'antd';
import React, { useState } from 'react';
import MemberForm from './MemberForm';
import { useDispatch, useSelector } from 'react-redux';
import { SetLoading } from '../../../redux/loadersSlice';
import { RemoveMemberFromProject } from '../../../apicalls/project';

const Members = ({ project, reloadData }) => {
  const { user } = useSelector((state) => state.users);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const onClick = () => {
    setShowMemberForm(true);
  };
  const isOwner = project.owner._id === user._id;
  const dispatch = useDispatch();

  const deleteMember = async (memberId) => {
    try {
      dispatch(SetLoading(true));
      const response = await RemoveMemberFromProject({
        projectId: project._id,
        memberId,
      });
      if (response.success) {
        reloadData();
        alert(response.message);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      alert(error.message);
    }
  };

  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstName',
      render: (text, record) => record.user.firstName,
    },
    {
      title: 'Last Name',
      dataIndex: 'last Name',
      render: (text, record) => record.user.lastName,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      render: (text, record) => record.user.email,
    },
    {
      title: 'Role',
      dataIndex: 'role',
      render: (text, record) => record.role?.toUpperCase(),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: (text, record) => (
        <Button
          type='link'
          danger
          onClick={() => {
            deleteMember(record._id);
          }}
        >
          Remove
        </Button>
      ),
    },
  ];
  if (!isOwner) {
    columns.pop();
  }

  return (
    <div>
      <div className='flex justify-end'>
        {isOwner && <Button onClick={onClick}>Add Member</Button>}
      </div>

      <Table columns={columns} dataSource={project.members} className='mt-4' />
      {showMemberForm && (
        <MemberForm
          showMemberForm={showMemberForm}
          setShowMemberForm={setShowMemberForm}
          reloadData={reloadData}
          project={project}
        />
      )}
    </div>
  );
};

export default Members;
