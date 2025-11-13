
import React, { useState } from 'react';
import Layout from './components/Layout';
import FleetDashboard from './components/FleetDashboard';
import CrmDashboard from './components/CrmDashboard';
import FinancialsDashboard from './components/FinancialsDashboard';
import RoutesDashboard from './components/RoutesDashboard';
import { mockVehicles, mockMaintenance, mockExpenses } from './data/mockData';
import { mockLeads, mockOpportunities, mockLeadScoringRules } from './data/mockCrmData';
import { mockInvoices, mockAllExpenses } from './data/mockFinancialsData';
import { mockRoutes, mockWaypoints } from './data/mockRoutesData';


export type View = 'fleet' | 'crm' | 'financials' | 'routes';

function App() {
  const [activeView, setActiveView] = useState<View>('fleet');

  const contextData = {
    fleet: {
      vehicles: mockVehicles,
      maintenance: mockMaintenance,
      expenses: mockExpenses,
    },
    crm: {
      leads: mockLeads,
      opportunities: mockOpportunities,
      leadScoringRules: mockLeadScoringRules,
    },
    financials: {
        invoices: mockInvoices,
        expenses: mockAllExpenses,
    },
    routes: {
      routes: mockRoutes,
      waypoints: mockWaypoints,
    }
  };

  const renderView = () => {
    switch(activeView) {
      case 'fleet': return <FleetDashboard />;
      case 'crm': return <CrmDashboard />;
      case 'financials': return <FinancialsDashboard />;
      case 'routes': return <RoutesDashboard />;
      default: return <FleetDashboard />;
    }
  }

  return (
    <Layout 
      activeView={activeView} 
      setActiveView={setActiveView}
      contextData={contextData[activeView]}
    >
      {renderView()}
    </Layout>
  );
}

export default App;