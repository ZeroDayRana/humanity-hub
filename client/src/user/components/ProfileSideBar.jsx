import { XMarkIcon } from "@heroicons/react/24/solid";

const ProfileSideBar = ({ user, campaigns = [], isOpen, closeSidebar, logout }) => {
    return (
        <div
            className={`fixed right-0 top-0 z-100 h-screen w-80 bg-gray-100 p-5 border-l transform transition-transform duration-300 
            ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        >
            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-xl font-semibold">Profile</h2>

                <button onClick={closeSidebar}>
                    <XMarkIcon className="w-6 h-6 text-gray-600 hover:text-black" />
                </button>
            </div>
            {/* User Info */}
            {user && (
                <div className="text-center space-y-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer" >
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <h3 className="text-lg font-bold">{user?.name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    {/* Logout Button */}
                    <button onClick={logout} className="mt-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 w-full">Logout</button>
                </div>
            )}

            {/* Donated Campaigns */}
            <div className="mt-8">
                <h3 className="text-md font-semibold mb-2">Donated Campaigns ({campaigns.length})</h3>
                <p className="text-sm text-gray-700 mb-3">Total Donated: ₹{campaigns.reduce((sum, campaign) => sum + Number(campaign.totalDonated || 0), 0)}</p>

                {campaigns.length === 0 ? (
                    <p className="text-gray-500 text-sm">No donations yet</p>
                ) : (
                    <ul className="space-y-2 max-h-40 overflow-y-auto">
                        {campaigns.map(c => (
                            <li key={c.id} className="bg-white p-2 rounded shadow-sm hover:bg-gray-50">
                                {c.title}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ProfileSideBar;