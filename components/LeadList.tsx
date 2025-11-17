
import React from 'react';
import { Lead } from '../types';
import { PlusIcon, UploadIcon } from './icons/Icons';
import { ShellCard, SectionHeader, StatusPill } from './UiKit';

interface LeadListProps {
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
  onAddLeadClick: () => void;
  onImportClick: () => void;
}

const LeadList: React.FC<LeadListProps> = ({ leads, onSelectLead, onAddLeadClick, onImportClick }) => {
  const sortedLeads = [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <ShellCard className="flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <SectionHeader
          title="Leads"
          subtitle="Pipeline of people and companies you are speaking to"
          actions={
            <>
              <button
                onClick={onImportClick}
                className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 transition"
              >
                <UploadIcon className="w-4 h-4" />
                <span>Import</span>
              </button>
              <button
                className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                onClick={onAddLeadClick}
                aria-label="Add new lead"
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            </>
          }
        />
      </div>
      
      <div className="flex-1 overflow-y-auto p-2">
        {sortedLeads.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {sortedLeads.map((lead) => {
              const name = `${lead.first_name || ""} ${lead.last_name || ""}`.trim() || lead.company_name;
              const status = lead.lead_status?.replace("_", " ") || "";

              return (
                <button
                  key={lead.id}
                  type="button"
                  onClick={() => onSelectLead?.(lead)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-slate-50 rounded-xl transition"
                >
                  <div className="flex-1 truncate">
                    <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
                    <p className="text-xs text-slate-500 truncate">{lead.company_name}</p>
                  </div>
                  {status && (
                    <StatusPill label={status} tone="info" />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="px-4 py-16 text-center text-sm text-slate-500">
            No leads found.
          </div>
        )}
      </div>
    </ShellCard>
  );
};

export default LeadList;