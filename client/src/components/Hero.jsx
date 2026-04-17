import { FaDonate } from "react-icons/fa";
import { Link } from "react-router-dom";

const Hero = () => {
    return (
        <section className="text-center mt-16 py-16 px-4 bg-linear-to-r from-blue-100 to-purple-100">
            <h2 className="text-4xl font-bold mb-4">
                Raise Funds for What Matters ❤️
            </h2>
            <p className="text-lg mb-6">
                Start a fundraiser in minutes and make a real difference.
            </p>
            <Link to="/create-campaign">
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 mx-auto hover:bg-blue-700">
                    <FaDonate /> Start a Fundraiser
                </button>
            </Link>
        </section>
    )
}

export default Hero