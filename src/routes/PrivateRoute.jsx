import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const userRole = user?.is_teacher ? 'teacher' : 'student';

  // Redirect if the user's role is not allowed for this route
  if (allowedRoles && !allowedRoles.includes(userRole)) {
  
    const redirectPath = userRole === 'teacher' ? '/teacher/home' : '/student/home';
    return <Navigate to={redirectPath} />;
  }
  
  return children;
};

export default PrivateRoute;
