import Swal from "sweetalert2";
import _ from "lodash";
import CryptoJS from "crypto-js";
import moment from "moment";
import constants from "../config/constants";
import { notification } from "antd";
const secretKey = "app.resarchHound753";

const helpers = {
  devLog: function (message, params = "") {
    if (
      process.env.NODE_ENV === "development" ||
      process.env.NODE_ENV === "dev"
    ) {
    }
    return;
  },
  getStorageData: function (key) {
    const data = _.isEmpty(localStorage.getItem(key))
      ? {}
      : localStorage.getItem(key);
    // Decrypt
    if (data.length) {
      let secret = CryptoJS.enc.Utf8.parse(constants.aes_secret);
      let iv = CryptoJS.enc.Utf8.parse(constants.aes_iv);
      const bytes = CryptoJS.AES.decrypt(data, secret, { iv });
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return _.isEmpty(decryptedData) ? {} : decryptedData;
    }
  },
  setStorageData: function (key, value) {
    // Encrypt)`
    let secret = CryptoJS.enc.Utf8.parse(constants.aes_secret);
    let iv = CryptoJS.enc.Utf8.parse(constants.aes_iv);
   
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(value), secret, {
      iv,
    }).toString();
    localStorage.setItem(key, ciphertext);
  },
  removeStorageData: function () {
    localStorage.clear();
    let login_url = constants.base_url + constants.admin_login_url;
    window.location.href = login_url;
  },
  dateFormat: function (given_date) {
    return moment(given_date).format("YYYY-MM-DD hh:mm:ss");
  },
  dateFormattoYMD: function (given_date) {
    return moment(given_date).format("YYYY-MM-DD");
  },
  formatPhoneNumber: function (number) {
    const formatedNumber = number.split(" ");
    const joinedLastPart = formatedNumber.slice(1).join("");
    const finalNumberToFormat = [formatedNumber[0], joinedLastPart].join("-");
    return finalNumberToFormat;
  },
  randomid: function (length) {
    const result = [];
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    return result.join("");
  },
  encrypt: function (data) {
    let key = CryptoJS.enc.Utf8.parse(constants.aes_secret);
    let iv = CryptoJS.enc.Utf8.parse(constants.aes_iv);
    const ciphertext = CryptoJS.AES.encrypt(data, key, { iv }).toString();
    return ciphertext;
  },
  sweetAlert: async function (
    type = "success",
    title = "Success",
    msg = "success",
    callback = () => { }
  ) {
    return Swal.fire({
      title: title,
      text: msg,
      icon: type,
      confirmButtonText: "OK",
    }).then(callback);
  },
  objectToFormData: function (obj) {
    let form = new FormData();
    Object.entries(obj).forEach(([key, value]) => form.append(key, value));
    return form;
  },
  caseToString: function (name) {
    var words = name.match(/[A-Za-z][a-z]*/g) || [];
    words = words
      .map((item) => item.charAt(0).toUpperCase() + item.substring(1))
      .join(" ");
    return words;
  },
  sendNotification: (
    type = "success",
    message = "Success",
    description = "..."
  ) => {
    notification[type]({ message, description });
  },
  getRequestHeaders: function (url, method, key) {
    return {
      url, method, key
    }
  }
};

export default helpers;
