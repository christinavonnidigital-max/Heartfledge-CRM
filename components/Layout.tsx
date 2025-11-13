import React from 'react';
import Sidebar from './Sidebar';
import { TruckIcon } from './icons/Icons';
import FleetAssistant from './FleetAssistant';
import { View } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  activeView: View;
  setActiveView: (view: View) => void;
  contextData: any;
}

const Layout: React.FC<LayoutProps> = ({ children, activeView, setActiveView, contextData }) => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <Sidebar activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg text-white">
              <TruckIcon className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-semibold">Heartfledge Logistics</h1>
          </div>
          <div>
            {/* User profile section can go here */}
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
      <FleetAssistant contextData={contextData} contextType={activeView} />
    </div>
  );
};

export default Layout;