import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";

//Web Pages
import Home from '../pages/Web/Home'
import AboutPages from '../pages/Web/About/index'
//Admin Pages
import PrivateRoute from "./privateRoute";
import AuthRoute from "./authRoute";
const Loading = ()=>{
    console.log('Content')
    return (
        <div className="pt-3 text-center">
            <div className="sk-spinner sk-spinner-pulse"></div>
        </div>
    )
};


function App() {
    return (
        <Routes>
        <Route exact path="/" element={<Home />} /> 
        <Route exact path="/about" element={<AboutPages />}/>

        
        </Routes>
    );
}

export default App;
