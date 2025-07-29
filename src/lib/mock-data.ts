// Mock data structure for dashboard metrics
export const mockMetrics = {
  demandSupply: {
    orderFillRate: {
      current: 94.2,
      trend: "up",
      history: [91.2, 93.8, 94.2, 94.2],
      target: 95,
    },
    stockOutInstances: {
      current: 23,
      trend: "down",
      byCategory: {
        Milk: 5,
        Butter: 8,
        Cheese: 3,
        Yogurt: 4,
        "Ice Cream": 3,
      },
    },
    backorderVolume: {
      current: 2.4,
      trend: "stable",
      history: [1.8, 2.1, 2.4, 1.9, 2.2, 2.4],
    },
    forecastAccuracy: {
      current: 87.3,
      target: 85,
      excellent: 90,
    },
    productionVariance: {
      current: -1.2,
      breakdown: {
        Planned: 15.2,
        "Material Cost": -1.8,
        "Labor Variance": -0.5,
        Overhead: -0.3,
        "Quality Issues": -0.8,
        Actual: 11.8,
      },
    },
  },
  production: {
    plantUtilization: {
      current: 78.5,
      target: 80,
    },
    cycleTime: {
      current: 4.2,
      byPlant: {
        "Plant A": 4.2,
        "Plant B": 3.8,
        "Plant C": 4.5,
        "Plant D": 4.1,
      },
    },
    inventoryTurnover: {
      current: 6.8,
      trend: "up",
      sparklineData: [6.2, 6.3, 6.1, 6.4, 6.5, 6.3, 6.7, 6.8],
    },
    finishedGoods: {
      total: 45.2,
      byCategory: {
        Milk: 12.4,
        Butter: 8.7,
        Cheese: 6.2,
        Yogurt: 9.1,
        "Ice Cream": 4.8,
        Powder: 4.0,
      },
    },
    wastageRate: {
      current: 2.1,
      target: 2.0,
    },
  },
  logistics: {
    onTimeDispatch: {
      current: 92.8,
      trend: "up",
      history: [90.2, 91.5, 92.8, 92.8],
    },
    fleetUtilization: {
      current: 74.3,
      target: 75,
    },
    leadTime: {
      current: 18.5,
      distribution: {
        "12-15h": 5,
        "15-18h": 12,
        "18-21h": 18,
        "21-24h": 8,
        "24h+": 3,
      },
    },
    coldChainBreach: {
      current: 7,
      weekly: [0, 2, 1, 3, 0, 1, 0],
    },
    distributorFillRate: {
      current: 89.4,
      byRegion: {
        "Region A": 92.1,
        "Region B": 87.3,
        "Region C": 89.4,
        "Region D": 91.2,
        "Region E": 85.6,
      },
    },
  },
  market: {
    lostSales: {
      total: 8.7,
      byRegion: {
        North: 2.4,
        West: 3.1,
        East: 1.8,
        South: 1.4,
      },
    },
    returnRate: {
      current: 1.8,
      history: [2.1, 1.8, 1.9, 1.7, 1.8, 1.8],
      threshold: 2.0,
    },
    serviceLevel: {
      overall: 8.4,
      breakdown: {
        "Product Quality": 8.6,
        "Delivery Time": 8.2,
        Support: 8.7,
        "Overall Exp": 8.1,
      },
    },
    competitorPresence: {
      current: 34.2,
      comparison: {
        "Brand A": { amul: 65.8, competitor: 34.2 },
        "Brand B": { amul: 78.2, competitor: 21.8 },
        "Brand C": { amul: 61.4, competitor: 38.6 },
        Others: { amul: 58.9, competitor: 41.1 },
      },
    },
    demandResponse: {
      avgResponse: 4.2,
      demandSpikes: [120, 135, 180, 145, 160, 190, 175, 155, 140, 165],
      responseTimes: [5.2, 4.8, 3.9, 4.6, 4.1, 3.7, 3.9, 4.3, 4.7, 4.2],
    },
  },
};

export type MockMetrics = typeof mockMetrics;
