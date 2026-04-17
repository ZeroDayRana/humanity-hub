import { useEffect } from "react";
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
    const addCampaign = (newCampaign) => setCampaigns((prev) => [...prev, newCampaign]);
    const deleteCampaign = (campaignId) => setCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    const updateCampaign = (updatedCampaign) => setCampaigns((prev) => prev.map((c) => c.id === updatedCampaign.id ? updatedCampaign : c));
    
    //Fetch data from the server
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
    const values = { campaigns, setCampaigns, addCampaign, deleteCampaign, updateCampaign };
    return (
        <CampaignContext.Provider value={values}>
            {props.children}
        </CampaignContext.Provider>
    )
}