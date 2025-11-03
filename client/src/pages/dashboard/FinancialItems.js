import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { getFinancialItems, createFinancialItem, updateFinancialItem, deleteFinancialItem } from '../../utils/api';
import { formatCurrency } from '../../utils/formatCurrency';

const FinancialItems = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'asset',
    category: 'cash_savings',
    value: '',
    monthlyImpact: '',
    interestRate: ''
  });

  const categories = {
    asset: [
      { value: 'cash_savings', label: 'Cash/Savings' },
      { value: 'stocks_investments', label: 'Stocks/Investments' },
      { value: 'retirement_account', label: 'Retirement Account' },
      { value: 'business', label: 'Business/Side Hustle' },
      { value: 'other_asset', label: 'Other Asset' }
    ],
    liability: [
      { value: 'credit_card', label: 'Credit Card' },
      { value: 'personal_loan', label: 'Personal Loan' },
      { value: 'car_loan', label: 'Car Loan' },
      { value: 'student_loan', label: 'Student Loan' },
      { value: 'other_liability', label: 'Other Liability' }
    ]
  };

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getFinancialItems();
      setItems(data.items);
      setSummary(data.summary);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        category: value === 'asset' ? 'cash_savings' : 'credit_card'
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const itemData = {
        ...formData,
        value: parseFloat(formData.value),
        monthlyImpact: formData.monthlyImpact ? parseFloat(formData.monthlyImpact) : 0,
        interestRate: formData.interestRate ? parseFloat(formData.interestRate) : 0
      };

      if (editingItem) {
        await updateFinancialItem(editingItem._id, itemData);
      } else {
        await createFinancialItem(itemData);
      }

      setShowModal(false);
      setEditingItem(null);
      resetForm();
      loadItems();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving item');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      type: item.type,
      category: item.category,
      value: item.value.toString(),
      monthlyImpact: item.monthlyImpact?.toString() || '',
      interestRate: item.interestRate?.toString() || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteFinancialItem(id);
        loadItems();
      } catch (error) {
        alert('Error deleting item');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'asset',
      category: 'cash_savings',
      value: '',
      monthlyImpact: '',
      interestRate: ''
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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
                <Link to="/financial-items" className="text-primary-600 font-medium px-3 py-2">Financial Items</Link>
                <Link to="/goals" className="text-gray-700 hover:text-primary-600 px-3 py-2">Goals</Link>
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
            <h2 className="text-3xl font-bold text-gray-900">Financial Items</h2>
            <p className="text-gray-600 mt-2">Track your assets and liabilities</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 font-semibold"
          >
            + Add Item
          </button>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Assets</p>
              <p className="text-2xl font-bold text-accent-600">{formatCurrency(summary.totalAssets)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Total Liabilities</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(summary.totalLiabilities)}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Net Worth</p>
              <p className={`text-2xl font-bold ${summary.netWorth >= 0 ? 'text-accent-600' : 'text-red-600'}`}>
                {formatCurrency(summary.netWorth)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-2">Asset/Liability Ratio</p>
              <p className="text-2xl font-bold text-primary-600">{summary.assetToLiabilityRatio}</p>
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Assets */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Assets 💰</h3>
            <div className="space-y-4">
              {items.filter(item => item.type === 'asset').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No assets yet. Add your first one!</p>
              ) : (
                items.filter(item => item.type === 'asset').map(item => (
                  <div key={item._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{item.category.replace('_', ' ')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(item)} className="text-primary-600 hover:text-primary-700">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-accent-600">{formatCurrency(item.value)}</p>
                    {item.monthlyImpact > 0 && (
                      <p className="text-sm text-gray-600 mt-1">Monthly income: +{formatCurrency(item.monthlyImpact)}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Liabilities */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Liabilities 📉</h3>
            <div className="space-y-4">
              {items.filter(item => item.type === 'liability').length === 0 ? (
                <p className="text-gray-500 text-center py-8">No liabilities. Great job!</p>
              ) : (
                items.filter(item => item.type === 'liability').map(item => (
                  <div key={item._id} className="bg-white rounded-lg shadow p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900">{item.name}</h4>
                        <p className="text-sm text-gray-600 capitalize">{item.category.replace('_', ' ')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => handleEdit(item)} className="text-primary-600 hover:text-primary-700">Edit</button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-700">Delete</button>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-red-600">{formatCurrency(item.value)}</p>
                    {item.interestRate > 0 && (
                      <p className="text-sm text-gray-600 mt-1">Interest rate: {item.interestRate}%</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">{editingItem ? 'Edit' : 'Add'} Financial Item</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Savings Account"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="asset">Asset</option>
                  <option value="liability">Liability</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {categories[formData.type].map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Value (KES)</label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {formData.type === 'liability' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    name="interestRate"
                    value={formData.interestRate}
                    onChange={handleInputChange}
                    min="0"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setEditingItem(null); resetForm(); }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-2 rounded-md hover:bg-primary-600"
                >
                  {editingItem ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinancialItems;