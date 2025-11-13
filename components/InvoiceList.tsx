
import React from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { PlusIcon } from './icons/Icons';

interface InvoiceListProps {
  invoices: Invoice[];
}

const getStatusColor = (status: InvoiceStatus) => {
  switch (status) {
    case InvoiceStatus.PAID: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case InvoiceStatus.OVERDUE: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case InvoiceStatus.PARTIAL: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case InvoiceStatus.SENT: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case InvoiceStatus.DRAFT: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  }
};

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-bold">Recent Invoices</h2>
        <button className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition">
          <PlusIcon className="w-5 h-5"/>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Invoice #</th>
              <th scope="col" className="px-6 py-3">Customer ID</th>
              <th scope="col" className="px-6 py-3">Due Date</th>
              <th scope="col" className="px-6 py-3">Total</th>
              <th scope="col" className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {invoice.invoice_number}
                </td>
                <td className="px-6 py-4">{invoice.customer_id}</td>
                <td className="px-6 py-4">{new Date(invoice.due_date).toLocaleDateString()}</td>
                <td className="px-6 py-4">${invoice.total_amount.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InvoiceList;
