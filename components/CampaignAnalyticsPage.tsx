
import React from 'react';
// FIX: Corrected import for EmptyState from './EmptyState' instead of './UiKit'.
import { ShellCard, SectionHeader } from './UiKit';
import EmptyState from './EmptyState';
import { ChartPieIcon } from './icons/Icons';

const CampaignAnalyticsPage: React.FC = () => {
  return (
    <ShellCard>
      <div className="p-4 border-b border-slate-100">
        <SectionHeader
          title="Campaign Performance"
          subtitle="See what channels are working"
        />
      </div>
      <div className="h-96">
        <EmptyState
          icon={<ChartPieIcon className="h-14 w-14" />}
          title="Analytics in Development"
          message="This section will contain detailed analytics for your campaigns, including open rates, click-through rates, reply rates, and performance over time."
        />
      </div>
    </ShellCard>
  );
};

export default CampaignAnalyticsPage;
