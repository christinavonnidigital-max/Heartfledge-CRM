
import React from 'react';
// FIX: Corrected import for EmptyState from './EmptyState' instead of './UiKit'.
import { ShellCard, SectionHeader } from './UiKit';
import EmptyState from './EmptyState';
import { CampaignIcon } from './icons/Icons';

const MarketingDashboard: React.FC = () => {
  return (
    <ShellCard>
      <div className="p-4 border-b border-slate-100">
        <SectionHeader
          title="Marketing Dashboard"
          subtitle="Campaign overview and status"
        />
      </div>
      <div className="h-96">
        <EmptyState
          icon={<CampaignIcon className="h-14 w-14" />}
          title="Marketing Analytics Coming Soon"
          message="This dashboard will provide a high-level overview of your marketing efforts, including campaign performance, lead attribution, and conversion funnels."
        />
      </div>
    </ShellCard>
  );
};

export default MarketingDashboard;
