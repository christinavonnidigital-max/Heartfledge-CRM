import React, { useState } from 'react';
import { mockInvoices, mockAllExpenses } from '../data/mockFinancialsData';
import InvoiceList from './InvoiceList';
import ExpenseList from './ExpenseList';
import { Invoice, Expense, InvoiceStatus } from '../types';
import { CurrencyDollarIcon } from './icons/Icons';
import AddInvoiceModal from './AddInvoiceModal';
import AddGlobalExpenseModal from './AddGlobalExpenseModal';

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

    const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode }> = ({ title, value, icon }) => (
        <div className="bg-white p-6 rounded-xl shadow-md flex items-center">
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full mr-4">
                {icon}
            </div>
            <div>
                <h3 className="text-gray-500 text-lg">{title}</h3>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );

    return (
        <>
            <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* FIX: Resolved a TypeScript error ("Expected 0 arguments, but got 2") by using `Intl.NumberFormat` for currency formatting, which avoids ambiguity with some TypeScript compiler/linter configurations that incorrectly infer the method signature of `toLocaleString`. */}
                    <StatCard 
                        title="Total Revenue (Paid)" 
                        value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(totalRevenue)}
                        icon={<CurrencyDollarIcon className="w-6 h-6" />}
                    />
                    <StatCard 
                        title="Total Expenses" 
                        value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(totalExpenses)}
                        icon={<CurrencyDollarIcon className="w-6 h-6 text-red-500" />}
                    />
                    <StatCard 
                        title="Net Profit" 
                        value={new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(netProfit)}
                        icon={<CurrencyDollarIcon className={`w-6 h-6 ${netProfit > 0 ? 'text-green-500' : 'text-red-500'}`} />}
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
