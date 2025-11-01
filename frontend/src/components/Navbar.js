import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/dashboard" className="text-2xl font-bold">
              SlotSwapper
            </Link>
            
            {user && (
              <div className="hidden md:flex space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/dashboard')
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  My Calendar
                </Link>
                <Link
                  to="/marketplace"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/marketplace')
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Marketplace
                </Link>
                <Link
                  to="/requests"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isActive('/requests')
                      ? 'bg-black text-white'
                      : 'text-black hover:bg-gray-100'
                  }`}
                >
                  Swap Requests
                </Link>
              </div>
            )}
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium hidden sm:block">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                className="btn-secondary text-sm px-4 py-2"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
