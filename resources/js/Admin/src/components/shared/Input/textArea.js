import { Input, Form } from 'antd'
import React from 'react'

const { TextArea } = Input;

const CustomTextArea = ({data}) => {
    const { placeHolder } = data;
    return (
        <Form.Item name={data.name} label={data.label + ":"} rules={data.rules} className={data.className + ' p-2 '}>
            <TextArea rows={4} placeholder={placeHolder} />
        </Form.Item>
    )
}

export default CustomTextArea