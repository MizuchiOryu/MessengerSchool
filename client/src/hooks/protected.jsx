
import {Navigate,useLocation} from 'react-router-dom';
import useAuth from './auth';
  
const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};
export default ProtectedRoute