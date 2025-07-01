import { useDispatch, useSelector } from "react-redux";
import { login as disptachLogin } from "../redux/auth";

const useAuth = () => {
  const disptach = useDispatch();
  
  const state = useSelector((state) => state.auth);

  function login(payload = {}) {
    disptach(disptachLogin(payload));
  }

  return {
    state,
    login,
  };
};

export default useAuth;
