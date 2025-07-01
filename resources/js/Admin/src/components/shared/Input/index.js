import React from "react";
import Input from "./input";
import DatePiker from "./datePicketr";
import TimePiker from "./timePicker";
import ImageUpload from "./imgUpload";
import TextArea from "./textArea";
import Select from "./select";
import Button from "./button";

const BaseInput = (props) => {
    let content = <Input data={props} />;
    if (props.type === "date") content = <DatePiker data={props} />;
    else if (props.type === "time") content = <TimePiker data={props} />;
    else if (props.type === "select") content = <Select data={props} />;
    else if (props.type === "file") content = <ImageUpload data={props} />;
    else if (props.type === "text-area") content = <TextArea data={props} />;
    else if (props.type === "submit") content = <Button data={props} />;
    else content = <Input data={props} />;
    return content;
};

export default BaseInput;
