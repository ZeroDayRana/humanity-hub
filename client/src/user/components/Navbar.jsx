import { useEffect, useState, useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link, NavLink } from 'react-router-dom';
import ProfileSideBar from './ProfileSideBar'
import CampaignCategories from './CampaignCategories'
import { UserContext } from '../../context/UserContext';
import ThemeToggle from "../../theme/ThemeToggle";

const Navbar = ({ search, setSearch }) => {
  const { user, campaigns, loadingUser, logout } = useContext(UserContext);
  const [showSearch, setShowSearch] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const openSidebar = () => {
    setIsSidebarOpen(true); // open
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false); // close
  };

  // Prevent body scroll
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto"; // cleanup
    };
  }, [isSidebarOpen]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* HEADER */}
      <header className="bg-white dark:bg-gray-800 shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

          {/* Logo */}
          <NavLink to="/">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <FaHeart /> HumanityHub
            </h1>
          </NavLink>

          {/* Nav */}
          <nav className="flex gap-6 items-center">
            <ThemeToggle />
            {/* Donate with Mega Menu */}
            <div className="relative group">
              <span
                to="/explore-campaigns"
                className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400"
              >
                Donate
              </span>

              {/* Mega Menu */}
              <div className="absolute hidden group-hover:block left-1/2 -translate-x-[60%] pt-4 w-125 md:w-175 lg:w-225 ">
                <CampaignCategories />
              </div>
            </div>


            <NavLink to="/create-campaign" className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400">Create Campaign</NavLink>

            {/* Only show Admin link if user is admin or superadmin */}
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <NavLink
                to="/admin"
                className="hover:text-blue-500 dark:text-gray-200 dark:hover:text-blue-400"
              >
                Admin Panel
              </NavLink>
            )}

            {/* Search */}
            <button onClick={() => setShowSearch(!showSearch)}
              className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 flex items-center gap-2 transition-colors">
              {showSearch ? <FaTimes /> : <FaSearch />}
              {showSearch ? "Close" : "Search"}
            </button>
            {/* Search Input - show/hide */}
            {showSearch && (
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white dark:bg-gray-700 text-black dark:text-white"
              />
            )}

            {/* Profile */}
            {loadingUser ? (
              <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse transition-all duration-300" />
            ) : user ? (
              <div onClick={openSidebar} className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold cursor-pointer">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            ) : (
              <Link to="/login">
                <button className="bg-blue-600 dark:bg-blue-700 text-white px-4 py-2 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors">
                  Login
                </button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Overlay for sidebar covers the whole screen under the sidebar */}
      {isSidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-opacity duration-300" />)}

      {/* Sidebar ALWAYS rendered */}
      <ProfileSideBar user={user} campaigns={campaigns} isOpen={isSidebarOpen} closeSidebar={closeSidebar} logout={logout} />

    </div>
  )
}

export default Navbar