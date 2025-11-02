import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getRoadmap, generateRoadmap, updateRoadmapProgress } from '../../utils/api';

const Roadmap = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      const data = await getRoadmap();
      setRoadmap(data.roadmap);
      setError('');
    } catch (err) {
      setRoadmap(null);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    setGenerating(true);
    setError('');
    
    try {
      const data = await generateRoadmap();
      setRoadmap(data.roadmap);
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating roadmap');
    } finally {
      setGenerating(false);
    }
  };

  const handleProgressUpdate = async (stepNumber, newProgress) => {
    try {
      await updateRoadmapProgress(stepNumber, newProgress);
      loadRoadmap();
    } catch (err) {
      alert('Error updating progress');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getCategoryColor = (category) => {
    const colors = {
      'foundation': 'bg-blue-100 text-blue-800 border-blue-300',
      'wealth-building': 'bg-green-100 text-green-800 border-green-300',
      'advanced': 'bg-purple-100 text-purple-800 border-purple-300',
      'preparation': 'bg-yellow-100 text-yellow-800 border-yellow-300'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'foundation': '🏗️',
      'wealth-building': '💎',
      'advanced': '🚀',
      'preparation': '📋'
    };
    return icons[category] || '📌';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
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
                <Link to="/dashboard" className="text-gray-700 hover:text-primary-600 px-3 py-2">Dashboard</Link>
                <Link to="/financial-items" className="text-gray-700 hover:text-primary-600 px-3 py-2">Financial Items</Link>
                <Link to="/goals" className="text-gray-700 hover:text-primary-600 px-3 py-2">Goals</Link>
                <Link to="/roadmap" className="text-primary-600 font-medium px-3 py-2">Roadmap</Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Hello, {user?.name}</span>
              <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Financial Roadmap</h2>
          <p className="text-gray-600 mt-2">Your personalized path to financial freedom</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!roadmap ? (
          // No Roadmap - Generate CTA
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Roadmap Yet</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Generate your personalized financial roadmap based on your financial items and goals. 
              Make sure you have at least one goal set before generating.
            </p>
            <button
              onClick={handleGenerateRoadmap}
              disabled={generating}
              className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 font-semibold disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate My Roadmap'}
            </button>
            <div className="mt-8 flex justify-center space-x-4">
              <Link to="/financial-items" className="text-primary-600 hover:text-primary-700 font-medium">
                Add Financial Items →
              </Link>
              <Link to="/goals" className="text-primary-600 hover:text-primary-700 font-medium">
                Set Goals →
              </Link>
            </div>
          </div>
        ) : (
          // Roadmap Exists
          <div>
            {/* Regenerate Button */}
            <div className="flex justify-between items-center mb-6">
              <div className="text-sm text-gray-600">
                Last generated: {new Date(roadmap.lastGenerated).toLocaleDateString('en-KE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <button
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 font-semibold disabled:opacity-50"
              >
                {generating ? 'Regenerating...' : 'Regenerate Roadmap'}
              </button>
            </div>

            {/* Roadmap Steps */}
            <div className="space-y-6">
              {roadmap.steps.map((step, index) => (
                <div key={step.stepNumber} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  {/* Step Header */}
                  <div className="bg-gradient-to-r from-primary-500 to-primary-600 p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                        {step.stepNumber}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                        <div className="flex items-center mt-1 space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full border ${getCategoryColor(step.category)}`}>
                            {getCategoryIcon(step.category)} {step.category.replace('-', ' ').toUpperCase()}
                          </span>
                          {step.canRunParallel && (
                            <span className="text-xs px-2 py-1 rounded-full bg-white bg-opacity-20 text-white border border-white">
                              ⚡ Can run parallel
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        {step.currentProgress}%
                      </div>
                      <div className="text-xs text-primary-100">Complete</div>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className="p-6">
                    <p className="text-gray-700 mb-4">{step.description}</p>
                    
                    {step.reasoning && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <p className="text-sm text-blue-800">
                          <span className="font-semibold">Why this matters:</span> {step.reasoning}
                        </p>
                      </div>
                    )}

                    {step.targetAmount > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">Target Amount</p>
                        <p className="text-2xl font-bold text-primary-600">
                          {formatCurrency(step.targetAmount)}
                        </p>
                      </div>
                    )}

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">{step.currentProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-accent-500 to-accent-600 h-4 rounded-full transition-all duration-500"
                          style={{ width: `${step.currentProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Progress Update Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleProgressUpdate(step.stepNumber, 0)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          step.currentProgress === 0
                            ? 'bg-gray-300 text-gray-700'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        0%
                      </button>
                      <button
                        onClick={() => handleProgressUpdate(step.stepNumber, 25)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          step.currentProgress === 25
                            ? 'bg-yellow-300 text-yellow-800'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}
                      >
                        25%
                      </button>
                      <button
                        onClick={() => handleProgressUpdate(step.stepNumber, 50)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          step.currentProgress === 50
                            ? 'bg-blue-300 text-blue-800'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        50%
                      </button>
                      <button
                        onClick={() => handleProgressUpdate(step.stepNumber, 75)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          step.currentProgress === 75
                            ? 'bg-green-300 text-green-800'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        75%
                      </button>
                      <button
                        onClick={() => handleProgressUpdate(step.stepNumber, 100)}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${
                          step.currentProgress === 100
                            ? 'bg-accent-400 text-white'
                            : 'bg-accent-100 text-accent-700 hover:bg-accent-200'
                        }`}
                      >
                        100% ✓
                      </button>
                    </div>

                    {step.isCompleted && (
                      <div className="mt-4 bg-accent-50 border border-accent-200 rounded-lg p-3 flex items-center">
                        <span className="text-2xl mr-2">🎉</span>
                        <span className="text-accent-800 font-semibold">Congratulations! Step completed!</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Motivational Footer */}
            <div className="mt-8 bg-gradient-to-r from-primary-500 to-accent-500 rounded-lg shadow p-6 text-white text-center">
              <h3 className="text-2xl font-bold mb-2">Keep Going! 💪</h3>
              <p className="text-primary-100">
                Every step forward is progress toward financial freedom. Stay consistent and celebrate small wins!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;