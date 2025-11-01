import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, RefreshCcwIcon, CheckCircleIcon } from 'lucide-react';

const Landing = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <nav>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold">SlotSwapper</div>
            <div className="flex gap-4">
              {user ? (
                <Link to="/dashboard" className="btn-primary">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-6">
            Swap Your Time Slots
            <br />
            <span className="text-gray-600">Effortlessly</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A peer-to-peer scheduling platform that lets you exchange busy time slots
            with others. Find the perfect time that works for everyone.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Get Started
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4">
              Sign In
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-8 border-2 border-gray-200 rounded-lg hover:border-black transition-colors">
            <CalendarIcon className="text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-3">Manage Your Calendar</h3>
            <p className="text-gray-600">
              Create and organize your events. Mark slots as swappable when you need flexibility.
            </p>
          </div>

          <div className="text-center p-8 border-2 border-gray-200 rounded-lg hover:border-black transition-colors">
            <RefreshCcwIcon className="text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-3">Browse & Swap</h3>
            <p className="text-gray-600">
              Discover available slots from other users and request swaps that work for both parties.
            </p>
          </div>

          <div className="text-center p-8 border-2 border-gray-200 rounded-lg hover:border-black transition-colors">
            <CheckCircleIcon className="text-4xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold mb-3">Accept or Decline</h3>
            <p className="text-gray-600">
              Review incoming swap requests and accept the ones that fit your schedule.
            </p>
          </div>
        </div>

        <div className="mt-20 p-12 bg-black text-white rounded-lg text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to optimize your schedule?</h2>
          <p className="text-lg mb-8 text-gray-300">
            Join SlotSwapper today and start swapping time slots with ease.
          </p>
          <Link to="/register" className="bg-white text-black px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors inline-block">
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
