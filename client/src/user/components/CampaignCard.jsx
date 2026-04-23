const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const CampaignCard = ({campaign, onDonateClick = () => {}, showDonateButton = true }) => {
  return (
    <div key={campaign.id} className="bg-white rounded-2xl shadow hover:shadow-lg transition">
      <img src={`${SERVER_URL}/${campaign.image}`} className="rounded-t-2xl" alt="campaign pic"/>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{campaign.title}</h3>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${Math.min((campaign.raised / campaign.goal) * 100, 100)}%` }}
          ></div>
        </div>
        <p className="text-sm">
          ₹{campaign.raised} raised of ₹{campaign.goal}
        </p>

        {/* Donate Button - only show if prop is true */}
        {showDonateButton && (
          <button onClick={() => onDonateClick(campaign)}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
            Donate Now
          </button> 
        )}
      </div>
    </div>
  )
}

export default CampaignCard