import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillEdit, AiOutlineDelete, AiOutlineEye, AiOutlineCaretRight ,AiOutlineCheck } from 'react-icons/ai'
import { Button, Modal } from "antd";
import { useFetch } from "../../../hooks/request";
import HttpRequest from "../../../repositories";

function actionsColumn(actions = [],delete_opt = '',currentuser = '') {

    let navigate = useNavigate();
    const [modalData, setmodalData] = useState(false);
    const [modalTitle, setmodalTitle] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { loading, postData } = useFetch(delete_opt,"submit");
    const actionJob = async (slug,status) => {
        const fd = new FormData();
        fd.append('job_status', status);

        try {
        // Making the API call to update the job
        const response =  await HttpRequest.makeRequest('PUT', window.constants.api_base_url + 'admin/job/' + slug, fd)
        //const result = await response.json();
        
        if (response) {
            console.log("Job accepted successfully:");
            navigate(0);  // Redirect after success
            
        } else {
            console.error("Error accepting job:");
        }
        } catch (error) {
        console.error("Error during API call:", error);
        }
    }
    const showModal = (_) => {
        setmodalData(_)
        setmodalTitle(_.title)
        setIsModalOpen(true);
    };

    const handleOk = (props) => {
        const callback = (receivedData) => {
            window.location.reload(false);
          };
        postData('', callback, props.slug);
        setIsModalOpen(false);
      };
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    function _renderActions(key, _) {
        
        let actionView = {
            'view': <Link to={key} className='btn btn-success mx-1'><AiOutlineEye /></Link>,
            'edit': <Link to={'edit' + '/' + key} className='btn btn-primary mx-1'><AiFillEdit /></Link>,
            'delete': <button className='btn btn-danger mx-1'><AiOutlineDelete /></button>,
            'start': <button className='btn btn-danger mx-1'><AiOutlineCaretRight  /></button>,
            'complete': <button className='btn btn-danger mx-1'><AiOutlineCheck  /></button>
        }

        if (actions) {
            return (
                <div>
                    {/* <Link to={key} className='btn btn-success mx-1'><AiOutlineEye /></Link> */}
                    {actions.indexOf('view') !== -1 &&
                        <button onClick={() => navigate('view' + '/' + key, {state: _})} className='btn btn-primary mx-1'><AiOutlineEye /></button>
                    }
                    {actions.indexOf('edit') !== -1 && (_.send_to_admin == 0 && _.job_status.id == 1) &&
                        <button onClick={() => navigate('edit' + '/' + key, {state: _})} className='btn btn-primary mx-1'><AiFillEdit /></button>
                    }
                    {actions.indexOf('delete') !== -1 && _.created_by_id == currentuser.id && _.send_to_admin == 1 && _.job_status.id == 2 &&
                         
                        <button onClick={()=>{showModal(_)}} className='btn btn-danger mx-1'><AiOutlineDelete /></button>
                    }
                    {actions.indexOf('start') !== -1 && currentuser.user_group_id == 6 && _.job_status.id == 7 &&
                         
                         <button onClick={()=>{actionJob(_.slug,5)}} className='btn btn-warning mx-1'><AiOutlineCaretRight /></button>
                     }
                     {actions.indexOf('complete') !== -1 && currentuser.user_group_id == 6 && _.job_status.id == 5 &&
                         
                         <button onClick={()=>{actionJob(_.slug,6)}} className='btn btn-success mx-1'><AiOutlineCheck /></button>
                     }
                     {actions.indexOf('start') !== -1 && currentuser.user_group_id == 3 && _.job_status.id == 7 &&
                         
                         <button onClick={()=>{actionJob(_.slug,5)}} className='btn btn-warning mx-1'><AiOutlineCaretRight /></button>
                     }
                     {actions.indexOf('complete') !== -1 && currentuser.user_group_id == 3 && _.job_status.id == 5 &&
                         
                         <button onClick={()=>{actionJob(_.slug,6)}} className='btn btn-success mx-1'><AiOutlineCheck /></button>
                     }
                    <Modal title={modalTitle} open={isModalOpen} onOk={() => handleOk(modalData)} onCancel={handleCancel}>
                    <p>Are you sure you want to delete this record ?</p>
                    </Modal>
                   
                </div>
                
            )
        }
        // else if (actions) {
        //     return (
        //         <div>
        //             {
        //                 actions.map(i => actionView[i])
        //             }
        //         </div>
        //     )
        // }
        
    }
    
    return actions ? {
        title: 'Actions',
        dataIndex: 'slug',
        key: 'actions',
        render: (key, _) => _renderActions(key, _)
    } : {}
}

export default actionsColumn