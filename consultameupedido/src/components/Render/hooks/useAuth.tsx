import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import * as CryptoJS from "crypto-js";
import api, { checkAuth } from "../api";
import { useZaf } from "./useZaf";
import { Loader } from "rtk-ux";

interface UserType {
    name: string;
    _id: number;
}

interface AuthContextType {
    user: UserType | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: Error | null;
    token: string | null;
    uri: string | undefined;
    originator: string;
    setOriginator: React.Dispatch<React.SetStateAction<string>>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    login: async () => {},
    logout: () => {},
    loading: false,
    error: null,
    token: null,
    uri: undefined,
    originator: "",
    setOriginator: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
    const [uri, setUri] = useState<string>("");
    const [error, setError] = useState<Error | null>(null);
    const [originator, setOriginator] = useState<string>("");

    const zafClient = useZaf();

    const login = async (email: string, password: string) => {
        const hashPassword = import.meta.env.VITE_PASSWORD_HASH;
        password = CryptoJS.AES.encrypt(password, hashPassword).toString();
        const data = JSON.stringify({ email, password });
        const config = {
            url: "https://api.oauth.runtask.com/api/func/get_url_by_zd?is_server=false",
            type: "POST",
            contentType: "application/json",
            headers: {
                Authorization: `Bearer {{setting.apiToken}}`,
            },
            secure: true,
            data: data,
        };

        setLoading(true);
        setError(null);

        try {
            const response: any = await zafClient.zafClient
                ?.request(config)
                .then((e: any) => {
                    return e;
                })
                .catch(() => {
                    return;
                });

            if (response?.User && response?.User._id) {
                api.defaults.baseURL = response?.uri;
                api.defaults.headers.common["Authorization"] = `Bearer ${response?.Token}`;
                localStorage.setItem("@name-tck-meupedido-zendesk", response?.User.name);
                localStorage.setItem("@id-tck-meupedido-zendesk", response?.User._id.toString());
                localStorage.setItem("@token-tck-meupedido-zendesk", response?.Token);
                localStorage.setItem("@organizations_id-tck-meupedido-zendesk", response?.User.organizations_id);
                localStorage.setItem("@uri-tck-meupedido-zendesk", response?.uri);
                setUri(response?.uri);
                setUser(response?.User);
            } else {
                throw new Error("Invalid response data");
            }
        } catch (error) {
            setError(new Error("Login failed: " + (error as Error).message));
        } finally {
            setLoading(false);
        }
    };
    const logout = () => {
        localStorage.clear();
        setUser(null);
        setToken("");
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("@name-tck-meupedido-zendesk");
        const savedUserId = localStorage.getItem("@id-tck-meupedido-zendesk");
        const getToken = localStorage.getItem("@token-tck-meupedido-zendesk");
        const getUri = localStorage.getItem("@uri-tck-meupedido-zendesk");
        if (savedUser && savedUserId && getToken && getUri) {
            setLoadingAuth(true);
            checkAuth(getToken)
                .then((isSuccess) => {
                    setLoadingAuth(false);
                    if (!isSuccess) {
                        logout();
                        return;
                    }
                    setUser({ name: savedUser, _id: Number(savedUserId) });
                    setToken(getToken);
                    setUri(getUri);
                })
                .catch(() => {
                    setLoadingAuth(false);
                    logout();
                });
        } else {
            setLoadingAuth(false);
        }
    }, []);

    useEffect(() => {
        if (!token) return;
        const interceptor = api.interceptors.request.use(
            (config) => {
                config.baseURL = localStorage.getItem("@uri-tck-meupedido-zendesk") || undefined;
                if (token) {
                    config.headers["Authorization"] = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, [token]);

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                loading,
                error,
                token,
                uri,
                originator,
                setOriginator,
            }}
        >
            {loadingAuth ? <Loader center /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
