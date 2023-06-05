import { Button, Table } from 'antd';
import React, { useState } from 'react';
import MemberForm from './MemberForm';
import { useSelector } from 'react-redux';

const Members = ({ project, reloadData }) => {
  const { user } = useSelector((state) => state.users);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const onClick = () => {
    setShowMemberForm(true);
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
        <Button type='link' danger>
          Remove
        </Button>
      ),
    },
  ];
  const isOwner = project.owner._id === user._id;
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
