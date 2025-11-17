
import React, { useState } from 'react';
import { mockInvoices, mockAllExpenses } from '../data/mockFinancialsData';
import InvoiceList from './InvoiceList';
import ExpenseList from './ExpenseList';
import { Invoice, Expense, InvoiceStatus } from '../types';
import { CurrencyDollarIcon } from './icons/Icons';
import AddInvoiceModal from './AddInvoiceModal';
import AddGlobalExpenseModal from './AddGlobalExpenseModal';

const StatCard: React.FC<{ label: string; value: number; icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex flex-col justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                {icon}
            </div>
        </div>
        <div className="mt-3">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)}
            </p>
        </div>
    </div>
);

const FinancialsDashboard: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
    const [expenses, setExpenses] = useState<Expense[]>(mockAllExpenses);
    const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

    const totalRevenue = invoices
        .filter(inv => inv.status === InvoiceStatus.PAID || inv.status === InvoiceStatus.PARTIAL)
        .reduce((sum, inv) => sum + inv.amount_paid, 0);

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount_in_base_currency, 0);
    
    const netProfit = totalRevenue - totalExpenses;

    const handleAddInvoice = (newInvoiceData: Omit<Invoice, 'id' | 'created_at' | 'updated_at' | 'created_by' | 'balance_due' | 'amount_paid'>) => {
        const newInvoice: Invoice = {
            ...newInvoiceData,
            id: Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            created_by: 1, // Logged in user
            balance_due: newInvoiceData.total_amount,
            amount_paid: 0,
        };
        setInvoices(prev => [newInvoice, ...prev]);
        setIsInvoiceModalOpen(false);
    };

    const handleAddExpense = (newExpenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at' | 'recorded_by' | 'amount_in_base_currency'>) => {
        const newExpense: Expense = {
            ...newExpenseData,
            id: Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            recorded_by: 1, // Logged in user
            amount_in_base_currency: newExpenseData.amount, // Assuming USD for now
        };
        setExpenses(prev => [newExpense, ...prev]);
        setIsExpenseModalOpen(false);
    };

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard 
                        label="Total Revenue (Paid)" 
                        value={totalRevenue}
                        icon={<CurrencyDollarIcon className="w-5 h-5" />}
                    />
                    <StatCard 
                        label="Total Expenses" 
                        value={totalExpenses}
                        icon={<CurrencyDollarIcon className="w-5 h-5" />}
                    />
                    <StatCard 
                        label="Net Profit" 
                        value={netProfit}
                        icon={<CurrencyDollarIcon className={`w-5 h-5 ${netProfit > 0 ? 'text-green-500' : 'text-red-500'}`} />}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <InvoiceList invoices={invoices} onAddInvoiceClick={() => setIsInvoiceModalOpen(true)} />
                     <ExpenseList expenses={expenses} onAddExpenseClick={() => setIsExpenseModalOpen(true)} />
                </div>
            </div>
            {isInvoiceModalOpen && (
                <AddInvoiceModal
                    onClose={() => setIsInvoiceModalOpen(false)}
                    onAddInvoice={handleAddInvoice}
                />
            )}
            {isExpenseModalOpen && (
                <AddGlobalExpenseModal
                    onClose={() => setIsExpenseModalOpen(false)}
                    onAddExpense={handleAddExpense}
                />
            )}
        </>
    );
};

export default FinancialsDashboard;