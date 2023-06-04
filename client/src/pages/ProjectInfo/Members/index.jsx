import { Button } from 'antd';
import React, { useState } from 'react';
import MemberForm from './MemberForm';

const Members = ({ project }) => {
  const [showMemberForm, setShowMemberForm] = useState(false);
  const onClick = () => {
    setShowMemberForm(true);
  };
  return (
    <div>
      <div className='flex justify-end'>
        <Button onClick={onClick}>Add Member</Button>
      </div>
      {showMemberForm && (
        <MemberForm
          showMemberForm={showMemberForm}
          setShowMemberForm={setShowMemberForm}
          reloadData={() => {}}
          project={project}
        />
      )}
    </div>
  );
};

export default Members;
