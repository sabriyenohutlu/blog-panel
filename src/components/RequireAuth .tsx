import { Navigate, useLocation } from "react-router-dom";

const RequireAuth  = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = !!localStorage.getItem("user");
    const location = useLocation();
    if (!isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return children;
}

export default RequireAuth 