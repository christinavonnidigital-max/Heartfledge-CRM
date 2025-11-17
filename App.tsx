
import React, 'react';
// FIX: Ensured all component and data imports use relative paths (e.g., './') 
// to resolve module specifier errors.
import Layout from './components/Layout';
import FleetDashboard from './components/FleetDashboard';
import CrmDashboard from './components/CrmDashboard';
import FinancialsDashboard from './components/FinancialsDashboard';
import RoutesDashboard from './components/RoutesDashboard';
import Dashboard from './components/Dashboard';
import BookingsPage from './components/BookingsPage';
import DriversPage from './components/DriversPage';
import CustomersPage from './components/CustomersPage';
import ReportsPage from './components/ReportsPage';
import MarketingDashboard from './components/MarketingDashboard';
import CampaignsPage from './components/CampaignsPage';
import NewCampaignPage from './components/NewCampaignPage';
import CampaignAnalyticsPage from './components/CampaignAnalyticsPage';
import SettingsPage from './components/SettingsPage';

import { mockVehicles, mockMaintenance, mockExpenses } from './data/mockData';
import { mockLeads, mockOpportunities, mockLeadScoringRules, mockSalesReps, mockLeadActivities } from './data/mockCrmData';
import { mockInvoices, mockAllExpenses } from './data/mockFinancialsData';
import { mockRoutes, mockWaypoints } from './data/mockRoutesData';
import { mockBookings } from './data/mockBookingsData';
import { mockCampaigns, mockSalesSequences } from './data/mockMarketingData';
import { mockDrivers, mockDriverAssignments, mockUsersForDrivers } from './data/mockDriversData';
import { useState, useEffect } from 'react';


export type View = 'dashboard' | 'fleet' | 'bookings' | 'drivers' | 'customers' | 'routes' | 'reports' | 'leads' | 'campaigns' | 'new-campaign' | 'financials' | 'marketing' | 'settings' | 'analytics';

export type AppSettings = {
  defaultView: View;
  enableAssistant: boolean;
  distanceUnit: 'km' | 'mi';
  currency: 'ZAR' | 'USD';
  showFinancialSummary: boolean;
};

const DEFAULT_SETTINGS: AppSettings = {
  defaultView: 'dashboard',
  enableAssistant: true,
  distanceUnit: 'km',
  currency: 'USD',
  showFinancialSummary: true,
};

const SETTINGS_STORAGE_KEY = 'hf_app_settings';

function loadSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function App() {
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [activeView, setActiveView] = useState<View>(() => settings.defaultView);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings]);


  const contextData = {
    dashboard: {
      vehicles: mockVehicles,
      leads: mockLeads,
      opportunities: mockOpportunities,
      invoices: mockInvoices,
      bookings: mockBookings,
    },
    fleet: {
      vehicles: mockVehicles,
      maintenance: mockMaintenance,
      expenses: mockExpenses,
    },
    drivers: {
      drivers: mockDrivers,
      assignments: mockDriverAssignments,
      users: mockUsersForDrivers,
    },
    crm: {
      leads: mockLeads,
      opportunities: mockOpportunities,
      leadScoringRules: mockLeadScoringRules,
      salesReps: mockSalesReps,
      leadActivities: mockLeadActivities
    },
    financials: {
        invoices: mockInvoices,
        expenses: mockAllExpenses,
    },
    routes: {
      routes: mockRoutes,
      waypoints: mockWaypoints,
    },
    marketing: {
      campaigns: mockCampaigns,
      sequences: mockSalesSequences
    }
  };

  const renderView = () => {
    switch(activeView) {
      case 'dashboard': return <Dashboard data={contextData.dashboard} settings={settings} />;
      case 'fleet': return <FleetDashboard />;
      // FIX: The 'crm' case caused a type error because 'crm' is not a defined `View` type. It was also redundant as the 'leads' view correctly renders the CrmDashboard.
      case 'financials': return <FinancialsDashboard />;
      case 'routes': return <RoutesDashboard />;
      case 'bookings': return <BookingsPage bookings={contextData.dashboard.bookings} />;
      case 'drivers': return <DriversPage data={contextData.drivers} />;
      case 'customers': return <CustomersPage />;
      case 'reports': return <ReportsPage data={contextData} />;
      case 'leads': return <CrmDashboard />; // leads is main part of CRM
      case 'campaigns': return <CampaignsPage setActiveView={setActiveView} />;
      case 'new-campaign': return <NewCampaignPage setActiveView={setActiveView} />;
      case 'marketing': return <MarketingDashboard />;
      case 'analytics': return <CampaignAnalyticsPage />;
      case 'settings': return <SettingsPage settings={settings} onChangeSettings={setSettings} />;
      default: return <Dashboard data={contextData.dashboard} settings={settings} />;
    }
  }
  
  const getContext = () => {
    if (activeView === 'leads') return contextData.crm;
    if (['dashboard', 'fleet', 'crm', 'financials', 'routes', 'marketing', 'new-campaign', 'analytics', 'drivers'].includes(activeView)) {
        return contextData[activeView as keyof typeof contextData] || contextData.marketing;
    }
    return contextData.dashboard; // Default context
  }


  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      contextData={getContext()}
      settings={settings}
    >
      {renderView()}
    </Layout>
  );
}

export default App;