import { HashRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../hooks/useAuth";
import LoginPage from "../pages/LoginPage";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";

const AppRoutes = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<LoginPage />} />
                    <Route
                        path="/home"
                        element={
                            <PrivateRoute>
                                <Home />
                            </PrivateRoute>
                        }
                    />
                </Routes>
            </HashRouter>
        </AuthProvider>
    );
};

export default AppRoutes;
