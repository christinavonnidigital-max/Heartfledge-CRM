import React from "react";
import {
  BarChartIcon,
  BriefcaseIcon,
  CreditCardIcon,
  DriverIcon,
  UsersIcon,
  TruckIcon,
  GridIcon,
  SettingsIcon,
  MapIcon,
  DocumentTextIcon,
  CampaignIcon,
  ChartPieIcon,
} from "./icons/Icons";
import { View } from "../App";

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

type NavItemConfig = {
  view: View;
  label: string;
  icon: React.ReactNode;
};

type NavSectionConfig = {
  label: string;
  items: NavItemConfig[];
};

const navSections: NavSectionConfig[] = [
  {
    label: "Command center",
    items: [
      {
        view: "dashboard",
        label: "Overview",
        icon: <GridIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    label: "Fleet ops",
    items: [
      { view: "fleet", label: "Fleet", icon: <TruckIcon className="h-5 w-5" /> },
      {
        view: "bookings",
        label: "Bookings",
        icon: <DocumentTextIcon className="h-5 w-5" />,
      },
      { view: "routes", label: "Routes", icon: <MapIcon className="h-5 w-5" /> },
      { view: "drivers", label: "Drivers", icon: <DriverIcon className="h-5 w-5" /> },
    ],
  },
  {
    label: "Customers",
    items: [
      { view: "leads", label: "Leads", icon: <BriefcaseIcon className="h-5 w-5" /> },
      { view: "customers", label: "Customers", icon: <UsersIcon className="h-5 w-5" /> },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        view: "marketing",
        label: "Campaigns",
        icon: <CampaignIcon className="h-5 w-5" />,
      },
      {
        view: "campaigns",
        label: "Sequences",
        icon: <DocumentTextIcon className="h-5 w-5" />,
      },
      {
        view: "analytics",
        label: "Performance",
        icon: <ChartPieIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        view: "financials",
        label: "Financials",
        icon: <CreditCardIcon className="h-5 w-5" />,
      },
      {
        view: "reports",
        label: "Reports",
        icon: <BarChartIcon className="h-5 w-5" />,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        view: "settings",
        label: "Settings",
        icon: <SettingsIcon className="h-5 w-5" />,
      },
    ],
  },
];

interface NavItemProps {
  item: NavItemConfig;
  activeView: View;
  onClick: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ item, activeView, onClick }) => {
  const isActive = item.view === activeView;

  return (
    <button
      type="button"
      onClick={() => onClick(item.view)}
      className={[
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all",
        isActive
          ? "bg-slate-900/95 text-white shadow-md ring-1 ring-orange-400/70"
          : "text-slate-200 hover:bg-slate-800/80 hover:text-white",
      ].join(" ")}
    >
      <span
        className={[
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border text-sm transition-colors",
          isActive
            ? "border-orange-300 bg-orange-500 text-white"
            : "border-slate-700 bg-slate-950 text-slate-200 group-hover:border-slate-500",
        ].join(" ")}
      >
        {item.icon}
      </span>
      <span className="truncate">{item.label}</span>
    </button>
  );
};

const SidebarShell: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  setIsOpen,
}) => {
  const handleNavClick = (view: View) => {
    setActiveView(view);
    setIsOpen(false);
  };

  return (
    <div className="flex h-full w-72 flex-col bg-gradient-to-b from-[#050817] via-[#050817] to-[#020617] text-slate-100 shadow-2xl">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-800 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-md">
          <TruckIcon className="h-5 w-5" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="text-sm font-semibold tracking-tight">Heartfledge</span>
          <span className="text-[11px] text-slate-400">Logistics and CRM hub</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-4 overflow-y-auto px-3 py-4 custom-scrollbar">
        {navSections.map((section) => (
          <div key={section.label}>
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500/80">
              {section.label}
            </p>
            <div className="space-y-1.5">
              {section.items.map((item) => (
                <NavItem
                  key={item.view}
                  item={item}
                  activeView={activeView}
                  onClick={handleNavClick}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-800 px-4 py-3 text-[11px] text-slate-500">
        <p className="truncate">Signed in as</p>
        <p className="truncate font-medium text-slate-200">
          dispatcher@heartfledge.local
        </p>
      </div>
    </div>
  );
};

const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  setActiveView,
  isOpen,
  setIsOpen,
}) => {
  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-black/40 transition-opacity ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsOpen(false)}
        />

        <div
          className={`absolute inset-y-0 left-0 w-72 transform transition-transform duration-200 ease-out ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <SidebarShell
            activeView={activeView}
            setActiveView={setActiveView}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-72">
        <SidebarShell
          activeView={activeView}
          setActiveView={setActiveView}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      </div>
    </>
  );
};

export default Sidebar;