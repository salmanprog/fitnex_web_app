import React from 'react'
import Layout from '../components/shared/Layout';
import { BrowserRouter,Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
    let get_user = window.helpers.getStorageData('session');
    if (get_user) {
        return     <>{children}</>
     }
     else {
         return <Navigate to='/admin/login/zekkmdvhkm' />
     }
}

export default PrivateRoute;