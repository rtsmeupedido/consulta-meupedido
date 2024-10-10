import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";

import PrivateRoute from "./PrivateRoute";
import OrderTracking from "../components/OrderTracking";

const AppRoutes = () => {
    console.log("1002222");
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <OrderTracking />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};

export default AppRoutes;
