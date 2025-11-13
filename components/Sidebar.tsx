
import React from 'react';
import { BarChartIcon, BriefcaseIcon, CreditCardIcon, DriverIcon, MapIcon, SettingsIcon, TruckIcon, UsersIcon } from './icons/Icons';
import { View } from '../App';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { id: 'fleet', icon: <TruckIcon className="w-6 h-6" />, name: 'Fleet', view: 'fleet' as View },
    { id: 'routes', icon: <MapIcon className="w-6 h-6" />, name: 'Routes', view: 'routes' as View },
    { id: 'crm', icon: <BriefcaseIcon className="w-6 h-6" />, name: 'CRM', view: 'crm' as View },
    { id: 'financials', icon: <CreditCardIcon className="w-6 h-6" />, name: 'Financials', view: 'financials' as View },
  ];
  
  const secondaryNavItems = [
    { id: 'drivers', icon: <DriverIcon className="w-6 h-6" />, name: 'Drivers' },
    { id: 'customers', icon: <UsersIcon className="w-6 h-6" />, name: 'Customers' },
    { id: 'analytics', icon: <BarChartIcon className="w-6 h-6" />, name: 'Analytics' },
    { id: 'settings', icon: <SettingsIcon className="w-6 h-6" />, name: 'Settings' },
  ]

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="h-16 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400">
        Heartfledge
      </div>
      <nav className="flex-1 px-4 py-4 space-y-2">
        {navItems.map((item) => (
          <a
            key={item.name}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setActiveView(item.view);
            }}
            className={`flex items-center px-4 py-2 text-lg rounded-lg transition-colors duration-200 ${
              activeView === item.view
                ? 'bg-blue-500 text-white dark:bg-blue-600'
                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {item.icon}
            <span className="ml-3">{item.name}</span>
          </a>
        ))}
         <div className="pt-4 mt-4 space-y-2 border-t border-gray-200 dark:border-gray-700">
            {secondaryNavItems.map((item) => (
                 <a
                    key={item.name}
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center px-4 py-2 text-lg rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                </a>
            ))}
         </div>
      </nav>
    </div>
  );
};

export default Sidebar;