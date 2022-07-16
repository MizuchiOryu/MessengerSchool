import React,{useContext} from "react";
import {AuthContext} from "../middleware/auth/AuthProvider"

const useAuth = () => {
    return useContext(AuthContext);
};

export default useAuth