import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
      <p className="mt-2 text-gray-600">
        Welcome to the Heartfledge Logistics Manager. This is the central hub for viewing key metrics across fleet, sales, and financials.
      </p>
      <div className="mt-6 border-t border-gray-200 pt-6">
        <p className="text-sm text-gray-500">Select a module from the sidebar to dive deeper.</p>
      </div>
    </div>
  );
};

export default Dashboard;
