import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AiFillEdit, AiOutlineDelete, AiOutlineEye } from 'react-icons/ai'
import { Button, Modal } from "antd";
import { useFetch } from "../../../hooks/request";

function actionsColumn(actions = [],delete_opt = '') {

    let navigate = useNavigate();
    const [modalData, setmodalData] = useState(false);
    const [modalTitle, setmodalTitle] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { loading, postData } = useFetch(delete_opt,"submit");

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
            'delete': <button className='btn btn-danger mx-1'><AiOutlineDelete /></button>
        }

        if (actions) {
            
            return (
                <div>
                    {/* <Link to={key} className='btn btn-success mx-1'><AiOutlineEye /></Link> */}
                    {actions.indexOf('view') !== -1 &&
                        <button onClick={() => navigate('view' + '/' + key, {state: _})} className='btn btn-primary mx-1'><AiOutlineEye /></button>
                    }
                    {actions.indexOf('edit') !== -1 &&
                        <button onClick={() => navigate('edit' + '/' + key, {state: _})} className='btn btn-primary mx-1'><AiFillEdit /></button>
                    }
                    {actions.indexOf('delete') !== -1 &&
                        <button onClick={()=>{showModal(_)}} className='btn btn-danger mx-1'><AiOutlineDelete /></button>
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