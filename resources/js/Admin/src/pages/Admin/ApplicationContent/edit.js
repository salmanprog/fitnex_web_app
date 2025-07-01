import React,{useState} from 'react'
import ContentWrapper from '../../../components/shared/Layout/index';
import { Form, Input, Button } from 'antd';
import BaseInput from "../../../components/shared/Input/index";
import { register } from "../../../config/form_validation_rules";
import { useFetch } from "../../../hooks/request";
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import Helper from "../../../helpers";
import HttpRequest from "../../../repositories";

const EditContent = () => {
  let { slug } = useParams();
  const {  data } = useFetch("get_application_content","mount",slug);
  const { loading, postData } = useFetch("update_application_content", "submit");
  let navigate = useNavigate();
  const fd = new FormData();
  const onFinish = (values) => {
    for (const key in values) {
      fd.append(key, values[key]);
    }
    const callback = (receivedData) => {
      return navigate("/admin/content/edit/"+slug);
    };
    postData(fd, callback, slug);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <ContentWrapper title='Application Content'>
      <section className="main-content">
      <div className='row'>
      <div className="col-sm-12">
      {
          !window._.isEmpty(data) && 
      <Form
        name="update-content"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          title: data.title,
          content: data.content,
          api_url: data.api_url
        }}
        labelCol={{
          span: 24,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
         
          backgroundColor: "#fff",
          padding: "30px",
          marginTop: "50px"
        }}
        autoComplete="off"
      >
        <div className='row'>
          <div className='col-12 col-md-6'>
            <BaseInput label="Title" name="title" type="text" rules={register.name} />
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-12'>
            <BaseInput label="Content" name="content" type="text-area" />
          </div>
        </div>  
        <div className='row'>
          <div className='col-12 col-md-6'>
            <BaseInput label="Iubenda Url" name="api_url" type="text" />
          </div>
        </div>
        <BaseInput loading={loading} title={loading ? "Updating..." : "Update"} className="btn-theme2 btn-dark" type="submit" htmlType="submit"/>
        </Form>
        }
        </div>
      </div>
      </section>
      </ContentWrapper>

  )
}

export default React.memo(EditContent);