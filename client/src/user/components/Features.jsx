import { FaHeart, FaDonate, FaUserFriends } from "react-icons/fa";
const Features = () => {
    return (
        <section className="max-w-7xl mx-auto py-12 grid md:grid-cols-3 gap-8 px-4">
            <div className="bg-white p-6 rounded-2xl shadow text-center">
                <FaHeart className="text-3xl mx-auto text-red-500 mb-3" />
                <h3 className="font-semibold text-lg">Trusted Platform</h3>
                <p className="text-sm mt-2">Secure and verified campaigns</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow text-center">
                <FaDonate className="text-3xl mx-auto text-green-500 mb-3" />
                <h3 className="font-semibold text-lg">Easy Donations</h3>
                <p className="text-sm mt-2">Donate in just a few clicks</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow text-center">
                <FaUserFriends className="text-3xl mx-auto text-blue-500 mb-3" />
                <h3 className="font-semibold text-lg">Community Support</h3>
                <p className="text-sm mt-2">Help people around the world</p>
            </div>
        </section>
    )
}

export default Features