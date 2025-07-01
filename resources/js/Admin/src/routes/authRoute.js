import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

function AuthRoute({ children }) {
    let get_user = window.helpers.getStorageData('session');
    if (get_user) {
        return <Navigate replace to='/admin/dashboard' />
    }
    else {
        return children
    }
}

export default AuthRoute;




