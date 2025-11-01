// Roadmap Generation Algorithm

const generateRoadmap = (user, financialState, goals) => {
  const roadmap = [];
  let stepNumber = 0;

  // Calculate monthly expenses (assume 70% of income)
  const monthlyExpenses = user.profile.monthlyIncome * 0.7;
  
  // Emergency fund targets
  const twoMonthEmergency = monthlyExpenses * 2;
  const sixMonthEmergency = monthlyExpenses * 6;
  
  // Get cash assets (emergency fund proxy)
  const currentEmergencyFund = financialState.cashAssets || 0;

  // === FOUNDATION LAYER ===
  // Step 1: Build minimum emergency fund (2 months)
  if (currentEmergencyFund < twoMonthEmergency) {
    roadmap.push({
      stepNumber: ++stepNumber,
      title: 'Build 2-Month Emergency Fund',
      description: `Save $${twoMonthEmergency.toFixed(2)} as your financial safety net. This protects you from unexpected expenses.`,
      category: 'foundation',
      priority: 1,
      canRunParallel: false,
      targetAmount: twoMonthEmergency,
      currentProgress: currentEmergencyFund > 0 ? Math.min((currentEmergencyFund / twoMonthEmergency) * 100, 100) : 0,
      reasoning: 'Emergency fund is the foundation of financial security'
    });
  }

  // Step 2: Eliminate high-interest debt
  if (financialState.hasHighInterestDebt) {
    roadmap.push({
      stepNumber: ++stepNumber,
      title: 'Eliminate High-Interest Debt',
      description: 'Pay off credit cards and loans with interest rates above 10%. Use the avalanche method (highest interest first).',
      category: 'foundation',
      priority: 2,
      canRunParallel: false,
      targetAmount: financialState.totalLiabilities,
      currentProgress: 0,
      reasoning: 'High-interest debt costs more than investment returns'
    });
  }

  // Step 3: Expand emergency fund to 6 months (if 2 months achieved)
  if (currentEmergencyFund >= twoMonthEmergency && currentEmergencyFund < sixMonthEmergency) {
    roadmap.push({
      stepNumber: ++stepNumber,
      title: 'Expand Emergency Fund to 6 Months',
      description: `Grow your safety net to $${sixMonthEmergency.toFixed(2)}. This provides robust protection.`,
      category: 'foundation',
      priority: 3,
      canRunParallel: true,
      targetAmount: sixMonthEmergency,
      currentProgress: (currentEmergencyFund / sixMonthEmergency) * 100,
      reasoning: 'Larger emergency fund enables risk-taking in investing and business'
    });
  }

  // === GOAL-BASED LAYER ===
  // Process user goals (sorted by priority)
  const sortedGoals = goals.sort((a, b) => a.priority - b.priority);

  sortedGoals.forEach(goal => {
    switch (goal.goalType) {
      case 'emergency_fund':
        // Already handled in foundation
        if (currentEmergencyFund >= sixMonthEmergency) {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Emergency Fund Complete ✓',
            description: 'Your emergency fund goal is achieved. Maintain this buffer.',
            category: 'foundation',
            priority: 5,
            canRunParallel: true,
            targetAmount: sixMonthEmergency,
            currentProgress: 100,
            reasoning: 'Goal accomplished'
          });
        }
        break;

      case 'start_investing':
        if (currentEmergencyFund >= twoMonthEmergency && !financialState.hasHighInterestDebt) {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Start Investing in Index Funds',
            description: 'Begin with 10-15% of monthly income in low-cost index funds. Start with $100-500/month.',
            category: 'wealth-building',
            priority: 2,
            canRunParallel: true,
            targetAmount: 0,
            currentProgress: financialState.investmentAssets > 0 ? 50 : 0,
            reasoning: 'Time in the market beats timing the market'
          });
        } else {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Prepare Foundation for Investing',
            description: 'Complete emergency fund and eliminate high-interest debt before investing.',
            category: 'preparation',
            priority: 4,
            canRunParallel: false,
            targetAmount: 0,
            currentProgress: 0,
            reasoning: 'Foundation must be solid before building wealth'
          });
        }
        break;

      case 'start_business':
        const isEntrepreneur = user.profile.employmentStatus === 'entrepreneur';
        
        if (isEntrepreneur) {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Invest in Business Growth',
            description: 'Allocate resources to scale your business. Focus on revenue-generating activities.',
            category: 'wealth-building',
            priority: 2,
            canRunParallel: true,
            targetAmount: 0,
            currentProgress: financialState.businessAssets > 0 ? 40 : 0,
            reasoning: 'Your business is your primary wealth vehicle'
          });

          // Entrepreneurs need larger emergency fund
          if (currentEmergencyFund < sixMonthEmergency) {
            roadmap.push({
              stepNumber: ++stepNumber,
              title: 'Increase Emergency Fund (Business Risk)',
              description: 'As an entrepreneur, maintain 6-12 months of expenses due to income variability.',
              category: 'foundation',
              priority: 2,
              canRunParallel: true,
              targetAmount: sixMonthEmergency,
              currentProgress: (currentEmergencyFund / sixMonthEmergency) * 100,
              reasoning: 'Business income is less stable than employment'
            });
          }
        } else {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Launch Side Hustle',
            description: 'Start a side business alongside your employment. Begin with low-cost, skill-based ventures.',
            category: 'wealth-building',
            priority: 3,
            canRunParallel: true,
            targetAmount: 0,
            currentProgress: 0,
            reasoning: 'Diversify income sources and build entrepreneurial skills'
          });
        }
        break;

      case 'passive_income':
        const assetThreshold = monthlyExpenses * 12;
        
        if (financialState.totalAssets >= assetThreshold) {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Build Passive Income Streams',
            description: 'Invest in dividend stocks, rental properties, or digital products that generate income.',
            category: 'advanced',
            priority: 3,
            canRunParallel: true,
            targetAmount: 0,
            currentProgress: 20,
            reasoning: 'Sufficient asset base to generate meaningful passive income'
          });
        } else {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Build Asset Base for Passive Income',
            description: `Accumulate $${assetThreshold.toFixed(2)} in assets before focusing on passive income.`,
            category: 'preparation',
            priority: 4,
            canRunParallel: true,
            targetAmount: assetThreshold,
            currentProgress: (financialState.totalAssets / assetThreshold) * 100,
            reasoning: 'Need sufficient capital to generate meaningful passive income'
          });
        }
        break;

      case 'retire_early':
        roadmap.push({
          stepNumber: ++stepNumber,
          title: 'Aggressive Retirement Investing',
          description: 'Target 30-50% savings rate. Max out retirement accounts and invest in index funds.',
          category: 'wealth-building',
          priority: 2,
          canRunParallel: true,
          targetAmount: 0,
          currentProgress: 0,
          reasoning: 'Early retirement requires aggressive saving and investing'
        });
        break;

      case 'debt_freedom':
        if (financialState.totalLiabilities > 0) {
          roadmap.push({
            stepNumber: ++stepNumber,
            title: 'Execute Debt Payoff Strategy',
            description: 'Use avalanche method: pay minimum on all debts, extra payments to highest interest rate.',
            category: 'foundation',
            priority: 2,
            canRunParallel: false,
            targetAmount: financialState.totalLiabilities,
            currentProgress: 0,
            reasoning: 'Debt freedom provides financial flexibility and peace of mind'
          });
        }
        break;
    }
  });

  // === ADVANCED LAYER (for users with solid foundation) ===
  if (currentEmergencyFund >= sixMonthEmergency && 
      !financialState.hasHighInterestDebt && 
      financialState.totalAssets > monthlyExpenses * 12) {
    
    roadmap.push({
      stepNumber: ++stepNumber,
      title: 'Diversify Investments',
      description: 'Explore real estate, bonds, or alternative investments. Don\'t put all eggs in one basket.',
      category: 'advanced',
      priority: 5,
      canRunParallel: true,
      targetAmount: 0,
      currentProgress: 0,
      reasoning: 'Diversification reduces risk and maximizes returns'
    });
  }

  // === EMPLOYMENT-SPECIFIC ADDITIONS ===
  if (user.profile.employmentStatus === 'student') {
    roadmap.push({
      stepNumber: ++stepNumber,
      title: 'Invest in Skills & Education',
      description: 'Your biggest asset is your earning potential. Focus on high-value skills.',
      category: 'foundation',
      priority: 1,
      canRunParallel: true,
      targetAmount: 0,
      currentProgress: 0,
      reasoning: 'Human capital is the foundation of wealth creation'
    });
  }

  // Sort by priority and limit to 4-6 most important steps
  const finalRoadmap = roadmap
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 6)
    .map((step, index) => ({
      ...step,
      stepNumber: index + 1
    }));

  return finalRoadmap;
};

module.exports = { generateRoadmap };