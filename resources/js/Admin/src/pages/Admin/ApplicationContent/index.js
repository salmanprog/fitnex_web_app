import React,{useEffect, useState} from 'react'
import ContentWrapper from '../../../components/shared/Layout/index';
import Table from "../../../components/shared/table";
import { useFetch } from "../../../hooks/request";
import { Button } from "antd";
import { useNavigate } from 'react-router';

const ApplicationContent = () => {
   
  let navigate = useNavigate();
  const {  data } = useFetch("get_application_content");
  const column = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
    },
    {
      title: 'Url',
      dataIndex: 'url',
      key: 'url',
    },
  ];

  const redirect_page = () => {
    return navigate("/admin/content/add");
  }
  return (
    
    <ContentWrapper title='Application Content'>
      <section className="main-content" style={{
                padding: '30px',
                marginTop: '50px'
            }}>
        <div className='row'>
        <div className="col-sm-12">
          <Button type="primary" onClick={redirect_page} style={{marginBottom:'10px',float:'right'}} htmlType="submit">Add New</Button>
        </div>
          <div className="col-sm-12">
            <Table columns={column} data={data} actions={['edit','delete']} delete_opt='delete_application_content'/>
        
          </div>
        </div>
      </section>
      </ContentWrapper>

  )
}

export default React.memo(ApplicationContent);