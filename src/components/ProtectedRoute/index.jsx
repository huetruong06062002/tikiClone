import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import NotPermitted from './NotPermitted';


const RouteBaseRoute = (props) => {

  const isAdminRoute = window.location.pathname.startsWith('/admin');
  const user = useSelector(state => state.account.user)
  const userRole = user.role;

  console.log(userRole)
  if(isAdminRoute && userRole === 'ADMIN') {
    return (<>{props.children}</>)
  }else{
    return (<NotPermitted/>)
  }

}

const ProtectedRoute = (props) => {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  return (
    <>
      {isAuthenticated ? (
        <>
          <RouteBaseRoute>{props.children}</RouteBaseRoute>
        </>
      ) : (
        <Navigate to="/" replace />
      )}
    </>
  );
};
export default ProtectedRoute;
