
import React from 'react';
import { Invoice, InvoiceStatus } from '../types';
import { PlusIcon } from './icons/Icons';
import { ShellCard, SectionHeader, StatusPill } from './UiKit';

interface InvoiceListProps {
  invoices: Invoice[];
  onAddInvoiceClick: () => void;
}

const InvoiceList: React.FC<InvoiceListProps> = ({ invoices, onAddInvoiceClick }) => {

  const getStatusTone = (status: InvoiceStatus): "success" | "warn" | "danger" | "info" | "neutral" => {
    switch (status) {
      case InvoiceStatus.PAID: return 'success';
      case InvoiceStatus.OVERDUE: return 'warn';
      case InvoiceStatus.PARTIAL: return 'warn';
      case InvoiceStatus.SENT: return 'info';
      case InvoiceStatus.DRAFT: return 'neutral';
      case InvoiceStatus.CANCELLED: return 'danger';
      case InvoiceStatus.REFUNDED: return 'neutral';
      default: return 'neutral';
    }
  };

  return (
    <ShellCard className="flex flex-col">
      <div className="flex items-start justify-between p-4 border-b border-slate-100">
        <SectionHeader
          title="Invoices"
          subtitle="Money owed and money collected"
        />
        <button 
          className="p-2 -mt-2 -mr-1 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition flex-shrink-0"
          onClick={onAddInvoiceClick}
          aria-label="Add new invoice"
        >
          <PlusIcon className="w-5 h-5"/>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Invoice #</th>
              <th className="px-4 py-2 font-medium">Customer</th>
              <th className="px-4 py-2 font-medium">Due</th>
              <th className="px-4 py-2 font-medium text-right">Total</th>
              <th className="px-4 py-2 font-medium text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                  {invoice.invoice_number}
                </td>
                <td className="px-4 py-3 text-slate-600">{invoice.customer_id}</td>
                <td className="px-4 py-3 text-slate-600">{new Date(invoice.due_date + 'T00:00:00').toLocaleDateString()}</td>
                <td className="px-4 py-3 text-slate-800 font-medium text-right">{new Intl.NumberFormat(undefined, { style: 'currency', currency: invoice.currency }).format(invoice.total_amount)}</td>
                <td className="px-4 py-3 text-center">
                  <StatusPill
                    label={invoice.status.replace(/_/g, ' ')}
                    tone={getStatusTone(invoice.status)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ShellCard>
  );
};

export default InvoiceList;