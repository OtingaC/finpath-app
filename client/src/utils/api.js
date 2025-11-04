import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Financial Items
export const getFinancialItems = async () => {
  const response = await axios.get(`${API_URL}/financial-items`);
  return response.data;
};

export const createFinancialItem = async (itemData) => {
  const response = await axios.post(`${API_URL}/financial-items`, itemData);
  return response.data;
};

export const updateFinancialItem = async (id, itemData) => {
  const response = await axios.put(`${API_URL}/financial-items/${id}`, itemData);
  return response.data;
};

export const deleteFinancialItem = async (id) => {
  const response = await axios.delete(`${API_URL}/financial-items/${id}`);
  return response.data;
};

// Goals
export const getGoals = async () => {
  const response = await axios.get(`${API_URL}/goals`);
  return response.data;
};

export const createGoal = async (goalData) => {
  const response = await axios.post(`${API_URL}/goals`, goalData);
  return response.data;
};

export const updateGoal = async (id, goalData) => {
  const response = await axios.put(`${API_URL}/goals/${id}`, goalData);
  return response.data;
};

export const deleteGoal = async (id) => {
  const response = await axios.delete(`${API_URL}/goals/${id}`);
  return response.data;
};

// Roadmap
export const getRoadmap = async () => {
  const response = await axios.get(`${API_URL}/roadmap`);
  return response.data;
};

export const generateRoadmap = async () => {
  const response = await axios.post(`${API_URL}/roadmap/generate`);
  return response.data;
};

export const updateRoadmapProgress = async (stepNumber, progress) => {
  const response = await axios.put(`${API_URL}/roadmap/progress/${stepNumber}`, { progress });
  return response.data;
};

export const deleteRoadmap = async () => {
  const response = await axios.delete(`${API_URL}/roadmap`);
  return response.data;
};