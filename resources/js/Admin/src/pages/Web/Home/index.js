import React from 'react'
import { useNavigate } from 'react-router-dom'; // ← import useNavigate
import ContentWrapper from '../../../components/shared/contentWrapper';
import { Button } from "antd";

const HomePage = () => {
  const navigate = useNavigate(); // ← initialize the hook

  const handleRedirect = () => {
    navigate('/admin/login/zekkmdvhkm'); // ← change this path to your target route
  };

  return (
    <section className="main-content d-flex align-items-center justify-content-center min-vh-100">
      <div className='row'>
        <div className="col-sm-12 vv text-center">
          <img className='my-4' src='/images/app_logo.png' alt='' height={"250px"} />
        </div>
        <div className="col-sm-12 vv text-center">
          <Button 
            key="back" 
            className="btn-theme2 btn-dark" 
            onClick={handleRedirect} // ← redirect on click
          >
            Welcome to Portal
          </Button>
        </div>
      </div>
    </section>
  );
}

export default React.memo(HomePage);
