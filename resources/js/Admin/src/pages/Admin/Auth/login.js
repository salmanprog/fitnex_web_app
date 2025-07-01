import React from 'react';
import { Form, Input, Button } from 'antd';
import { useNavigate } from 'react-router';
import { useFetch } from "../../../hooks/request";
import Helper from "../../../helpers";

export default function Login() {

  let navigate = useNavigate();
  //let { login } = window.useAuth()
  const { loading, postData } = useFetch("login", "submit");
  function onFinish(values) {

    const additionalParams = { device_type: "web", device_token: "1234567890" };
    const updatedValues = { ...values, ...additionalParams };
    const callback = (receivedData) => {
      Helper.setStorageData("session", receivedData.data);
      return navigate("/admin/dashboard");
    };
    postData(updatedValues, callback);

    //login({ ...values, navigate })
  }

  return (
    <div className='login d-flex justify-content-center align-items-center'>
      <div className='w-35'>
        <Form
          name="basic"
          layout='vertical'
          onFinish={onFinish}
          autoComplete="off"
        >
          <div className='logo d-flex flex-column align-items-center'>
            <img className='my-4' src='/images/app_logo.png' alt='' height={'250px'} />
          </div>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input your email!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className='text-center'>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

