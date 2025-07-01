import React from "react";
import { Button, Modal } from "antd";

const CustomModal = ({ data }) => {
    const { placeHolder } = data;
    return (
        <Form.Item {...data} className={data.className == undefined ? "p-2" : data.className}>
            <Input placeholder={placeHolder} />
        </Form.Item>
    );
};

export default CustomModal;
