import React from 'react';
import EmptyState from './EmptyState';
import { UsersIcon } from './icons/Icons';
import { ShellCard, SectionHeader } from './UiKit';

const CustomersPage: React.FC = () => {
  return (
    <ShellCard>
        <div className="p-4 border-b border-slate-100">
            <SectionHeader
                title="Customer management"
                subtitle="Keep accounts, key contacts and contract details aligned with your fleet reality."
            />
        </div>
        <div className="h-96">
            <EmptyState
            icon={<UsersIcon className="h-14 w-14" />}
            title="No customers loaded yet"
            message="Once the CRM module is finished you will be able to sync customer lists, link contacts to bookings and see revenue per client here."
            />
        </div>
    </ShellCard>
  );
};

export default CustomersPage;