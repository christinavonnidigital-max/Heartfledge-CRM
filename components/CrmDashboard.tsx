import React, { useState, useEffect } from 'react';
import { mockLeads, mockOpportunities, mockLeadScoringRules, mockSalesReps, mockLeadActivities } from '../data/mockCrmData';
import SalesPipeline from './SalesPipeline';
import LeadList from './LeadList';
import LeadScoringRules from './LeadScoringRules';
import LeadDetailsModal from './LeadDetailsModal';
import { Lead, LeadScoringRule } from '../types';
import AddLeadModal from './AddLeadModal';
import AddLeadScoringRuleModal from './AddLeadScoringRuleModal';
import { calculateLeadScore } from '../services/crmService';
import { BriefcaseIcon, CurrencyDollarIcon, UsersIcon } from './icons/Icons';

const StatCard = ({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) => (
  <div className="flex flex-col justify-between rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-slate-100">
    <div className="flex items-center justify-between">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
        {icon}
      </div>
    </div>
    <div className="mt-3">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);


const CrmDashboard: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>(mockLeads);
    const [rules, setRules] = useState<LeadScoringRule[]>(mockLeadScoringRules);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
    const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false);
    const [isAddRuleModalOpen, setIsAddRuleModalOpen] = useState(false);

    // Recalculate lead scores whenever the rules change.
    useEffect(() => {
        setLeads(prevLeads => 
            prevLeads.map(lead => ({
                ...lead,
                lead_score: calculateLeadScore(lead, rules)
            }))
        );
    }, [rules]);


    const totalPipelineValue = mockOpportunities.reduce((sum, opp) => {
        if (opp.stage !== 'closed_won' && opp.stage !== 'closed_lost') {
            return sum + opp.expected_value;
        }
        return sum;
    }, 0);

    const newLeadsCount = leads.filter(lead => lead.lead_status === 'new').length;

    const handleSelectLead = (lead: Lead) => {
        setSelectedLead(lead);
    };

    const handleCloseModal = () => {
        setSelectedLead(null);
    };

    const handleAddLead = (newLeadData: Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'lead_score'>) => {
        const newLead: Lead = {
            ...newLeadData,
            id: Date.now(),
            lead_score: calculateLeadScore(newLeadData, rules),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setLeads(prev => [newLead, ...prev]);
        setIsAddLeadModalOpen(false);
    };

    const handleAddRule = (newRuleData: Omit<LeadScoringRule, 'id' | 'created_at' | 'updated_at'>) => {
        const newRule: LeadScoringRule = {
            ...newRuleData,
            id: Date.now(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        };
        setRules(prev => [...prev, newRule]);
        setIsAddRuleModalOpen(false);
    };

  return (
    <>
        <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard 
                    label="Total Pipeline Value" 
                    value={`$${new Intl.NumberFormat().format(totalPipelineValue)}`}
                    icon={<CurrencyDollarIcon className="w-5 h-5" />}
                />
                <StatCard 
                    label="New Leads" 
                    value={newLeadsCount}
                    icon={<BriefcaseIcon className="w-5 h-5" />}
                />
                <StatCard 
                    label="Opportunities" 
                    value={mockOpportunities.length}
                    icon={<UsersIcon className="w-5 h-5" />}
                />
            </div>
            <SalesPipeline opportunities={mockOpportunities} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LeadList leads={leads} onSelectLead={handleSelectLead} onAddLeadClick={() => setIsAddLeadModalOpen(true)} />
                <LeadScoringRules rules={rules} onAddRuleClick={() => setIsAddRuleModalOpen(true)} />
            </div>
            {selectedLead && (
                <LeadDetailsModal 
                    lead={selectedLead} 
                    salesReps={mockSalesReps}
                    leadActivities={mockLeadActivities}
                    onClose={handleCloseModal} 
                />
            )}
        </div>
        {isAddLeadModalOpen && (
            <AddLeadModal
                onClose={() => setIsAddLeadModalOpen(false)}
                onAddLead={handleAddLead}
            />
        )}
        {isAddRuleModalOpen && (
            <AddLeadScoringRuleModal
                onClose={() => setIsAddRuleModalOpen(false)}
                onAddRule={handleAddRule}
            />
        )}
    </>
  );
};

export default CrmDashboard;