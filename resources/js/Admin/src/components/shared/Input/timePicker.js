import React from "react";
import { TimePicker, Form } from "antd";
import _ from "lodash";

const TimePiker = ({ data }) => {
    const onChange = (date, dateString) => {
        console.log(date, dateString);
    };
    return (
        <Form.Item name={data.name} label={data.label + ":"} rules={data.rules} className={'p-2'}>
            <TimePicker
                className={data.className}
                onChange={onChange}
                placeholder={data.placeHolder}
                use12Hours format="h:mm a"
            />
        </Form.Item>
    );
};

export default TimePiker;
