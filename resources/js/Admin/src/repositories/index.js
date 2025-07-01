"use strict";
import Helper from "../helpers";
import Constants from "../config/constants";
import axios from "axios";
import _ from "lodash";

class HttpRequest {
  static setHeaders(customHeaders) {
    let defaultHeaders = {
      token: Helper.encrypt(Constants.client_id),
    };
    if (!_.isEmpty(localStorage.getItem("session"))) {
      console.log('user is available')
      let authUser = Helper.getStorageData("session");
      defaultHeaders["Authorization"] = Helper.encrypt(
        authUser.api_token
      );
    }
    defaultHeaders["Accept-Language"] = 'en'
    return {
      ...defaultHeaders,
      ...customHeaders,
    };
  }

  static async makeRequest(method, url, params, headers = {}, config = {}) {
    //console.log('makeRequest=================>')
    let response;

    if (!_.isEmpty(headers["Content-Type"])) {
      params = this.setParams(headers["Content-Type"], params);
    }
    try {
      let request_data = {
        method: method,
        url: url,
        headers: this.setHeaders(headers),
        data: params,
      };
      if (!_.isEmpty(config)) {
        request_data = { ...request_data, ...config };
      }
      response = await axios(request_data);
     // alert(JSON.stringify(response))
    } catch (err) {
      if (err.response.status == 401) {
        Helper.removeStorageData();
        Helper.sendNotification("User is not available","Your session has been expired. Kindly login to continue.");
        // Helper.sweetAlertWithCB(
        //   "success",
        //   "Success",
        //   "Your session has been expired. Kindly login to continue.",
        //   () => Helper.removeStorageData()
        // );
        //let error_response = err.response.data;
        return;
      }
      let error_response = { code: 400, message: err };
      if (err.response) {
        error_response.data = err.response.data.data;
      }
      return error_response;
    }
    // let success_response = { code: 200, data: response.data };
    return { code: 200, data: response.data };
  }

  static getRequestData(method, url, data, headers = {}, config = {}) {
    let request_data = {
      method,
      url: Constants.api_base_url + url,
      headers: this.setHeaders(headers),
      data,
    };
    if (!_.isEmpty(config)) {
      request_data = { ...request_data, ...config };
    }
    return request_data;
  }

  static makeQueryStringUrl(url, form_data) {
    console.log(form_data);
    const data = [...form_data.entries()];
    const queryStringParam = data
      .map((x) => `${encodeURIComponent(x[0])}=${encodeURIComponent(x[1])}`)
      .join("&");

    return url + queryStringParam;
  }
}
export default HttpRequest;
