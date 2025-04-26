import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar, Line } from 'react-chartjs-2';
import styles from './Dashboard.module.css';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const themeColors = {
  primary: '#0D1B2A',
  secondary: '#1B263B',
  tertiary: '#415A77',
  quaternary: '#778DA9',
  light: '#E0E1DD'
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/dashboard/');
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>Error: {error}</div>;

  // Tenant by Location Pie Chart
  const tenantPieData = {
    labels: dashboardData?.tenant_location_data?.labels || [],
    datasets: [
      {
        data: dashboardData?.tenant_location_data?.data || [],
        backgroundColor: [
          themeColors.primary,
          themeColors.secondary,
          themeColors.tertiary,
          themeColors.quaternary,
          themeColors.light
        ],
        borderColor: themeColors.primary,
        borderWidth: 1
      }
    ]
  };

  // Owner by Location Pie Chart
  const ownerPieData = {
    labels: dashboardData?.owner_location_data?.labels || [],
    datasets: [
      {
        data: dashboardData?.owner_location_data?.data || [],
        backgroundColor: [
          themeColors.primary,
          themeColors.secondary,
          themeColors.tertiary,
          themeColors.quaternary,
          themeColors.light
        ],
        borderColor: themeColors.primary,
        borderWidth: 1
      }
    ]
  };

  // Property by Location Bar Chart
  const propertyBarData = {
    labels: dashboardData?.property_location_data?.labels || [],
    datasets: [
      {
        label: 'Properties',
        data: dashboardData?.property_location_data?.data || [],
        backgroundColor: themeColors.tertiary,
        borderColor: themeColors.primary,
        borderWidth: 1
      }
    ]
  };

  // Utility Cost by Location Bar Chart
  const utilityCostData = {
    labels: dashboardData?.utility_cost_data?.labels || [],
    datasets: [
      {
        label: 'Transport',
        data: dashboardData?.utility_cost_data?.transport || [],
        backgroundColor: themeColors.primary,
      },
      {
        label: 'Utility',
        data: dashboardData?.utility_cost_data?.utility || [],
        backgroundColor: themeColors.secondary,
      },
      {
        label: 'Food',
        data: dashboardData?.utility_cost_data?.food || [],
        backgroundColor: themeColors.tertiary,
      },
      {
        label: 'Entertainment',
        data: dashboardData?.utility_cost_data?.entertainment || [],
        backgroundColor: themeColors.quaternary,
      },
      {
        label: 'Healthcare',
        data: dashboardData?.utility_cost_data?.healthcare || [],
        backgroundColor: themeColors.light,
      },
      {
        label: 'Clothing',
        data: dashboardData?.utility_cost_data?.clothing || [],
        backgroundColor: '#A5A58D',
      },
      {
        label: 'Pet Health',
        data: dashboardData?.utility_cost_data?.pethealth || [],
        backgroundColor: '#B7B7A4',
      }
    ]
  };

  // Monthly Registrations Line Chart
  const monthlyRegistrationsData = {
    labels: dashboardData?.monthly_registrations?.labels || [],
    datasets: [
      {
        label: 'Owners',
        data: dashboardData?.monthly_registrations?.owners || [],
        borderColor: themeColors.primary,
        backgroundColor: themeColors.primary,
        tension: 0.1
      },
      {
        label: 'Tenants',
        data: dashboardData?.monthly_registrations?.tenants || [],
        borderColor: themeColors.tertiary,
        backgroundColor: themeColors.tertiary,
        tension: 0.1
      }
    ]
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Property Management Dashboard</h1>
      
      <div className={styles.grid}>
        {/* Tenant Distribution by Location */}
        <div className={styles.card}>
          <h2>Tenant Distribution by Location</h2>
          <div className={styles.chartContainer}>
            <Pie 
              data={tenantPieData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Owner Distribution by Location */}
        <div className={styles.card}>
          <h2>Owner Distribution by Location</h2>
          <div className={styles.chartContainer}>
            <Pie 
              data={ownerPieData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'right',
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Property Distribution by Location */}
        <div className={styles.card}>
          <h2>Property Distribution by Location</h2>
          <div className={styles.chartContainer}>
            <Bar 
              data={propertyBarData} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Utility Costs by Location */}
        <div className={styles.card}>
          <h2>Utility Costs by Location</h2>
          <div className={styles.chartContainer}>
            <Bar 
              data={utilityCostData} 
              options={{
                responsive: true,
                scales: {
                  x: {
                    stacked: true,
                  },
                  y: {
                    stacked: true
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Monthly Registrations */}
        <div className={`${styles.card} ${styles.fullWidth}`}>
          <h2>Monthly User Registrations</h2>
          <div className={styles.chartContainer}>
            <Line 
              data={monthlyRegistrationsData} 
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;