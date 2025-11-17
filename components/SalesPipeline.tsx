import React from 'react';
import { Opportunity, OpportunityStage } from '../types';

interface SalesPipelineProps {
  opportunities: Opportunity[];
  onOpportunityClick: (opportunity: Opportunity) => void;
}

const stageColors: { [key in OpportunityStage]: string } = {
  [OpportunityStage.PROSPECTING]: 'border-t-gray-400',
  [OpportunityStage.QUALIFICATION]: 'border-t-blue-500',
  [OpportunityStage.PROPOSAL]: 'border-t-purple-500',
  [OpportunityStage.NEGOTIATION]: 'border-t-yellow-500',
  [OpportunityStage.CLOSED_WON]: 'border-t-green-500',
  [OpportunityStage.CLOSED_LOST]: 'border-t-red-500',
};

const OpportunityCard: React.FC<{ opp: Opportunity; onClick: (opp: Opportunity) => void }> = ({ opp, onClick }) => (
    <div 
        className="bg-white p-3 rounded-lg shadow mb-3 cursor-pointer hover:shadow-md hover:ring-2 hover:ring-orange-400 transition"
        onClick={() => onClick(opp)}
    >
        <p className="font-bold text-sm text-gray-900">{opp.opportunity_name}</p>
        <p className="text-xs text-gray-500">{opp.lead_id ? `Lead ID: ${opp.lead_id}` : `Customer ID: ${opp.customer_id}`}</p>
        <div className="flex justify-between items-center mt-2">
            {/* FIX: Resolved a TypeScript error ("Expected 0 arguments, but got 2") by using `Intl.NumberFormat` for currency formatting, which avoids ambiguity with some TypeScript compiler/linter configurations that incorrectly infer the method signature of `toLocaleString`. */}
            <span className="text-sm font-semibold text-green-600">{new Intl.NumberFormat(undefined, { style: 'currency', currency: opp.currency }).format(opp.expected_value)}</span>
            <span className="text-xs text-gray-400">{opp.probability}%</span>
        </div>
    </div>
);

const PipelineColumn: React.FC<{ title: string; opportunities: Opportunity[]; stage: OpportunityStage; onOpportunityClick: (opportunity: Opportunity) => void; }> = ({ title, opportunities, stage, onOpportunityClick }) => (
    <div className="flex-1 min-w-[280px]">
        <h3 className={`text-lg font-semibold mb-3 pb-2 border-b-2 border-gray-200 ${stageColors[stage]} border-t-4 pt-2`}>{title} ({opportunities.length})</h3>
        <div className="bg-gray-100 p-2 rounded-lg h-[400px] overflow-y-auto">
            {opportunities.map(opp => <OpportunityCard key={opp.id} opp={opp} onClick={onOpportunityClick} />)}
        </div>
    </div>
);

const SalesPipeline: React.FC<SalesPipelineProps> = ({ opportunities, onOpportunityClick }) => {
  const stages = Object.values(OpportunityStage);

  const opportunitiesByStage = (stage: OpportunityStage) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Sales Pipeline</h2>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {stages.map(stage => (
            <PipelineColumn
                key={stage}
                title={stage.charAt(0).toUpperCase() + stage.slice(1).replace('_', ' ')}
                opportunities={opportunitiesByStage(stage)}
                stage={stage}
                onOpportunityClick={onOpportunityClick}
            />
        ))}
      </div>
    </div>
  );
};

export default SalesPipeline;