import { Form, Input, Modal } from 'antd';
import FormItem from 'antd/es/form/FormItem';
import TextArea from 'antd/es/input/TextArea';
import React, { useRef } from 'react';

const ProjectForm = ({ show, setShow, reloadData }) => {
  const formRef = useRef(null);
  const onFinish = (values) => {
    console.log(values);
  };
  return (
    <Modal
      title='Add Projects'
      open={show}
      onCancel={() => setShow(false)}
      centered
      width={700}
      onOk={() => {
        formRef.current.submit();
      }}
      okText='Save'
    >
      <Form layout='vertical' ref={formRef} onFinish={onFinish}>
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
