import React, { useState } from 'react'
import ContentWrapper from '../../../components/shared/Layout/index';
import { Form, Input, Button } from 'antd';
import BaseInput from "../../../components/shared/Input/index";
import { register } from "../../../config/form_validation_rules";
import { useFetch } from "../../../hooks/request";
import { useNavigate } from 'react-router';
import Helper from "../../../helpers";

const ChangePassword = () => {
  let user = window.helpers.getStorageData('session');
  const { loading, postData } = useFetch("change_password", "submit");
  let navigate = useNavigate();
  const fd = new FormData();
  const onFinish = (values) => {
    for (const key in values) {
      fd.append(key, values[key]);
    }
    const callback = (receivedData) => {
      //Helper.setStorageData("session", receivedData.data);
      //user = receivedData.data
      return navigate("/admin/changepassword");
    };
    postData(fd, callback);

  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };


  return (
    <ContentWrapper title='Change Password'>
      <section className="main-content">
        <div className='row'>
          <div className="col-sm-12">
            <Form
              name="change-password"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              style={{

                backgroundColor: "#fff",
                padding: "20px",
                margin: "30px",
                marginTop: "50px"
              }}
              autoComplete="off"
            >
              <div className='row'>
                <div className='col-12 col-md-4'>
                  <BaseInput label="Current Password" name="current_password" className="txt" type="password" rules={register.password} />
                </div>
                <div className='col-12 col-md-4'>
                  <BaseInput label="New Password" name="new_password" className="txt" type="password" rules={register.password} />
                </div>
                <div className='col-12 col-md-4'>
                  <BaseInput label="Confirm Password" name="confirm_password" className="txt" type="password" rules={register.password} />
                </div>
              </div>
              <BaseInput loading={loading} title={loading ? "Updating..." : "Update"} className="btn-theme2 btn-dark" type="submit" htmlType="submit" />
            </Form>
          </div>
        </div>
      </section>
    </ContentWrapper>

  )
}

export default React.memo(ChangePassword);