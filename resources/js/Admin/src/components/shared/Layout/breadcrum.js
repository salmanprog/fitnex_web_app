import React from 'react'
import { useLocation } from 'react-router-dom';


function BreadCrum() {
    let location = useLocation();
    let bread_crumb = location.pathname.replaceAll('/', ' > ').slice(3)
    return (
        <div style={{fontFamily:'monospace'}} className='w-100 bg-white p-3'> <span className='text-capitalize'>{bread_crumb}</span></div>
    )
}

export default BreadCrum;