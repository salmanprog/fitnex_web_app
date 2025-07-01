import React from "react";
import { Select, Form } from "antd";

const CustomSelect = ({ data }) => {
    const {
        selectHandle,
        placeHolder,
        defaultValue
    } = data;
    return (
        <Form.Item name={data.name} label={data.label + ":"} rules={data.rules} className={data.className + 'p-2'}>
            <Select
                defaultValue={defaultValue}
                style={{
                    width: 120,
                }}
                className='w-100'
                onChange={selectHandle}
                options={data.options || []}
            />
        </Form.Item>
    );
};

export default CustomSelect;
