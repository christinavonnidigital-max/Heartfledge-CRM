
import React from 'react';
import { ShellCard, SectionHeader } from './UiKit';
import { BarChartIcon } from './icons/Icons';

const ReportsPage: React.FC = () => {
  return (
    <ShellCard className="p-6">
      <SectionHeader 
        title="Reports & Analytics"
        subtitle="Export and review performance over time"
      />
      <div className="mt-4 text-center text-slate-500 py-16 border-2 border-dashed border-slate-200 rounded-xl">
        <BarChartIcon className="w-12 h-12 mx-auto text-slate-300" />
        <h3 className="mt-4 text-lg font-semibold text-slate-800">Reporting in Development</h3>
        <p className="mt-2 text-sm max-w-sm mx-auto">
          This section will contain detailed reports on fleet efficiency, financial performance, and sales pipeline conversion rates.
        </p>
      </div>
    </ShellCard>
  );
};

export default ReportsPage;