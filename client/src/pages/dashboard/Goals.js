import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getGoals, createGoal, updateGoal, deleteGoal } from '../../utils/api';

const Goals = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    goalType: 'emergency_fund',
    priority: 1,
    timeline: 'medium'
  });

  const goalTypes = [
    { value: 'emergency_fund', label: 'Build Emergency Fund', icon: '🛡️', description: 'Save 3-6 months of expenses' },
    { value: 'debt_freedom', label: 'Get Out of Debt', icon: '💳', description: 'Eliminate all liabilities' },
    { value: 'start_investing', label: 'Start Investing', icon: '📈', description: 'Begin building wealth through investments' },
    { value: 'start_business', label: 'Start a Business', icon: '💼', description: 'Launch your own venture or side hustle' },
    { value: 'retire_early', label: 'Retire Early', icon: '🏖️', description: 'Achieve financial independence' },
    { value: 'passive_income', label: 'Generate Passive Income', icon: '💰', description: 'Create income streams that work for you' }
  ];

  const timelines = [
    { value: 'short', label: 'Short-term (0-2 years)' },
    { value: 'medium', label: 'Medium-term (2-5 years)' },
    { value: 'long', label: 'Long-term (5+ years)' }
  ];

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data.goals);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createGoal(formData);
      setShowModal(false);
      resetForm();
      loadGoals();
    } catch (error) {
      alert(error.response?.data?.message || 'Error creating goal');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(id);
        loadGoals();
      } catch (error) {
        alert('Error deleting goal');
      }
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateGoal(id, { status: newStatus });
      loadGoals();
    } catch (error) {
      alert('Error updating goal status');
    }
  };

  const resetForm = () => {
    setFormData({
      goalType: 'emergency_fund',
      priority: 1,
      timeline: 'medium'
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getGoalInfo = (goalType) => {
    return goalTypes.find(g => g.value === goalType) || {};
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      1: 'bg-red-100 text-red-800',
      2: 'bg-yellow-100 text-yellow-800',
      3: 'bg-green-100 text-green-800'
    };
    const labels = {
      1: 'High Priority',
      2: 'Medium Priority',
      3: 'Low Priority'
    };
    return { color: colors[priority], label: labels[priority] };
  };

  const getStatusBadge = (status) => {
    const badges = {
      'not_started': { color: 'bg-gray-100 text-gray-800', label: 'Not Started' },
      'in_progress': { color: 'bg-blue-100 text-blue-800', label: 'In Progress' },
      'completed': { color: 'bg-green-100 text-green-800', label: 'Completed' }
    };
    return badges[status] || badges['not_started'];
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
                <Link to="/goals" className="text-primary-600 font-medium px-3 py-2">Goals</Link>
                <Link to="/roadmap" className="text-gray-700 hover:text-primary-600 px-3 py-2">Roadmap</Link>
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Financial Goals</h2>
            <p className="text-gray-600 mt-2">Set up to 3 goals to guide your financial journey</p>
          </div>
          {goals.length < 3 && (
            <button
              onClick={() => { resetForm(); setShowModal(true); }}
              className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 font-semibold"
            >
              + Add Goal
            </button>
          )}
        </div>

        {/* Goals List */}
        {goals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No goals set yet</h3>
            <p className="text-gray-600 mb-6">Start by setting your first financial goal. You can have up to 3 goals.</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-500 text-white px-8 py-3 rounded-lg hover:bg-primary-600 font-semibold"
            >
              Set Your First Goal
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {goals.sort((a, b) => a.priority - b.priority).map(goal => {
              const goalInfo = getGoalInfo(goal.goalType);
              const priorityBadge = getPriorityBadge(goal.priority);
              const statusBadge = getStatusBadge(goal.status);

              return (
                <div key={goal._id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="text-4xl">{goalInfo.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{goalInfo.label}</h3>
                        <p className="text-gray-600 mt-1">{goalInfo.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(goal._id)}
                      className="text-red-600 hover:text-red-700 font-medium"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-3 mt-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityBadge.color}`}>
                      {priorityBadge.label}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge.color}`}>
                      {statusBadge.label}
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      {timelines.find(t => t.value === goal.timeline)?.label}
                    </span>
                  </div>

                  {/* Status Update Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleUpdateStatus(goal._id, 'not_started')}
                      disabled={goal.status === 'not_started'}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        goal.status === 'not_started'
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Not Started
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(goal._id, 'in_progress')}
                      disabled={goal.status === 'in_progress'}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        goal.status === 'in_progress'
                          ? 'bg-blue-200 text-blue-700 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(goal._id, 'completed')}
                      disabled={goal.status === 'completed'}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        goal.status === 'completed'
                          ? 'bg-green-200 text-green-700 cursor-not-allowed'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {goals.length > 0 && goals.length < 3 && (
          <div className="mt-6 text-center">
            <p className="text-gray-600">You can add {3 - goals.length} more goal{3 - goals.length > 1 ? 's' : ''}</p>
          </div>
        )}

        {goals.length === 3 && (
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">You've reached the maximum of 3 goals. Delete a goal to add a new one.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">Add Financial Goal</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Select Goal Type</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {goalTypes.map(goal => (
                    <div
                      key={goal.value}
                      onClick={() => setFormData(prev => ({ ...prev, goalType: goal.value }))}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        formData.goalType === goal.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{goal.icon}</div>
                        <div>
                          <p className="font-semibold text-gray-900">{goal.label}</p>
                          <p className="text-sm text-gray-600 mt-1">{goal.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>1 - High Priority</option>
                  <option value={2}>2 - Medium Priority</option>
                  <option value={3}>3 - Low Priority</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {timelines.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 rounded-md hover:bg-primary-600 font-semibold"
                >
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;