import React from 'react';
import { Vehicle, Lead, Opportunity, Invoice, Booking } from '../types';
import { TruckIcon, BriefcaseIcon, CreditCardIcon, UsersIcon, DocumentTextIcon, CurrencyDollarIcon } from './icons/Icons';

type DashboardData = {
  vehicles: Vehicle[];
  leads: Lead[];
  opportunities: Opportunity[];
  invoices: Invoice[];
  bookings: Booking[];
};

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex items-center">
        <div className="p-3 bg-orange-100 text-orange-600 rounded-full mr-4">{icon}</div>
        <div>
            <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">{label}</h3>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
  );
};

type DashboardProps = {
  data: DashboardData;
};

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { vehicles, leads, opportunities, invoices, bookings } = data;

  const totalVehicles = vehicles?.length || 0;
  const totalLeads = leads?.length || 0;
  const totalOpps = opportunities?.length || 0;
  const totalInvoices = invoices?.length || 0;
  const totalBookings = bookings?.length || 0;

  const invoicedAmount = invoices?.reduce((sum: number, inv: Invoice) => {
    return sum + (inv.total_amount || 0);
  }, 0);

  const recentLeads = leads?.slice(0, 5) || [];
  const recentBookings = bookings?.slice(0, 5) || [];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <StatCard
          label="Vehicles"
          value={totalVehicles}
          icon={<TruckIcon className="w-6 h-6" />}
        />
        <StatCard
          label="Leads"
          value={totalLeads}
          icon={<BriefcaseIcon className="w-6 h-6" />}
        />
        <StatCard
          label="Opportunities"
          value={totalOpps}
          icon={<UsersIcon className="w-6 h-6" />}
        />
        <StatCard
          label="Invoices"
          value={totalInvoices}
          icon={<CreditCardIcon className="w-6 h-6" />}
        />
        <StatCard
          label="Bookings"
          value={totalBookings}
          icon={<DocumentTextIcon className="w-6 h-6" />}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="p-4 bg-green-100 text-green-600 rounded-full mr-6">
                <CurrencyDollarIcon className="w-8 h-8" />
            </div>
            <div>
                <h3 className="text-gray-500 text-lg font-medium">Total Invoiced Amount</h3>
                {/* FIX: Resolved a TypeScript error ("Expected 0 arguments, but got 2") by using `Intl.NumberFormat` for currency formatting, which avoids ambiguity with some TypeScript compiler/linter configurations that incorrectly infer the method signature of `toLocaleString`. */}
                <p className="text-3xl font-bold text-gray-900">
                    {new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: 'USD', // Assuming USD as base currency for dashboard summary
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    }).format(invoicedAmount)}
                </p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold p-4 border-b border-gray-200">Recent Leads</h2>
          <div className="p-4 space-y-3">
            {recentLeads.length === 0 && (
              <div className="text-center py-4 text-gray-500">No leads yet.</div>
            )}
            {recentLeads.map((lead: Lead) => {
              const name = `${lead.first_name || ''} ${lead.last_name || ''}`.trim() || lead.company_name;
              const company = lead.company_name;
              const status = lead.lead_status;

              return (
                <div key={lead.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                        <p className="font-semibold text-gray-900">{name}</p>
                        <p className="text-sm text-gray-500">{company}</p>
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 capitalize">{status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold p-4 border-b border-gray-200">Recent Bookings</h2>
          <div className="p-4 space-y-3">
            {recentBookings.length === 0 && (
              <div className="text-center py-4 text-gray-500">No bookings yet.</div>
            )}
            {recentBookings.map((booking: Booking) => {
              const ref = booking.booking_number || `ID: ${booking.id}`;
              const route = `${booking.pickup_location} → ${booking.delivery_location}`;

              return (
                <div key={booking.id} className="p-3 bg-gray-50 rounded-lg">
                     <div className="flex justify-between items-center">
                        <div>
                            <p className="font-semibold text-gray-900">{ref}</p>
                            <p className="text-sm text-gray-500">{route}</p>
                        </div>
                         <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 capitalize">{booking.status}</span>
                     </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
