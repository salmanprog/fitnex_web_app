import React from "react";
import { Input, Form } from "antd";

const CustomInput = ({ data }) => {
    const { placeHolder } = data;
    console.log("placeHolder", placeHolder)
    return (
        <Form.Item {...data} className={data.className == undefined ? "p-2" : data.className}>
            <Input disabled={data?.disabled} placeholder={placeHolder} />
        </Form.Item>
    );
};

export default CustomInput;
