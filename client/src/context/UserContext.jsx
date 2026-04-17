import { createContext, useState, useEffect } from "react";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loadingUser, setLoadingUser] = useState(true);

    // Login function to set user and token
    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
    };

    // Logout function to clear user and token
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    // Fetch user profile on mount
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoadingUser(false);
                    return;
                }
                const response = await axios.get(`${SERVER_URL}/api/user/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const { name, email } = response.data.data;
                setUser({ name, email });
                localStorage.setItem("user", JSON.stringify({ name, email }));
            } catch (error) {
                console.error("Error fetching user profile:", error);
                // If token invalid, logout
                logout();
            } finally {
                setLoadingUser(false);
            }
        };

        fetchUserProfile();
    }, []);

    const value = {
        user,
        setUser,
        loadingUser,
        login,
        logout,
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};