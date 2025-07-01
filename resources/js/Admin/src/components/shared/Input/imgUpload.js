
import React, { useState } from "react";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import { Upload, message } from "antd";


const getBase64 = (img, callback) => {
  console.log("callback",callback)
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};
const beforeUpload = (file, fileList) => {
  
  const isJpgOrPng =
    file.type === "image/jpg" ||
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    file.type === "text/csv";
  if (!isJpgOrPng) {
    alert("You can only upload JPG/PNG file!");
    return false;
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alert("Image must smaller than 2MB!");
    return false;
  }

  return false;
};


const CustomUploadProfile = (props) => {
  const { static_img = "/images/user-placeholder.jpg" } = props;
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (url) => {
        setLoading(false);
        setImageUrl(url);
      });
    }

    if (
      info.file.type === "image/jpg" ||
      info.file.type === "image/jpeg" ||
      info.file.type === "image/png"
    ) {
      setImageUrl(URL.createObjectURL(info.file));
      props.callback(info.file);
    }
  };
  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <img src={static_img} className="profile-img logo img-fluid  rounded-circle" />
      )}
    </div>
  );
  return (
    <>
      <Upload
        name="avatar"
        listType="picture-circle"
        className="avatar-uploader upload-box"
        showUploadList={false}
        action=""
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {/* <div className="upload-box mb-4"> */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="avatar"
            style={{
              width: "100%",
            }}
            className="logo img-fluid my-3 rounded-circle"
          />
        ) : (
          uploadButton
        )}
      </Upload>
    </>
  );
};

export default CustomUploadProfile;