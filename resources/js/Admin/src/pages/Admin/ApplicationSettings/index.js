import React, { useEffect, useState } from 'react'
import ContentWrapper from '../../../components/shared/Layout/index';
import { Form, Input, Button } from 'antd';
import BaseInput from "../../../components/shared/Input/index";
import { register } from "../../../config/form_validation_rules";
import { useFetch } from "../../../hooks/request";
import { useNavigate } from 'react-router';
import Helper from "../../../helpers";
import UploadProfile from '../../../components/shared/Input/imgUpload';

const ApplicationSettings = () => {

  let user = window.helpers.getStorageData('session');
  const { data } = useFetch("get_application_settings");
  const { loading, postData } = useFetch("post_application_settings", "submit");
  //const [file, setFile] = useState(data?.logo);
  const [imageUrl, setImageUrl] = useState(data?.logo);
  const [file, setFile] = useState(data?.logo);
  const fileUploadCallback = (file) => {
    setFile(file);
  };

  const [faviconfile, setfavicon] = useState(data?.favicon);
  let navigate = useNavigate();
  const fd = new FormData();
  const onFinish = (values) => {
    for (const key in values) {
      if (typeof file == "object") {
        
        fd.append('logo', file);
      }
      if (key == 'favicon' && !window._.isEmpty(values[key].file)) {
        fd.append('favicon', faviconfile);
      }
      fd.append(key, values[key]);
    }
    const callback = (receivedData) => {
      return navigate("/admin/application-setting");
    };
    postData(fd, callback);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (

    <ContentWrapper title='Application Settings'>
      <section className="main-content">
        <div className='row'>
          <div className="col-sm-12">
            {
              !window._.isEmpty(data) &&
              <Form
                name="update-user"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                  favicon: data.favicon,
                  image_url: data.logo,
                  app_name: data.application_name,
                  meta_keyword: data.meta_keyword,
                  meta_description: data.meta_description,
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
                  marginTop: "50px"
                }}
                autoComplete="off"
              >
                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <BaseInput label="Title" name="app_name" type="text" rules={register.name} />
                  </div>
                </div>
                <div className='row'>
                  <div className='col-12 col-md-6'>
                    <BaseInput label="Meta Keyword" name="meta_keyword" type="text" />
                  </div>
                  <div className='col-12 col-md-6'>
                    <BaseInput label="Meta Description" name="meta_description" type="text" />
                  </div>
                </div>
                <BaseInput loading={loading} title={loading ? "Updating..." : "Update"} className="btn-theme2 btn-dark" type="submit" htmlType="submit" />
              </Form>
            }

          </div>
        </div>
      </section>
    </ContentWrapper>

  )
}

export default React.memo(ApplicationSettings);