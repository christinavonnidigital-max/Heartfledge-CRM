
import React from 'react';
import { Driver, DriverAssignment, AssignmentStatus } from '../types';
import { UserCircleIcon, PhoneIcon, BriefcaseIcon, CalendarDaysIcon, ClipboardDocumentIcon, StarIcon, MapPinIcon } from './icons/Icons';

interface DriverDetailsProps {
  driver: Driver & { user?: any };
  assignments: DriverAssignment[];
}

const DetailSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
    <div>
        <h3 className="text-lg font-semibold mb-3 flex items-center text-gray-800">
            {icon}
            <span className="ml-2">{title}</span>
        </h3>
        <div className="space-y-2 text-sm bg-gray-50 p-4 rounded-lg border">{children}</div>
    </div>
);

// FIX: Updated the 'value' prop to accept React.ReactNode for more flexible content,
// removed the confusing 'children' prop, and updated call sites.
const DetailItem: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
    <div className="grid grid-cols-3 gap-2 py-1">
        <span className="text-gray-500 font-medium col-span-1">{label}</span>
        <span className="text-gray-900 col-span-2 break-words">{value || 'N/A'}</span>
    </div>
);

const getAssignmentStatusPill = (status: AssignmentStatus) => {
    switch(status) {
        case AssignmentStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case AssignmentStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-800';
        case AssignmentStatus.ASSIGNED: return 'bg-yellow-100 text-yellow-800';
        case AssignmentStatus.CANCELLED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
}

const DriverDetails: React.FC<DriverDetailsProps> = ({ driver, assignments }) => {
  const { user } = driver;

  const isLicenseExpired = new Date(driver.license_expiry_date) < new Date();
  const isMedicalExpired = driver.medical_certificate_expiry ? new Date(driver.medical_certificate_expiry) < new Date() : false;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 overflow-y-auto">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-2xl font-bold leading-6 text-gray-900">{user?.first_name} {user?.last_name}</h3>
        <p className="mt-1 text-md text-gray-500">Driver Profile & Compliance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <DetailSection title="Personal & Contact" icon={<UserCircleIcon className="w-5 h-5" />}>
                <DetailItem label="Date of Birth" value={new Date(driver.date_of_birth + 'T00:00:00').toLocaleDateString()} />
                <DetailItem label="National ID" value={driver.national_id} />
                <DetailItem label="Email" value={user?.email} />
                <DetailItem label="Phone" value={user?.phone} />
                <DetailItem label="Address" value={`${driver.address}, ${driver.city}`} />
            </DetailSection>

            <DetailSection title="License & Compliance" icon={<ClipboardDocumentIcon className="w-5 h-5" />}>
                <DetailItem label="License #" value={driver.license_number} />
                <DetailItem label="License Type" value={driver.license_type} />
                <DetailItem label="License Expiry" value={
                    <span className={isLicenseExpired ? 'font-bold text-red-600' : ''}>
                        {new Date(driver.license_expiry_date + 'T00:00:00').toLocaleDateString()}
                    </span>
                } />
                <DetailItem label="Medical Cert. Expiry" value={
                     driver.medical_certificate_expiry ? (
                        <span className={isMedicalExpired ? 'font-bold text-red-600' : ''}>
                            {new Date(driver.medical_certificate_expiry + 'T00:00:00').toLocaleDateString()}
                        </span>
                     ) : 'N/A'
                } />
            </DetailSection>
        </div>

        <div className="space-y-6">
             <DetailSection title="Employment" icon={<BriefcaseIcon className="w-5 h-5" />}>
                <DetailItem label="Hire Date" value={new Date(driver.hire_date + 'T00:00:00').toLocaleDateString()} />
                <DetailItem label="Status" value={<span className="capitalize font-semibold">{driver.employment_status.replace('_', ' ')}</span>} />
                <DetailItem label="Salary" value={driver.salary ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(driver.salary) : 'N/A'} />
            </DetailSection>

            <DetailSection title="Performance" icon={<StarIcon className="w-5 h-5" />}>
                <DetailItem label="Rating" value={`${driver.rating || 'N/A'} / 5`} />
                <DetailItem label="Total Deliveries" value={driver.total_deliveries || 0} />
            </DetailSection>

            <DetailSection title="Recent Assignments" icon={<MapPinIcon className="w-5 h-5" />}>
                <div className="space-y-2">
                {assignments.length > 0 ? assignments.slice(0,3).map(item => (
                    <div key={item.id} className="text-sm p-2 bg-white rounded-md">
                        <div className="flex justify-between items-center">
                            <p className="font-semibold">Booking #{item.booking_id}</p>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${getAssignmentStatusPill(item.status)}`}>
                                {item.status}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">Assigned: {new Date(item.assigned_at).toLocaleDateString()}</p>
                    </div>
                )) : <p className="text-gray-500">No recent assignments.</p>}
                </div>
            </DetailSection>
        </div>
      </div>
    </div>
  );
};

export default DriverDetails;
