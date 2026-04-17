import { useEffect, useState, useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Link, NavLink } from 'react-router-dom';
import ProfileSideBar from './ProfileSideBar'
import { UserContext } from '../context/UserContext';

const Navbar = ({ search, setSearch }) => {
  const { user, loadingUser, logout } = useContext(UserContext);
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
    <div className="bg-gray-50 text-gray-800">
      {/* HEADER */}
      <header className="bg-white shadow-md fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">

          {/* Logo */}
          <NavLink to="/">
            <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
              <FaHeart /> HumanityHub
            </h1>
          </NavLink>

          {/* Nav */}
          <nav className="flex gap-6 items-center">
            <NavLink to="/donate" className="hover:text-blue-500">Donate</NavLink>
            <NavLink to="/dashboard" className="hover:text-blue-500">Dashboard</NavLink>
            <NavLink to="/create-campaign" className="hover:text-blue-500">Start Fundraiser</NavLink>

            {/* Search */}
            <button onClick={() => setShowSearch(!showSearch)}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 flex items-center gap-2">
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
                className="border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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
                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700">
                  Login
                </button>
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Overlay for sidebar covers the whole screen under the sidebar */}
      {isSidebarOpen && (
        <div onClick={closeSidebar} className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300" />)}

      {/* Sidebar ALWAYS rendered */}
      <ProfileSideBar user={user} isOpen={isSidebarOpen} closeSidebar={closeSidebar} logout={logout} />

    </div>
  )
}

export default Navbar