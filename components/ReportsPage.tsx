
import React, { useState, useMemo } from 'react';
import { ShellCard, SectionHeader, SubtleCard, StatusPill } from './UiKit';
import { Vehicle, VehicleMaintenance, VehicleExpense, Lead, Opportunity, Invoice, Expense, User, VehicleStatus, InvoiceStatus, OpportunityStage, ExpenseCategory } from '../types';
import { FunnelChart, Funnel, Tooltip, LabelList, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { CurrencyDollarIcon } from './icons/Icons';

interface ReportsPageProps {
  data: {
    fleet: { vehicles: Vehicle[], maintenance: VehicleMaintenance[], expenses: VehicleExpense[] };
    crm: { leads: Lead[], opportunities: Opportunity[], salesReps: User[] };
    financials: { invoices: Invoice[], expenses: Expense[] };
  }
}

const StatCard: React.FC<{ label: string; value: string | number; sublabel?: string }> = ({ label, value, sublabel }) => (
    <SubtleCard className="p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-slate-900">{value}</p>
        {sublabel && <p className="mt-0.5 text-xs text-slate-500">{sublabel}</p>}
    </SubtleCard>
);

const FleetReport: React.FC<{ fleetData: ReportsPageProps['data']['fleet'] }> = ({ fleetData }) => {
    const maintenanceCosts = useMemo(() => {
        const costs: { [key: number]: number } = {};
        fleetData.maintenance.forEach(m => {
            costs[m.vehicle_id] = (costs[m.vehicle_id] || 0) + m.cost;
        });
        return fleetData.vehicles.map(v => ({
            name: v.registration_number,
            Cost: costs[v.id] || 0,
        }));
    }, [fleetData]);

    const statusDistribution = useMemo(() => {
        const counts = fleetData.vehicles.reduce((acc, v) => {
            acc[v.status] = (acc[v.status] || 0) + 1;
            return acc;
        }, {} as { [key in VehicleStatus]: number });
        return Object.entries(counts).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));
    }, [fleetData]);

    const fleetSummary = useMemo(() => {
        return fleetData.vehicles.map(v => {
            const totalExpenses = fleetData.expenses
                .filter(e => e.vehicle_id === v.id)
                .reduce((sum, e) => sum + e.amount, 0);
            return { ...v, totalExpenses };
        });
    }, [fleetData]);

    const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubtleCard className="p-4">
                    <h3 className="text-sm font-semibold mb-4">Maintenance Costs per Vehicle</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={maintenanceCosts} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                            <YAxis tickFormatter={(value) => `$${value}`} tick={{ fontSize: 10 }}/>
                            <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                            <Bar dataKey="Cost" fill="#f97316" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </SubtleCard>
                <SubtleCard className="p-4">
                    <h3 className="text-sm font-semibold mb-4">Vehicle Status Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={statusDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                {statusDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </SubtleCard>
            </div>
            <SubtleCard className="p-4">
                 <h3 className="text-sm font-semibold mb-4">Fleet Summary</h3>
                 <div className="overflow-x-auto">
                     <table className="min-w-full text-sm">
                         <thead className="text-xs uppercase text-slate-500">
                             <tr>
                                 <th className="px-3 py-2">Registration</th>
                                 <th className="px-3 py-2">Make/Model</th>
                                 <th className="px-3 py-2">Status</th>
                                 <th className="px-3 py-2 text-right">Current KM</th>
                                 <th className="px-3 py-2 text-right">Total Expenses</th>
                             </tr>
                         </thead>
                         <tbody className="divide-y divide-slate-100">
                             {fleetSummary.map(v => (
                                 <tr key={v.id}>
                                     <td className="px-3 py-2 font-medium">{v.registration_number}</td>
                                     <td className="px-3 py-2">{v.make} {v.model}</td>
                                     <td className="px-3 py-2 capitalize">{v.status.replace(/_/g, ' ')}</td>
                                     <td className="px-3 py-2 text-right">{v.current_km.toLocaleString()}</td>
                                     <td className="px-3 py-2 text-right">{v.totalExpenses.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                 </tr>
                             ))}
                         </tbody>
                     </table>
                 </div>
            </SubtleCard>
        </div>
    );
};

const FinancialsReport: React.FC<{ financialsData: ReportsPageProps['data']['financials'] }> = ({ financialsData }) => {
    const summary = useMemo(() => {
        const totalRevenue = financialsData.invoices
            .filter(inv => inv.status === InvoiceStatus.PAID || inv.status === InvoiceStatus.PARTIAL)
            .reduce((sum, inv) => sum + inv.amount_paid, 0);
        const totalExpenses = financialsData.expenses.reduce((sum, exp) => sum + exp.amount_in_base_currency, 0);
        const netProfit = totalRevenue - totalExpenses;
        return { totalRevenue, totalExpenses, netProfit };
    }, [financialsData]);

    const monthlyPerformance = useMemo(() => {
        const data: { [key: string]: { Revenue: number, Expenses: number }} = {};
        const processDate = (dateStr: string) => new Date(dateStr).toLocaleString('default', { month: 'short', year: 'numeric' });
        
        financialsData.invoices.forEach(inv => {
            if(inv.paid_at) {
                const month = processDate(inv.paid_at);
                if (!data[month]) data[month] = { Revenue: 0, Expenses: 0 };
                data[month].Revenue += inv.amount_paid;
            }
        });
        financialsData.expenses.forEach(exp => {
            const month = processDate(exp.expense_date);
            if (!data[month]) data[month] = { Revenue: 0, Expenses: 0 };
            data[month].Expenses += exp.amount_in_base_currency;
        });

        return Object.entries(data).map(([name, values]) => ({ name, ...values })).slice(-6);
    }, [financialsData]);
    
    const expenseCategories = useMemo(() => {
        const categories = financialsData.expenses.reduce((acc, exp) => {
            const category = exp.expense_category.charAt(0).toUpperCase() + exp.expense_category.slice(1);
            acc[category] = (acc[category] || 0) + exp.amount_in_base_currency;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(categories).map(([name, value]) => ({name, value}));
    }, [financialsData]);
    
    const COLORS = ['#EF4444', '#F59E0B', '#84CC16', '#3B82F6', '#8B5CF6', '#EC4899'];

    return (
        <div className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Total Revenue" value={summary.totalRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} />
                <StatCard label="Total Expenses" value={summary.totalExpenses.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} />
                <StatCard label="Net Profit" value={summary.netProfit.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SubtleCard className="p-4">
                    <h3 className="text-sm font-semibold mb-4">Monthly Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyPerformance}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                            <XAxis dataKey="name" tick={{fontSize: 10}}/>
                            <YAxis tickFormatter={(value) => `$${(value as number / 1000)}k`} tick={{fontSize: 10}}/>
                            <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                            <Legend wrapperStyle={{fontSize: "12px"}}/>
                            <Bar dataKey="Revenue" fill="#10B981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Expenses" fill="#EF4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </SubtleCard>
                <SubtleCard className="p-4">
                     <h3 className="text-sm font-semibold mb-4">Top Expense Categories</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                             <Pie data={expenseCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5}>
                                {expenseCategories.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip formatter={(value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)} />
                             <Legend wrapperStyle={{fontSize: "12px"}}/>
                        </PieChart>
                    </ResponsiveContainer>
                </SubtleCard>
            </div>
        </div>
    );
};

const SalesReport: React.FC<{ crmData: ReportsPageProps['data']['crm'] }> = ({ crmData }) => {
    const salesMetrics = useMemo(() => {
        const won = crmData.opportunities.filter(o => o.stage === OpportunityStage.CLOSED_WON);
        const lost = crmData.opportunities.filter(o => o.stage === OpportunityStage.CLOSED_LOST);
        const totalClosed = won.length + lost.length;
        const conversionRate = totalClosed > 0 ? (won.length / totalClosed) * 100 : 0;
        const totalValueWon = won.reduce((sum, o) => sum + o.expected_value, 0);
        const avgDealSize = won.length > 0 ? totalValueWon / won.length : 0;
        return { conversionRate, totalValueWon, avgDealSize, dealsWon: won.length };
    }, [crmData]);

    const funnelData = useMemo(() => {
        const stageOrder = [OpportunityStage.PROSPECTING, OpportunityStage.QUALIFICATION, OpportunityStage.PROPOSAL, OpportunityStage.NEGOTIATION, OpportunityStage.CLOSED_WON];
        const counts = crmData.opportunities.reduce((acc, o) => {
            acc[o.stage] = (acc[o.stage] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        return stageOrder.map(stage => ({
            value: counts[stage] || 0,
            name: stage.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
            fill: '#' + Math.floor(Math.random()*16777215).toString(16), // random color
        }));
    }, [crmData]);
    
    const repPerformance = useMemo(() => {
        const performance: { [key: number]: { dealsWon: number, totalRevenue: number } } = {};
        crmData.opportunities.forEach(opp => {
            if(opp.stage === OpportunityStage.CLOSED_WON) {
                if(!performance[opp.assigned_to]) performance[opp.assigned_to] = { dealsWon: 0, totalRevenue: 0 };
                performance[opp.assigned_to].dealsWon += 1;
                performance[opp.assigned_to].totalRevenue += opp.expected_value;
            }
        });
        return Object.entries(performance).map(([repId, data]) => {
            const rep = crmData.salesReps.find(r => r.id === parseInt(repId));
            return {
                name: rep ? `${rep.first_name} ${rep.last_name}` : `User ${repId}`,
                ...data
            }
        }).sort((a,b) => b.totalRevenue - a.totalRevenue);
    }, [crmData]);


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Conversion Rate" value={`${salesMetrics.conversionRate.toFixed(1)}%`} sublabel="Of all closed deals" />
                <StatCard label="Total Revenue Won" value={salesMetrics.totalValueWon.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} />
                <StatCard label="Average Deal Size" value={salesMetrics.avgDealSize.toLocaleString('en-US', {style: 'currency', currency: 'USD'})} />
                <StatCard label="Deals Won" value={salesMetrics.dealsWon} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <SubtleCard className="p-4">
                    <h3 className="text-sm font-semibold mb-4">Sales Funnel</h3>
                    <ResponsiveContainer width="100%" height={350}>
                        <FunnelChart>
                            <Tooltip />
                            <Funnel dataKey="value" data={funnelData} isAnimationActive>
                                <LabelList position="right" fill="#000" stroke="none" dataKey="name" />
                            </Funnel>
                        </FunnelChart>
                    </ResponsiveContainer>
                </SubtleCard>
                 <SubtleCard className="p-4">
                     <h3 className="text-sm font-semibold mb-4">Sales Rep Performance</h3>
                     <div className="overflow-x-auto">
                         <table className="min-w-full text-sm">
                             <thead className="text-xs uppercase text-slate-500">
                                 <tr>
                                     <th className="px-3 py-2">Sales Rep</th>
                                     <th className="px-3 py-2 text-right">Deals Won</th>
                                     <th className="px-3 py-2 text-right">Total Revenue</th>
                                 </tr>
                             </thead>
                             <tbody className="divide-y divide-slate-100">
                                 {repPerformance.map(rep => (
                                     <tr key={rep.name}>
                                         <td className="px-3 py-2 font-medium">{rep.name}</td>
                                         <td className="px-3 py-2 text-right">{rep.dealsWon}</td>
                                         <td className="px-3 py-2 text-right font-semibold text-emerald-600">{rep.totalRevenue.toLocaleString('en-US', {style: 'currency', currency: 'USD'})}</td>
                                     </tr>
                                 ))}
                             </tbody>
                         </table>
                     </div>
                </SubtleCard>
            </div>
        </div>
    );
};

const ReportsPage: React.FC<ReportsPageProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('fleet');

  const renderContent = () => {
    switch (activeTab) {
      case 'fleet': return <FleetReport fleetData={data.fleet} />;
      case 'financials': return <FinancialsReport financialsData={data.financials} />;
      case 'sales': return <SalesReport crmData={data.crm} />;
      default: return null;
    }
  };

  const tabs = [
    { id: 'fleet', label: 'Fleet Efficiency' },
    { id: 'financials', label: 'Financial Performance' },
    { id: 'sales', label: 'Sales Pipeline Analysis' },
  ];

  return (
    <ShellCard className="p-0 flex flex-col">
      <div className="px-4 pt-4 border-b border-slate-100">
        <SectionHeader
          title="Reports & Analytics"
          subtitle="Export and review performance over time"
          actions={
            <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition">
              Export
            </button>
          }
        />
        <div className="mt-4">
          <div className="flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-orange-500 text-orange-600 bg-orange-50'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 bg-slate-50/50 flex-1">
        {renderContent()}
      </div>
    </ShellCard>
  );
};

export default ReportsPage;
