import React from "react";
import { DatePicker, Form } from "antd";
import _ from "lodash";

const DatePiker = ({ data }) => {
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };
    return (
        <Form.Item name={data.name} label={data.label + ":"} rules={data.rules} className={'p-2'}>
            <DatePicker
                className={data.className}
                onChange={onChange}
                placeholder={data.placeHolder}
            />
        </Form.Item>
    );
};

export default DatePiker;
