import { useEffect } from "react";
//import { useDispatch, useSelector } from "react-redux";
import { request } from "../redux/data";
import api from "../repositories/api";
import HttpRequest from "../repositories";

const useHttp =  async (params) => {

  

   
   console.log('params========================>>>>>',params)
  //   HttpRequest.makeRequest(method, window.constants.api_base_url + url).then(
  //   async (response)=>{
  //     if (response.code != 200) {
  //       Helper.sendNotification("error", response.code,response.message);
  //     } else {            
  //       Helper.removeStorageData();
  //     }
  //   }
  // );


  //const state = useSelector((state) => state.data[slug]);

  // function makeRequest(payload = {}) {
  //   if (slug !== 'custom_headers') {
  //     headers = api[slug];
  //     api[slug].key = slug;
  //   }
  //   console.log(headers)
  //   console.log(payload)
  //   disptach(request({ headers, payload }));
  // }

  // useEffect(() => {
  //   if (type == 'mount') {
  //     makeRequest();
  //   }
  // }, [])

  // return {
  //   state,
  //   makeRequest
  // };
};

export default useHttp;
