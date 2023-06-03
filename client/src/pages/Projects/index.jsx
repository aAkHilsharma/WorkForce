import { Button } from 'antd';
import React, { useState } from 'react';
import ProjectForm from './ProjectForm';

const Projects = () => {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className='flex justify-end'>
        <Button
          onClick={() => {
            setShow(true);
          }}
        >
          Add Project
        </Button>
      </div>

      {show && <ProjectForm show={show} setShow={setShow} />}
    </div>
  );
};

export default Projects;
