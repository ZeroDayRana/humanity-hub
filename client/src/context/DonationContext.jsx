import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const DonationContext = createContext();

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const DonationProvider = ({ children }) => {
    const [donations, setDonations] = useState([]);
    const token = localStorage.getItem("token");

    //Fetch donations data from the server
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/admin/donations`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setDonations(response.data.data);
            } catch (error) {
                console.error("Error fetching donations:", error);
            }
        };
        fetchDonations();
    }, []);

    return (
        <DonationContext.Provider value={{ donations, setDonations }}>
            {children}
        </DonationContext.Provider>
    );
};  

export const useDonation = () => {
    const context = useContext(DonationContext);
    if (!context) {
        throw new Error("useDonation must be used within DonationProvider");
    }
    return context;
};