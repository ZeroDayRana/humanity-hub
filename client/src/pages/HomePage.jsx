import { useState, useContext, useEffect } from 'react'
import Hero from '../components/Hero'
import Features from '../components/Features'
import Carousel from '../components/Carousel'
import CampaignCard from '../components/CampaignCard'
import { CampaignContext } from "../context/CampaignContext";
import axios from 'axios';
import useDebounce from '../hooks/useDebounce';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const HomePage = ({ search }) => {
    const { campaigns } = useContext(CampaignContext);
    const [results, setResults] = useState([]);

    // Use debounce for search input to avoid excessive API calls with the help of useDebounce custom hook
    const debouncedSearch = useDebounce(search, 1000);

    // Fetch search results when search query changes
    useEffect(() => {
        // If search query is empty, clear results and return early
        if (!debouncedSearch.trim()) {
            setResults([]);
            return;
        }
        const fetchData = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/campaigns/search?q=${debouncedSearch}`);
                setResults(res.data.data);
                console.log("Search results:", res.data.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setResults([]);
            }
        };
        fetchData();
    }, [debouncedSearch]);

    const currentCampaigns = campaigns.slice(0, 3);

    return (
        <div>
            <Hero />
            <Carousel />
            <Features />
            {/* Campaign Cards */}
            < section className="max-w-7xl mx-auto py-12 px-4" >
                <div className="grid md:grid-cols-3 gap-8">
                    {results.length > 0 ? (
                        results.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))
                    ) : (
                        currentCampaigns.map(campaign => (
                            <CampaignCard key={campaign.id} campaign={campaign} />
                        ))
                    )}
                </div>
            </section >
        </div>
    )
}

export default HomePage