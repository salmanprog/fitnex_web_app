import React, { useState } from "react";
import ContentWrapper from "../../../components/shared/Layout/index";
import { Form, Input, Button } from "antd";
import BaseInput from "../../../components/shared/Input/index";
import { register } from "../../../config/form_validation_rules";
import { useFetch } from "../../../hooks/request";
import { useNavigate } from "react-router";
import Helper from "../../../helpers";
import UploadProfile from "../../../components/shared/Input/imgUpload";

const ProfileSettings = () => {
  let user = window.helpers.getStorageData("session");
  const { loading, postData } = useFetch("update_users", "submit");
  const [imageUrl, setImageUrl] = useState(user?.image_url);
  const [file, setFile] = useState(user?.image_url);
  const fileUploadCallback = (file) => {
    setFile(file);
  };
  let navigate = useNavigate();
  const fd = new FormData();
  const onFinish = (values) => {
    for (const key in values) {
      if (typeof file == "object") {
        fd.append("image_url", file);
      }
      fd.append(key, values[key]);
    }
    const callback = (receivedData) => {
      Helper.setStorageData("session", receivedData.data);
      user = receivedData.data;
      return navigate("/admin/profilesettings");
    };
    postData(fd, callback, user.slug);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <ContentWrapper title="Profile Settings">
      <section class="main-content">
        <div className="row">
          <div class="col-sm-12">
            <Form
              name="update-user"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              initialValues={{
                name: user?.name,
                email: user?.email,
                mobile_no: user?.mobile_no,
                image_url: user?.image_url,
              }}
              labelCol={{
                span: 24,
              }}
              wrapperCol={{
                span: 24,
              }}
              style={{
                backgroundColor: "#fff",
                margin: "30px",
                marginTop: "50px",
              }}
              autoComplete="off"
            >
              <div className="row">
                <div className="col-12 col-md-6">
                  <BaseInput
                    label="Name"
                    name="name"
                    type="text"
                    rules={register.name}
                  />
                </div>
                <div className="col-image_url12 col-md-6">
                  <BaseInput
                    label="Email"
                    name="email"
                    type="text"
                    rules={register.email}
                    disabled={true}
                  />
                </div>
              </div>
              <UploadProfile
                callback={fileUploadCallback}
                static_img={imageUrl}
              />
              {/* <BaseInput label="Avatar"  url={imageUrl} setFile={on} type="file" /> */}
              <BaseInput
                loading={loading}
                title={loading ? "Updating..." : "Update"}
                className="btn-theme2 btn-dark"
                type="submit"
                htmlType="submit"
              />
            </Form>
          </div>
        </div>
      </section>
    </ContentWrapper>
  );
};

export default React.memo(ProfileSettings);
