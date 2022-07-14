import useAuth from "../hooks/auth";

export default function authHeader() {
    const { token } = useAuth();
    if (token) {
      return { Authorization: 'Bearer ' + user.accessToken };
    } else {
      return {};
    }
  }