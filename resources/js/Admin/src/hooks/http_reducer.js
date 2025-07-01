import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { request } from "../redux/data";
import api from "../repositories/api";

const useHttp = (slug = 'custom_headers', type = 'mount', headers) => {
  console.log(headers)
  const disptach = useDispatch();

  const state = useSelector((state) => state.data[slug]);

  function makeRequest(payload = {}) {
    if (slug !== 'custom_headers') {
      headers = api[slug];
      api[slug].key = slug;
    }
    console.log(headers)
    console.log(payload)
    disptach(request({ headers, payload }));
  }

  useEffect(() => {
    if (type == 'mount') {
      makeRequest();
    }
  }, [])

  return {
    state,
    makeRequest
  };
};

export default useHttp;
