/**
 * Format number to KES currency with proper formatting
 * @param {number} amount - The amount to format
 * @param {boolean} includeDecimals - Whether to include decimal places (default: false)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, includeDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'KES 0';
  }

  const options = {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  };

  return new Intl.NumberFormat('en-KE', options).format(amount);
};

/**
 * Format number to compact notation (e.g., 1.5M, 250K)
 * @param {number} amount - The amount to format
 * @returns {string} Compact formatted string
 */
export const formatCompactCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'KES 0';
  }

  const options = {
    style: 'currency',
    currency: 'KES',
    notation: 'compact',
    maximumFractionDigits: 1
  };

  return new Intl.NumberFormat('en-KE', options).format(amount);
};

/**
 * Format number with commas but without currency symbol
 * @param {number} amount - The amount to format
 * @param {boolean} includeDecimals - Whether to include decimal places (default: false)
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount, includeDecimals = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0';
  }

  const options = {
    minimumFractionDigits: includeDecimals ? 2 : 0,
    maximumFractionDigits: includeDecimals ? 2 : 0
  };

  return new Intl.NumberFormat('en-KE', options).format(amount);
};

/**
 * Format percentage
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 0)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  return `${value.toFixed(decimals)}%`;
};

// Export as default object for convenience
export default {
  formatCurrency,
  formatCompactCurrency,
  formatNumber,
  formatPercentage
};