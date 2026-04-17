import { useState, useContext } from 'react'
import { FaArrowRight } from "react-icons/fa";
import CampaignCard from '../components/CampaignCard'
import { CampaignContext } from "../context/CampaignContext";
import Pagination from '../components/Pagination'

const DashboardPage = () => {
  const { campaigns } = useContext(CampaignContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const currentCampaigns = campaigns.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(campaigns.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-20 mt-20">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        Campaigns Dashboard
      </h1>

      {/* Campaign Cards */}
      < section className="max-w-7xl mx-auto py-12 px-4" >
          <div className="flex justify-between items-center mb-6">
              <button className="flex items-center gap-2 text-blue-600 ml-auto">
                  View All <FaArrowRight />
              </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
              {currentCampaigns.map((campaign) => (
                  <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
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

export default DashboardPage