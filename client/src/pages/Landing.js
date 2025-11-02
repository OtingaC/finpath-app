import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Landing = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary-600">FinPath</h1>
            </div>
            <div className="flex space-x-4">
              {user ? (
                <Link 
                  to="/dashboard"
                  className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link 
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register"
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Navigate Your Financial Future
          </h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Master your money game and achieve financial freedom by understanding what builds wealth vs. what drains it
          </p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/register"
              className="bg-accent-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-accent-600 transition shadow-lg"
            >
              Start Your Journey
            </Link>
            <Link 
              to="/login"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Track Assets & Liabilities
            </h3>
            <p className="text-gray-600">
              Understand the difference between what builds wealth and what drains it
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Set Financial Goals
            </h3>
            <p className="text-gray-600">
              Define your path: investing, business, passive income, or early retirement
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="text-4xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Get Personalized Roadmap
            </h3>
            <p className="text-gray-600">
              Receive custom action steps based on your situation and goals
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Anyone Can Master Their Money Game
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Financial freedom isn't just for the wealthy. Start your journey today.
          </p>
          <Link 
            to="/register"
            className="inline-block bg-accent-500 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-accent-600 transition shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;