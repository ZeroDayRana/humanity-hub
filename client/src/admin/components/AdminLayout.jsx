import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "../../theme/ThemeToggle";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex">

            {/* Sidebar */}
            <div className="w-64 bg-black text-white min-h-screen p-4">
                <h2 className="text-xl font-bold mb-4">Admin</h2>
                <ThemeToggle />

                <ul className="space-y-2 mt-4">

                    <li>
                        <NavLink
                            to="/admin/dashboard"
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive ? "bg-white text-black" : "hover:bg-gray-800"
                                }`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/admin/users"
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive ? "bg-white text-black" : "hover:bg-gray-800"
                                }`
                            }
                        >
                            Users
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/admin/campaigns"
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive ? "bg-white text-black" : "hover:bg-gray-800"
                                }`
                            }
                        >
                            Campaigns
                        </NavLink>
                    </li>

                    <li>
                        <NavLink
                            to="/admin/transactions"
                            className={({ isActive }) =>
                                `block p-2 rounded ${isActive ? "bg-white text-black" : "hover:bg-gray-800"
                                }`
                            }
                        >
                            Transactions
                        </NavLink>
                    </li>

                </ul>

                {/* 🔥 Back to User Site */}
                <div className="mt-6 border-t border-gray-700 pt-4">
                    <Link
                        to="/"
                        className="block text-center bg-white text-black py-2 rounded hover:bg-gray-200"
                    >
                        ⬅ Back to Home
                    </Link>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6 bg-gray-100 min-h-screen">
                {children}
            </div>
        </div>
    );
};

export default AdminLayout;