
import React from "react";
import { ShellCard, SubtleCard, SectionHeader } from "./UiKit";
import {
  UsersIcon,
  CreditCardIcon,
  CogIcon,
  SparklesIcon,
} from "./icons/Icons";
import { AppSettings, View } from "../App";
import { Currency } from "../types";

interface SettingsPageProps {
  settings: AppSettings;
  onChangeSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const viewTitles: Record<View, string> = {
  dashboard: "Dashboard",
  fleet: "Fleet",
  bookings: "Bookings",
  drivers: "Drivers",
  customers: "Customers",
  routes: "Routes",
  leads: "Leads",
  campaigns: "Sequences",
  "new-campaign": "New Campaign",
  financials: "Financials",
  reports: "Reports",
  marketing: "Campaigns",
  settings: "Settings",
  analytics: "Analytics",
};


const SettingsToggle: React.FC<{
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}> = ({ label, description, enabled, onToggle }) => (
  <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
    <div>
        <span className="text-sm text-slate-800 font-medium">{label}</span>
        <p className="text-xs text-slate-500">{description}</p>
    </div>
    <button
      type="button"
      onClick={onToggle}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
        enabled ? 'bg-orange-500' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  </div>
);


const SettingsPage: React.FC<SettingsPageProps> = ({ settings, onChangeSettings }) => {

  const handleToggle = (key: keyof AppSettings) => {
    onChangeSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChangeSettings(prev => ({ ...prev, [name]: value }));
  };


  return (
    <div className="space-y-6">
      <ShellCard className="px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              System settings
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Manage application preferences and user access for your Heartfledge
              workspace.
            </p>
          </div>
        </div>
      </ShellCard>

      <div className="grid gap-5 md:grid-cols-2">
        <ShellCard className="px-5 py-4">
          <SectionHeader
            title="Application preferences"
            subtitle="Control how Heartfledge behaves for all users."
          />
          <div className="mt-4 space-y-4">
              <SettingsToggle
                label="Enable AI Assistant"
                description="Show the AI assistant widget on all pages."
                enabled={settings.enableAssistant}
                onToggle={() => handleToggle('enableAssistant')}
              />
               <SettingsToggle
                label="Show Financial Summaries"
                description="Display revenue card on the main dashboard."
                enabled={settings.showFinancialSummary}
                onToggle={() => handleToggle('showFinancialSummary')}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700">Default View</label>
                      <select name="defaultView" value={settings.defaultView} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm">
                          {Object.entries(viewTitles).map(([key, title]) => (
                            <option key={key} value={key}>{title}</option>
                          ))}
                      </select>
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700">Default Currency</label>
                      <select name="currency" value={settings.currency} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm">
                          <option value="USD">USD</option>
                          <option value="ZAR">ZAR</option>
                      </select>
                  </div>
                   <div>
                      <label className="block text-sm font-medium text-slate-700">Distance Unit</label>
                      <select name="distanceUnit" value={settings.distanceUnit} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm">
                          <option value="km">Kilometers (km)</option>
                          <option value="mi">Miles (mi)</option>
                      </select>
                  </div>
              </div>
          </div>
        </ShellCard>
        
        <ShellCard className="px-5 py-4">
          <SectionHeader
            title="User management"
            subtitle="Invite dispatchers, managers, and finance users."
          />
          <div className="mt-4 flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <UsersIcon className="h-5 w-5" />
            </div>
            <div className="text-sm text-slate-600">
              <p>
                User roles and permissions are currently in development. Soon you'll be able to assign roles and limit access to specific modules.
              </p>
            </div>
          </div>
        </ShellCard>

        <ShellCard className="px-5 py-4">
          <SectionHeader
            title="Integrations"
            subtitle="Connect maps, email, and other tools."
          />
           <div className="mt-4 flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <SparklesIcon className="h-5 w-5" />
            </div>
            <div className="text-sm text-slate-600">
              <p>
                Manage connections to external services like Google Maps, email providers, or accounting systems. This feature is coming soon.
              </p>
            </div>
          </div>
        </ShellCard>

        <ShellCard className="px-5 py-4">
          <SectionHeader
            title="Billing and plans"
            subtitle="Manage subscription and payment details."
          />
           <div className="mt-4 flex items-start gap-3">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <CreditCardIcon className="h-5 w-5" />
            </div>
            <div className="text-sm text-slate-600">
              <p>
                Your subscription and billing history will be available here once the payment system is integrated.
              </p>
            </div>
          </div>
        </ShellCard>

      </div>
    </div>
  );
};

export default SettingsPage;