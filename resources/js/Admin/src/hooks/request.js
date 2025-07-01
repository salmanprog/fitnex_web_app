import { useEffect, useState } from "react";
import HttpRequest from "../repositories";
import api from "../repositories/api";
import Helper from "../helpers";

// Custom hook for making GET requests
export function useFetch(header, type = "mount",slug) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchApi = () => {
    let { method, url } = api[header];
    let dynamic_url = window._.isEmpty(slug) ? window.constants.api_base_url + url : window.constants.api_base_url + url + '/' + slug
    HttpRequest.makeRequest(method, dynamic_url).then(
      (response) => {
        if (response.code !== 200) {
          if (response.data) {
            Object.entries(response.data).forEach(([key, value]) => {
              Helper.sendNotification(
                "error",
                response.data.message,
                value
              );
            });
          } else {
            Helper.sendNotification("error", "Validation Error",response.data.message);
          }
        } else {
          setLoading(false);
          setData(response.data.data);
        }
      }
    );
  };
  const postData = async (payload, callback, slug) => {
    setLoading(true);
    let { method, url } = api[header];
    let route =
      slug == undefined
        ? window.constants.api_base_url + url
        : window.constants.api_base_url + url + `/${slug}`;
    let response = await HttpRequest.makeRequest(method, route, payload);
    if (response.code != 200) {
      if (response.data) {
        Object.entries(response.data).forEach(([key, value]) => {
          Helper.sendNotification("error", "Validation Error", value);
        });
      } else {
        Helper.sendNotification("error", "Validation Error",response.data.message);
      }
      setLoading(false);
    } else {
      if (typeof callback == "function") {
        callback(response.data);
      }
      Helper.sendNotification(
        "success",
        "",
        response.data.message
      );
      setLoading(false);
    }
  };
  useEffect(() => {
    setLoading(false);
    if (type == "mount") {
      fetchApi();
    }
  }, []);

  return { loading, data, postData,fetchApi };
}
