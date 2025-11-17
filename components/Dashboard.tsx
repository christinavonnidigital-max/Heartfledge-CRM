import React from 'react';
import { Vehicle, Lead, Opportunity, Invoice, Booking } from '../types';
import {
  TruckIcon,
  BriefcaseIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
} from './icons/Icons';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

type DashboardData = {
  vehicles: Vehicle[];
  leads: Lead[];
  opportunities: Opportunity[];
  invoices: Invoice[];
  bookings: Booking[];
};

type DashboardProps = {
  data: DashboardData;
};

type StatCardProps = {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: React.ReactNode;
};

const StatCard: React.FC<StatCardProps> = ({ label, value, sublabel, icon }) => {
  const formattedValue =
    typeof value === 'number' ? value.toLocaleString() : value;

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
      <div className="flex items-center justify-between gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {label}
        </p>
        <p className="mt-1 text-xl font-semibold text-slate-900">
          {formattedValue}
        </p>
        {sublabel && (
          <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>
        )}
      </div>
    </div>
  );
};

type RevenueCardProps = {
  totalInvoiced: number;
  openInvoices: number;
  paidInvoices: number;
};

const RevenueCard: React.FC<RevenueCardProps> = ({
  totalInvoiced,
  openInvoices,
  paidInvoices,
}) => {
  const totalInvoices = openInvoices + paidInvoices;
  const paidRatio = totalInvoices
    ? Math.round((paidInvoices / totalInvoices) * 100)
    : 0;

  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(totalInvoiced || 0);

  return (
    <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-r from-emerald-50 via-white to-orange-50 p-5 shadow-sm ring-1 ring-emerald-100/70">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
            <CurrencyDollarIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Revenue snapshot
            </p>
            <p className="text-sm text-slate-600">
              All time invoiced across your fleet activity
            </p>
          </div>
        </div>
        {totalInvoices > 0 && (
          <span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
            {openInvoices} open • {paidInvoices} paid
          </span>
        )}
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Total invoiced
        </p>
        <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
          {formattedTotal}
        </p>
      </div>

      {totalInvoices > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Paid invoices</span>
            <span>{paidRatio}%</span>
          </div>
          <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${paidRatio}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const getBookingStatusClass = (status: Booking['status']): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-800';
    case 'confirmed':
      return 'bg-emerald-100 text-emerald-800';
    case 'in_transit':
      return 'bg-sky-100 text-sky-800';
    case 'delivered':
      return 'bg-slate-100 text-slate-800';
    case 'cancelled':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const processRevenueTrendData = (invoices: Invoice[]) => {
  const dataByMonth: { [key: string]: number } = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  invoices.forEach(invoice => {
      const date = new Date(invoice.issue_date);
      if (isNaN(date.getTime())) return;
      
      const month = date.getUTCMonth();
      const year = date.getUTCFullYear();
      const key = `${year}-${String(month).padStart(2, '0')}`;
      
      if (!dataByMonth[key]) {
          dataByMonth[key] = 0;
      }
      dataByMonth[key] += invoice.total_amount;
  });

  const chartData = [];
  const today = new Date();
  for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const key = `${year}-${String(month).padStart(2, '0')}`;
      chartData.push({
          name: monthNames[month],
          Revenue: dataByMonth[key] || 0
      });
  }
  return chartData;
};

const processRevenueByCategoryData = (invoices: Invoice[]) => {
    const dataByCategory = invoices.reduce((acc, invoice) => {
        const type = invoice.invoice_type.charAt(0).toUpperCase() + invoice.invoice_type.slice(1);
        if (!acc[type]) {
            acc[type] = 0;
        }
        acc[type] += invoice.total_amount;
        return acc;
    }, {} as { [key: string]: number });
    
    return Object.entries(dataByCategory).map(([name, value]) => ({ name, value }));
};

const RevenueTrendChart = ({ invoices }: { invoices: Invoice[] }) => {
  const data = processRevenueTrendData(invoices);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 h-80 flex flex-col">
      <h3 className="text-sm font-semibold text-slate-900 flex-shrink-0">Revenue Trend (Last 6 Months)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 20, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#94a3b8" />
          <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" tickFormatter={(value) => `$${(value as number / 1000)}k`} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
            formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
          />
          <Line type="monotone" dataKey="Revenue" stroke="#06D6A0" strokeWidth={2} activeDot={{ r: 6 }} dot={{r: 4, fill: '#06D6A0'}} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const RevenueByCategoryChart = ({ invoices }: { invoices: Invoice[] }) => {
    const data = processRevenueByCategoryData(invoices);
    const COLORS = ['#06D6A0', '#FFD166', '#83E8BA', '#C77DFF'];

    if (data.length === 0) {
      return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 h-80 flex flex-col">
           <h3 className="text-sm font-semibold text-slate-900 flex-shrink-0">Revenue by Type</h3>
           <div className="flex-1 flex items-center justify-center text-sm text-slate-500">No revenue data available.</div>
        </div>
      );
    }

    return (
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 h-80 flex flex-col">
            <h3 className="text-sm font-semibold text-slate-900 flex-shrink-0">Revenue by Type</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius="80%"
                        innerRadius="50%"
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={5}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'white', borderRadius: '0.75rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }} 
                        formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
                    />
                    <Legend iconSize={10} wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};


const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const { vehicles, leads, opportunities, invoices, bookings } = data;

  const totalVehicles = vehicles?.length || 0;
  const totalLeads = leads?.length || 0;
  const totalOpps = opportunities?.length || 0;

  const activeBookings =
    bookings?.filter((b) =>
      ['pending', 'confirmed', 'in_transit'].includes(b.status)
    ) || [];
  const activeBookingsCount = activeBookings.length;

  const openInvoices =
    invoices?.filter(
      (inv) =>
        !['paid', 'refunded', 'cancelled'].includes(inv.status)
    ) || [];
  const paidInvoices =
    invoices?.filter((inv) => inv.status === 'paid') || [];

  const invoicedAmount =
    invoices?.reduce((sum: number, inv: Invoice) => {
      return sum + (inv.total_amount || 0);
    }, 0) || 0;

  const recentLeads = [...(leads || [])]
    .sort((a, b) => {
      const aDate = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bDate = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 3);

  const recentBookings = [...(bookings || [])]
    .sort((a, b) => {
      const aDate = a.pickup_date ? new Date(a.pickup_date).getTime() : 0;
      const bDate = b.pickup_date ? new Date(b.pickup_date).getTime() : 0;
      return bDate - aDate;
    })
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top stats */}
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Vehicles"
          value={totalVehicles}
          sublabel="In fleet"
          icon={<TruckIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Active bookings"
          value={activeBookingsCount}
          sublabel="Pending, confirmed, in transit"
          icon={<DocumentTextIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Open invoices"
          value={openInvoices.length}
          sublabel="Waiting to be paid"
          icon={<CreditCardIcon className="h-4 w-4" />}
        />
        <StatCard
          label="Opportunities"
          value={totalOpps}
          sublabel="In your pipeline"
          icon={<BriefcaseIcon className="h-4 w-4" />}
        />
      </section>

      {/* Revenue summary */}
      <section>
        <RevenueCard
          totalInvoiced={invoicedAmount}
          openInvoices={openInvoices.length}
          paidInvoices={paidInvoices.length}
        />
      </section>
      
      {/* Revenue Charts */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RevenueTrendChart invoices={invoices || []} />
        <RevenueByCategoryChart invoices={invoices || []} />
      </section>

      {/* Recent activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Leads */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent leads
              </h2>
              <p className="text-xs text-slate-500">
                Latest people and companies you are speaking to
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              {totalLeads} total
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentLeads.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No leads captured yet.
              </div>
            )}
            {recentLeads.map((lead) => {
              const name =
                `${lead.first_name || ''} ${lead.last_name || ''}`.trim() ||
                lead.company_name;
              const company = lead.company_name;
              const status = lead.lead_status?.replace('_', ' ') || '';

              const initials =
                (lead.first_name?.[0] || '') + (lead.last_name?.[0] || '');
              const safeInitials = initials || name?.[0] || '?';

              return (
                <div
                  key={lead.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-xs font-semibold text-orange-700">
                      {safeInitials.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {name}
                      </p>
                      <p className="text-xs text-slate-500">{company}</p>
                    </div>
                  </div>
                  {status && (
                    <span className="inline-flex items-center rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium capitalize text-sky-700">
                      {status}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bookings */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent bookings
              </h2>
              <p className="text-xs text-slate-500">
                Latest loads moving through your fleet
              </p>
            </div>
            <span className="inline-flex items-center rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
              {bookings?.length || 0} total
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {recentBookings.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-slate-500">
                No bookings captured yet.
              </div>
            )}
            {recentBookings.map((booking) => {
              const route = `${booking.pickup_city} \u2192 ${booking.delivery_city}`;
              const statusClass = getBookingStatusClass(booking.status);

              return (
                <div
                  key={booking.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {booking.booking_number}
                    </p>
                    <p className="text-xs text-slate-500">{route}</p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${statusClass}`}
                  >
                    {booking.status.replace('_', ' ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;