import { useEffect, useContext } from "react";
import { createContext, useState } from "react";
import axios from "axios";
// import campaignsData from "../data/campaignsData";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const CampaignContext = createContext();
export const CampaignProvider = (props) => {
    //If you want to use the data from the local file or storage
    // const [campaigns, setCampaigns] = useState(campaignsData);

    //If you want to use the data from the server
    const [campaigns, setCampaigns] = useState([]);
    
    //Fetch campaigns data from the server
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}/api/campaigns`);
                setCampaigns(response.data.data);  
                console.log(response.data.data);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
            }
        }
        fetchCampaigns(); // ✅ call async function
    }, []);
    const values = { campaigns, setCampaigns };
    return (
        <CampaignContext.Provider value={values}>
            {props.children}
        </CampaignContext.Provider>
    )
}

export const useCampaign = () => {
    const context = useContext(CampaignContext);
    if (!context) {
        throw new Error("useCampaign must be used within CampaignProvider");
    }
    return context;
};