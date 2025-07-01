import React from 'react'

function ContentWrapper({ title, children }) {
    return (
        <div className='bg-white shadow'>
            <div className='py-2 border-bottom d-flex justify-content-center font-weight-bold text-uppercase'>
                {title}
            </div>
            <div className='p-3'>
                {children}
            </div>
        </div>
    )
}

export default ContentWrapper;