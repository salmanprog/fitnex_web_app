import React from "react";
import { Button, Form } from "antd";

const CustomButton = ({ data }) => {
    const { placeHolder } = data;
    return (
        <Button
        className={`btn-theme ${data.className == undefined ? "" : data.className}`}
        {...data}
      >
        {data.title}
         </Button>
    );
};

export default CustomButton;
