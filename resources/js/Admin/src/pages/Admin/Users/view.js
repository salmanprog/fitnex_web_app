import React, { useEffect, useState } from "react";
import ContentWrapper from "../../../components/shared/Layout/index";
import BaseInput from "../../../components/shared/Input/index";
import { register } from "../../../config/form_validation_rules";
import { useFetch } from "../../../hooks/request";
import { Form, Spin, Avatar, List, Tabs, Image, Modal } from "antd";
import { useLocation, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

let content;
const onChange = (key) => {
  // console.log('key>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',key);
};

const ViewUser = () => {
  let { state } = useLocation();
  const [items, setItems] = useState([]);
  const [alignValue, setAlignValue] = useState("center");
  let { slug } = useParams();
  const { loading, data } = useFetch("get_users", "mount", slug);
  const { data: userProfile } = useFetch(
    "get_users_profiles",
    "mount",
    "?user_id=" + state.id + "&limit=5000"
  );
  const { data: userQuickLogs } = useFetch(
    "get_users_logs",
    "mount",
    "?user_id=" + state.id + "&log_type=quick_log&limit=5000"
  );
  const { data: userDetailLogs } = useFetch(
    "get_users_logs",
    "mount",
    "?user_id=" + state.id + "&log_type=details_log&limit=5000"
  );
  const { data: userFlowLogs } = useFetch(
    "get_users_logs",
    "mount",
    "?user_id=" + state.id + "&log_type=flow_log&limit=5000"
  );
  const { data: userSelfCareLogs } = useFetch(
    "get_users_logs",
    "mount",
    "?user_id=" + state.id + "&log_type=selfcare_log&limit=5000"
  );
  let profiles = [];
  if (!window._.isEmpty(userProfile)) {
    userProfile.forEach((value, key) =>
      profiles.push({
        name: value.name,
        image_url: value.image_url,
        nick_name: value.nick_name,
        dob: !window._.isEmpty(value.dob) ? value.dob : "N/A",
        age: !window._.isEmpty(value.age) ? value.age : "N/A",
        gender: !window._.isEmpty(value.gender)
          ? value.gender.title
          : value.other_gender,
        sex: !window._.isEmpty(value.sex) ? value.sex.title : value.other_sex,
        sex_orientation: !window._.isEmpty(value.sex_orientation)
          ? value.sex_orientation.title
          : value.other_sex_orientation,
        relationship: !window._.isEmpty(value.relationship)
          ? value.relationship.title
          : value.other_relationship,
        ancillary_relationship: value.ancillary_relationship.title,
        contactus_status: value.contactus_status.title,
        contact_status_updated_at: value.contact_status_updated_at,
        abuse_type: value.abuse_type,
        abuse_status: value.abuse_status,
        categories: value.categories,
        media: value.media,
      })
    );
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setmodalData] = useState(false);

  const showModal = (obj) => {
    setmodalData(obj);
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    let array = [
      { title: "Flow Logs", item: userFlowLogs },
      { title: "Detailed Logs", item: userDetailLogs },
      { title: "Self Care Logs", item: userSelfCareLogs },
      { title: "Quick Logs", item: userQuickLogs },
    ];
    setItems(
      array
        .filter((i) => i.item)
        .map(({ title, item }, index) => ({
          key: index,
          label: title,
          children: (
            <List
              itemLayout="horizontal"
              dataSource={item?.map?.((i, ind) => ({
                name: i.title,
                image_url: i.image_url,
                short_description: i.log_description.slice(0, 35) + "...",
                description: i.log_description,
                log_type: i.log_type,
                log_date: i.log_date,
                log_time: i.log_time,
                refrence_profiles: i.refrence_profiles,
                abuser_profiles: i.abuser_profiles,
                ancillary_profiles: i.ancillary_profiles,
                secondary_victim_profiles: i.secondary_victim_profiles,
                incident_severity_logs: i.incident_severity_logs,
                abuse_status: i.abuse_status,
                categories: i.categories,
                media: i.media,
              }))}
              renderItem={(item, index) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.image_url} />}
                    title={
                      <a
                        onClick={() => {
                          showModal(item);
                        }}
                      >
                        {item.name}
                      </a>
                    }
                    description={item.short_description}
                  />
                </List.Item>
              )}
            />
          ),
        }))
    );
  }, [userFlowLogs, userDetailLogs, userSelfCareLogs, userQuickLogs]);

  if (!window._.isEmpty(data)) {
    content = (
      <ContentWrapper title="View User">
        <section className="main-content">
          {!window._.isEmpty(data) && (
            <div className="row">
              <div className="col-md-4">
                <div className="widget white-bg">
                  <div className="padding-20 text-center">
                    <Image
                      width={140}
                      className="rounded-circle mar-btm margin-b-10 circle-border"
                      src={data.image_url}
                    />
                    <p className="lead font-500 margin-b-0">{data.name}</p>
                    <p className="text-muted">{data.nick_name}</p>

                    <ul className="list-unstyled margin-b-0 text-center row mt-3">
                      <li className="col-4">
                        <span className="font-600">Total Profile</span>
                        <p className="text-muted text-sm margin-b-0">
                          {data.total_profiles}
                        </p>
                      </li>
                      <li className="col-4">
                        <span className="font-600">Total Logs</span>
                        <p className="text-muted text-sm margin-b-0">
                          {data.total_logs}
                        </p>
                      </li>
                      <li className="col-4">
                        <span className="font-600">Status</span>
                        <p className="text-muted text-sm margin-b-0">
                          {data.status_text}
                        </p>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="widget white-bg friends-group clearfix">
                  <div className="row">
                    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-3">
                      <small className="text-muted">Email address </small>
                      <p>{data.email}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-3">
                      <small className="text-muted">Date of Birth</small>
                      <p>{!window._.isEmpty(data.dob) ? data.dob : "NA"}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-3">
                      <small className="text-muted">Age</small>
                      <p>{!window._.isEmpty(data.age) ? data.age : "NA"}</p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-3">
                      <small className="text-muted">Gender</small>
                      <p>
                        {!window._.isEmpty(data.gender)
                          ? data.gender.title
                          : data.other_gender}
                      </p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-3">
                      <small className="text-muted">Sex</small>
                      <p>
                        {!window._.isEmpty(data.sex)
                          ? data.sex.title
                          : data.other_sex}
                      </p>
                    </div>
                    <div className="col-12 col-md-6 col-lg-6 col-xl-4 mb-3">
                      <small className="text-muted">Sexual Orientation</small>
                      <p>
                        {!window._.isEmpty(data.sex_orientation)
                          ? data.sex_orientation.title
                          : "NA"}
                      </p>
                    </div>
                    <div className="col-12 col-md-4 mb-3">
                      <small className="text-muted">Marital Status</small>
                      <p>
                        {!window._.isEmpty(data.marital_status)
                          ? data.marital_status.title
                          : data.other_martial_status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-8">
                <div className="card">
                  <div className="card-header card-default colored bg-primary">
                    User Profiles
                  </div>
                  <div className="card-body">
                    <List
                      itemLayout="horizontal"
                      dataSource={profiles}
                      renderItem={(item, index) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={<Avatar src={item.image_url} />}
                            title={
                              <a
                                onClick={() => {
                                  showModal(item);
                                }}
                              >
                                {item.name}
                              </a>
                            }
                            description={
                              "Nick Name: " +
                              item.nick_name +
                              " | Date Of Birth: " +
                              item.dob +
                              " | Age: " +
                              item.age
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </div>
                </div>
                <div className="card">
                  <div className="card-header card-default colored bg-primary">
                    User Logs
                  </div>
                  <div className="card-body">
                    {items?.length && (
                      <Tabs
                        defaultActiveKey="1"
                        items={items}
                        onChange={onChange}
                        indicator={{
                          size: (origin) => origin - 20,
                          align: alignValue,
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <Modal
            title="View Details"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            width={1000}
          >
            {!window._.isEmpty(modalData.image_url) && (
              <div className="row">
                <div className="col-md-12">
                  <div className="demo-grid-block">
                    <Avatar src={modalData.image_url} />
                    <p className="color-grey">{modalData.name}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              {!window._.isEmpty(modalData.description) && (
                <div className="col-md-12">
                  <div className="demo-grid-block">
                    <p className="color-black">Description</p>
                    <p className="color-grey">{modalData.description}</p>
                  </div>
                </div>
              )}

              {!window._.isEmpty(modalData.nick_name) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Nick Name</p>
                    <p className="color-grey">{modalData.nick_name}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.dob) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Date of Birth</p>
                    <p className="color-grey">{modalData.dob}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.age) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Age</p>
                    <p className="color-grey">{modalData.age}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.gender) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Gender</p>
                    <p className="color-grey">{modalData.gender}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.sex) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Sex</p>
                    <p className="color-grey">{modalData.sex}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.sex_orientation) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black"> Sex Orientation</p>
                    <p className="color-grey">{modalData.sex_orientation}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.relationship) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Relationship</p>
                    <p className="color-grey">{modalData.relationship}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.ancillary_relationship) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Ancillary Relationship</p>
                    <p className="color-grey">
                      {modalData.ancillary_relationship}
                    </p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.contactus_status) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Contact Status</p>
                    <p className="color-grey">{modalData.contactus_status}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.contact_status_updated_at) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Contact Last Updated</p>
                    <p className="color-grey">
                      {modalData.contact_status_updated_at}
                    </p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.abuse_type) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Abuse Type</p>
                    <p className="color-grey">
                      {!window._.isEmpty(modalData.abuse_type)
                        ? modalData.abuse_type
                            .map((ab) => {
                              return ab.title;
                            })
                            .join(",")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.log_date) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Date</p>
                    <p className="color-grey">{modalData.log_date}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.log_time) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Time</p>
                    <p className="color-grey">{modalData.log_time}</p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.abuser_profiles) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Abuser Profiles</p>
                    <p className="color-grey">
                      {!window._.isEmpty(modalData.abuser_profiles)
                        ? modalData.abuser_profiles
                            .map((ab) => "@" + ab.name)
                            .join(",")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.refrence_profiles) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Refrence Profiles</p>
                    <p className="color-grey">
                      {!window._.isEmpty(modalData.refrence_profiles)
                        ? modalData.refrence_profiles
                            .map((rp) => "@" + rp.name)
                            .join(",")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.ancillary_profiles) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Ancillary Profiles</p>
                    <p className="color-grey">
                      {!window._.isEmpty(modalData.ancillary_profiles)
                        ? modalData.ancillary_profiles
                            .map((ap) => "@" + ap.name)
                            .join(",")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.secondary_victim_profiles) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black">Secondary Victim Profiles</p>
                    <p className="color-grey">
                      {!window._.isEmpty(modalData.secondary_victim_profiles)
                        ? modalData.secondary_victim_profiles
                            .map((sp) => "@" + sp.name)
                            .join(",")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
              {!window._.isEmpty(modalData.incident_severity_logs) && (
                <div className="col-md-4">
                  <div className="demo-grid-block">
                    <p className="color-black"> Incident Severity Logs</p>
                    <p className="color-grey">
                      {!window._.isEmpty(modalData.incident_severity_logs)
                        ? modalData.incident_severity_logs
                            .map((ins) => ins.title)
                            .join(",")
                        : "N/A"}
                    </p>
                  </div>
                </div>
              )}
            </div>
            {!window._.isEmpty(modalData.categories) && (
              <div className="row">
                <div className="col-md-12">
                  <div className="demo-grid-block">
                    <p className="color-black">Categories</p>
                    <p className="color-grey">
                      {!window._.isEmpty(modalData.categories)
                        ? modalData.categories.map((cs) => (
                            <span className="badge badge-info mx-1">
                              {cs.title}
                            </span>
                          ))
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="row">
              <h6>
                Media <span className="badge badge-success">Images</span>
              </h6>
              <div className="col-md-12">
                <div className="demo-grid-block">
                  {!window._.isEmpty(modalData.media) && (
                    <div className="row">
                      {!window._.isEmpty(modalData.media["image"]) && (
                        <>
                          {modalData.media["image"].map((img) => (
                            <div className="col-md-3">
                              <Image
                                width={140}
                                className="mar-btm margin-b-10 circle-border"
                                src={img.file_url}
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {!window._.isEmpty(modalData.media) && (
                    <div className="row">
                      <div className="col-12">
                        <h6 className="mt-4 mb-3 ">
                          Media{" "}
                          <span className="badge badge-success ">Audio</span>
                        </h6>
                      </div>
                      {!window._.isEmpty(modalData.media["audio"]) && (
                        <>
                          {modalData.media["audio"].map((aud) => (
                            <div className="col-md-3 mb-3">
                              {" "}
                              <AudioPlayer
                                src={aud.file_url}
                                onPlay={(e) => console.log("onPlay")}
                              />
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {!window._.isEmpty(modalData.media) && (
                    <div className="row">
                      <div className="col-12">
                        <h6 className="mt-4 mb-3">
                          Media{" "}
                          <span className="badge badge-success">Video</span>
                        </h6>
                      </div>
                      {!window._.isEmpty(modalData.media["video"]) && (
                        <>
                          {modalData.media["video"].map((vd, ind) => (
                            <div className="col-md-3 mb-3">
                              {" "}
                              <div className="buttons margin-b-20">
                                <a
                                  href={vd.file_url}
                                  target="_blank"
                                  className="btn btn-primary btn-rounded btn-icon"
                                >
                                  <i className="fa fa-cloud-download"></i> Video{" "}
                                  {ind + 1} Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}

                  {!window._.isEmpty(modalData.media) && (
                    <div className="row">
                      {!window._.isEmpty(modalData.media["documents"]) && (
                        <>
                          <h6>
                            Media{" "}
                            <span className="badge badge-success">
                              Documents
                            </span>
                          </h6>
                          {modalData.media["documents"].map((dc, nd) => (
                            <div className="col-md-3">
                              {" "}
                              <div className="buttons margin-b-20">
                                <a
                                  href={dc.file_url}
                                  target="_blank"
                                  className="btn btn-primary btn-rounded btn-icon"
                                >
                                  <i className="fa fa-cloud-download"></i>{" "}
                                  Document {nd + 1} Download
                                </a>
                              </div>
                            </div>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Modal>
        </section>
      </ContentWrapper>
    );
  } else {
    content = (
      <div className="min-vw-100 min-vh-100 d-flex align-items-center justify-content-center">
        <Spin size="large" />
      </div>
    );
  }
  return [content];
};

export default React.memo(ViewUser);
