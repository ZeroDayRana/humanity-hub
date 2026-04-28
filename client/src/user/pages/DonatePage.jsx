import { useRef, useState, useEffect, useContext, use } from 'react'
import { FaArrowRight } from "react-icons/fa";
import CampaignCard from '../components/CampaignCard'
import Pagination from '../components/Pagination'
import { useNavigate } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce';
import axios from 'axios';

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const DonatePage = ({ search, setSearch }) => {
  const [ campaigns, setCampaigns ] = useState([]);

  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const paymentSectionRef = useRef(null);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 6;

  // ------------------------------------------------------------------------------------------
  // Pagination Logic when only client side pagination is used
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // const currentCampaigns = campaigns.slice(indexOfFirstItem, indexOfLastItem);
  // const totalPages = Math.ceil(campaigns.length / itemsPerPage);
  // ------------------------------------------------------------------------------------------

  // Search results state
  const [searchResults, setSearchResults] = useState([]);

  // Use debounce for search input to avoid excessive API calls with the help of useDebounce custom hook
  const debouncedSearch = useDebounce(search, 1000);

  // Fetch campaigns for current page when page changes - only when pagination is handled in server side
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/campaigns?page=${currentPage}&limit=${itemsPerPage}`);

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
  }, [currentPage]);

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

  // Scroll to payment section
  const handleDonateClick = (campaign) => {
    setSelectedCampaign(campaign);
    paymentSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  }
  // Handle payment amount click
  const handlePayment = async (amount) => {
    navigate('/checkout', { state: { campaign: selectedCampaign, amount } });
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-20 mt-20">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Donate Campaigns
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

      {/* Payment Section */}
      <div ref={paymentSectionRef}
        className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto mt-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {selectedCampaign ? `Donate to: ${selectedCampaign.title}` : "Select a campaign"}
        </h2>
        <p className="text-gray-600 mb-6">Select an amount to donate:</p>
        <div className="flex gap-6 justify-center">
          {[300, 500, 1000].map((amount) => (
            <button
              key={amount}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
              onClick={() => handlePayment(amount)}>
              ₹{amount}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DonatePage

