import { Link } from "react-router-dom";
import { motion } from "motion/react"
import { ShieldAlert } from "lucide-react";

const UnauthorizedPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-gray-800/60 backdrop-blur-lg border border-gray-700 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center"
            >
                <div className="flex justify-center mb-4">
                    <div className="bg-red-500/20 p-4 rounded-full">
                        <ShieldAlert className="w-10 h-10 text-red-400" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold mb-2">403 - Unauthorized</h1>
                <p className="text-gray-300 mb-6">
                    You don’t have permission to access this page.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="px-5 py-2 rounded-xl bg-white text-gray-900 font-medium hover:bg-gray-200 transition"
                    >
                        Go Home
                    </Link>

                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-2 rounded-xl border border-gray-600 hover:bg-gray-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default UnauthorizedPage
