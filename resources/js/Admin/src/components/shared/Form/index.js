import React from "react";
import { Form, Button } from "antd";
import formFeilds from "../../../config/data/formFields";
import BaseInput from "../Input";

function FormComponent(props) {

  const [formRef] = Form.useForm();
  const { onFinish = handleSubmit, onFinishFailed = () => { }, form, initialValues = {}, type = "basic", children, layout = 'vertical' } = props;
  const { makeRequest, state } = window.useHttp(form, 'form');

  function handleSubmit(values) {
    console.log('values', values)
    makeRequest(values)
    // formRef.resetFields()
  }


  return (
    <Form
      name="basic"
      layout={layout}
      form={formRef}
      initialValues={initialValues}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      className='row'
    >
      {
        type === 'custom' ?
          { children }
          :
          <>{formFeilds[form]?.map((item) => <BaseInput initialValues={initialValues} key={item.name} data={item} />)}</>
      }
      <Button loading={state?.isLoading} className="mx-2" type="primary" htmlType="submit">Submit</Button>
    </Form>
  );
}

export default React.memo(FormComponent);
