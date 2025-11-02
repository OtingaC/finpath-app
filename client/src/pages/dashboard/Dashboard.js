import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getFinancialItems, getRoadmap } from '../../utils/api';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Get financial summary
      const financialData = await getFinancialItems();
      setSummary(financialData.summary);

      // Try to get roadmap
      try {
        const roadmapData = await getRoadmap();
        setRoadmap(roadmapData.roadmap);
      } catch (err) {
        // Roadmap doesn't exist yet - that's okay
        setRoadmap(null);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-primary-600">FinPath</h1>
              <div className="hidden md:flex space-x-4">
                <Link to="/dashboard" className="text-primary-600 font-medium px-3 py-2">
                  Dashboard
                </Link>
                <Link to="/financial-items" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Financial Items
                </Link>
                <Link to="/goals" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Goals
                </Link>
                <Link to="/roadmap" className="text-gray-700 hover:text-primary-600 px-3 py-2">
                  Roadmap
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back, {user?.name}!</h2>
          <p className="text-gray-600 mt-2">Here's your financial overview</p>
        </div>

        {/* Financial Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Assets</p>
            <p className="text-2xl font-bold text-accent-600">
              KES{summary?.totalAssets?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Total Liabilities</p>
            <p className="text-2xl font-bold text-red-600">
              KES{summary?.totalLiabilities?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Net Worth</p>
            <p className={`text-2xl font-bold ${summary?.netWorth >= 0 ? 'text-accent-600' : 'text-blue-600'}`}>
              KES{summary?.netWorth?.toFixed(2) || '0.00'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-2">Items Tracked</p>
            <p className="text-2xl font-bold text-primary-600">
              {summary?.itemCount || 0}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/financial-items"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Financial Items</h3>
            <p className="text-gray-600">Track your assets and liabilities</p>
          </Link>

          <Link
            to="/goals"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Set Goals</h3>
            <p className="text-gray-600">Define your financial objectives</p>
          </Link>

          <Link
            to="/roadmap"
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">🗺️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">View Roadmap</h3>
            <p className="text-gray-600">Get your personalized action plan</p>
          </Link>
        </div>

        {/* Roadmap Preview */}
        {roadmap ? (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Roadmap Preview</h3>
            <div className="space-y-3">
              {roadmap.steps.slice(0, 3).map((step) => (
                <div key={step.stepNumber} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold mr-3">
                    {step.stepNumber}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{step.title}</p>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/roadmap"
              className="mt-4 inline-block text-primary-600 font-medium hover:text-primary-700"
            >
              View Full Roadmap →
            </Link>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-3">Ready to start your journey?</h3>
            <p className="mb-6 text-primary-100">
              Add your financial items and set goals to generate a personalized roadmap
            </p>
            <Link
              to="/financial-items"
              className="inline-block bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;