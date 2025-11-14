
import React, { useState } from 'react';
import { Campaign, CampaignStatus, CampaignType, EmailSequence } from '../types';
import CampaignDetailsStep from './campaignBuilder/CampaignDetailsStep';
import SequenceBuilderStep from './campaignBuilder/SequenceBuilderStep';
import { View } from '../App';

interface NewCampaignPageProps {
    setActiveView: (view: View) => void;
}

const NewCampaignPage: React.FC<NewCampaignPageProps> = ({ setActiveView }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [campaignData, setCampaignData] = useState<Partial<Campaign> & { sequences?: EmailSequence[] }>({
        campaign_name: '',
        campaign_goal: '',
        target_audience: '',
        status: CampaignStatus.DRAFT,
        campaign_type: CampaignType.COLD_OUTREACH,
        track_opens: true,
        track_clicks: true,
        auto_pause_on_reply: true,
        sequences: [],
    });

    const updateCampaignData = (updates: Partial<Campaign>) => {
        setCampaignData(prev => ({ ...prev, ...updates }));
    };
    
    const updateSequences = (sequences: EmailSequence[]) => {
        setCampaignData(prev => ({ ...prev, sequences }));
    }

    const handleNext = () => {
        // Validation for the current step can go here
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        } else {
            setActiveView('campaigns');
        }
    };
    
    const renderStep = () => {
        switch(currentStep) {
            case 1:
                return <CampaignDetailsStep data={campaignData} updateData={updateCampaignData} />;
            case 2:
                return <SequenceBuilderStep sequences={campaignData.sequences || []} updateSequences={updateSequences} />;
            // case 3: return <SelectLeadsStep />;
            // case 4: return <ReviewStep />;
            default:
                return <div>Step {currentStep} not implemented yet.</div>;
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
                {/* Stepper UI can go here */}
                <h2 className="text-xl font-bold">Step {currentStep}: {['Campaign Details', 'Build Sequence', 'Select Leads', 'Review & Launch'][currentStep - 1]}</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
                {renderStep()}
            </div>
            <footer className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <button
                    type="button"
                    onClick={handleBack}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                >
                    {currentStep === 1 ? 'Back to Campaigns' : 'Back'}
                </button>
                <div className="space-x-3">
                    <button
                        type="button"
                        onClick={() => alert('Campaign saved as draft!')}
                        className="bg-gray-100 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        Save as Draft
                    </button>
                    <button
                        type="button"
                        onClick={handleNext}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                    >
                        {currentStep === 4 ? 'Launch Campaign' : 'Next Step'}
                    </button>
                </div>
            </footer>
        </div>
    );
};

export default NewCampaignPage;