import { useState, useEffect, useContext } from 'react'
import { FaArrowRight } from "react-icons/fa";
import CampaignCard from '../components/CampaignCard'
import Pagination from '../components/Pagination'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const ExploreCampaignsPage = ({ search, setSearch }) => {
    const navigate = useNavigate();

    // Get category and subCategory from URL search params
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const subCategory = searchParams.get('subCategory');

    const [campaigns, setCampaigns] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;

    // Search results state
    const [searchResults, setSearchResults] = useState([]);

    // Use debounce for search input to avoid excessive API calls with the help of useDebounce custom hook
    const debouncedSearch = useDebounce(search, 1000);

    // Fetch campaigns for current page when page changes - only when pagination is handled in server side
    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/campaigns?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}&page=${currentPage}&limit=${itemsPerPage}`);

                const totalPages = res.data.totalPages;

                // If current page exceeds total pages (can happen if items are deleted), reset to last page
                if (currentPage > totalPages && totalPages > 0) {
                    setCurrentPage(Math.max(1, totalPages)); // reset to last page if current page exceeds total pages
                    return;
                }

                // If no campaigns found, set to empty array to avoid errors in rendering
                if (res.data.data.length === 0) {
                    setCampaigns([]); // No campaigns found, set to empty array
                    return;
                }
                console.log("Fetched campaigns:", res.data.data);
                console.log("Total pages:", totalPages);
                setCampaigns(res.data.data);
                setTotalPages(totalPages);

            } catch (error) {
                console.error("Error fetching campaigns:", error);
                setCampaigns([]);
                setTotalPages(1);
            }
        };
        fetchCampaigns();
    }, [category, subCategory,currentPage]);

    // Fetch search results when search query changes
    useEffect(() => {
        // If search query is empty, clear results and return early
        if (!debouncedSearch.trim()) {
            setSearchResults([]);
            return;
        }
        const fetchData = async () => {
            try {
                const res = await axios.get(`${SERVER_URL}/api/campaigns/search?q=${debouncedSearch}`);
                setSearchResults(res.data.data);
                console.log("Search results:", res.data.data);
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
            }
        };
        fetchData();
    }, [debouncedSearch]);

    useEffect(() => {
        if (!debouncedSearch.trim()) {
            setCurrentPage(1);
        }
    }, [debouncedSearch]);

    // // By newest campaigns
    // const trendingCampaigns = allCampaigns
    // .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    // .slice(0, 3);

    const handleDonateClick = (campaign) => {
        // navigate to donate page
        navigate("/donate", { state: { campaign } });
        ;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-20 mt-20">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
                Explore Campaigns
                {category && (
                    <span className="text-gray-500 text-lg ml-2">
                        - {category} {subCategory ? `> ${subCategory}` : ""}
                    </span>
                )}
            </h1>

            {/* Campaign Cards */}
            < section className="max-w-7xl mx-auto py-12 px-4" >
                <div className="flex justify-between items-center mb-6">
                    <button
                        className="flex items-center gap-2 text-blue-600 ml-auto"
                        onClick={() => {
                            if (setSearch) setSearch("");
                            setSearchResults([]);
                            setCurrentPage(1);
                        }}
                    >
                        View All <FaArrowRight />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {searchResults.length > 0 ? (
                        searchResults.map(campaign => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                onDonateClick={handleDonateClick}
                            />
                        ))
                    ) : campaigns.length > 0 ? (
                        campaigns.map(campaign => (
                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                                onDonateClick={handleDonateClick}
                            />
                        ))
                    ) : (
                        <p className="text-center text-gray-500 col-span-3">
                            No campaigns found
                        </p>
                    )}
                </div>
            </section >


            {/* Pagination Component */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

        </div>
    )
}

export default ExploreCampaignsPage

