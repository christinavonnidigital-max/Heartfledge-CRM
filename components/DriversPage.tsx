
import React, { useState, useMemo, useEffect } from 'react';
import { Driver, User, DriverAssignment, EmploymentStatus } from '../types';
import { PlusIcon, SearchIcon, IllustrationTruckIcon, CheckCircleIcon, ExclamationTriangleIcon, TrashIcon, UserCircleIcon } from './icons/Icons';
import EmptyState from './EmptyState';
import AddDriverModal from './AddDriverModal';
import DriverDetails from './DriverDetails';

interface DriversPageProps {
  data: {
    drivers: Driver[];
    users: User[];
    assignments: DriverAssignment[];
  };
}

const DriversPage: React.FC<DriversPageProps> = ({ data }) => {
  const [drivers, setDrivers] = useState<Driver[]>(data.drivers);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(drivers.length > 0 ? drivers[0] : null);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmploymentStatus | 'all'>('all');

  const driversWithUsers = useMemo(() => {
    return drivers.map(driver => {
      const user = data.users.find(u => u.id === driver.user_id);
      return { ...driver, user };
    });
  }, [drivers, data.users]);

  const filteredDrivers = useMemo(() => {
    return driversWithUsers
      .filter(driver => statusFilter === 'all' || driver.employment_status === statusFilter)
      .filter(driver => {
        if (!searchTerm) return true;
        const lowercasedFilter = searchTerm.toLowerCase();
        const fullName = `${driver.user?.first_name || ''} ${driver.user?.last_name || ''}`.toLowerCase();
        return fullName.includes(lowercasedFilter) || driver.license_number.toLowerCase().includes(lowercasedFilter);
      });
  }, [driversWithUsers, searchTerm, statusFilter]);

  useEffect(() => {
    if (!selectedDriver && filteredDrivers.length > 0) {
      setSelectedDriver(filteredDrivers[0]);
    } else if (selectedDriver && !filteredDrivers.find(d => d.id === selectedDriver.id)) {
      setSelectedDriver(filteredDrivers.length > 0 ? filteredDrivers[0] : null);
    }
  }, [filteredDrivers, selectedDriver]);

  const handleAddDriver = (newDriverData: Omit<Driver, 'id' | 'created_at' | 'updated_at' | 'user_id'> & { user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'role' | 'email_verified'>}) => {
    const newUser: User = {
        ...newDriverData.user,
        id: Date.now() + 1,
        role: 'driver',
        email_verified: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };
    // In a real app, you'd add the user to the users table first. Here we just mock it.
    
    const newDriver: Driver = {
      ...newDriverData,
      id: Date.now(),
      user_id: newUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDrivers(prev => [newDriver, ...prev]);
    // In a real app, you'd also update the main user list.
    setIsAddDriverModalOpen(false);
    setSelectedDriver({ ...newDriver, user: newUser });
  };

  const getStatusPill = (status: EmploymentStatus) => {
    switch (status) {
      case EmploymentStatus.ACTIVE:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center gap-1"><CheckCircleIcon className="w-4 h-4"/> Active</span>;
      case EmploymentStatus.ON_LEAVE:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center gap-1"><UserCircleIcon className="w-4 h-4"/> On Leave</span>;
      case EmploymentStatus.SUSPENDED:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 flex items-center gap-1"><ExclamationTriangleIcon className="w-4 h-4"/> Suspended</span>;
      case EmploymentStatus.TERMINATED:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center gap-1"><TrashIcon className="w-4 h-4"/> Terminated</span>;
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 capitalize">{(status as string).replace('_', ' ')}</span>;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl shadow-md flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Drivers ({filteredDrivers.length})</h2>
              <button 
                  className="p-2 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition"
                  onClick={() => setIsAddDriverModalOpen(true)}
              >
                <PlusIcon className="w-5 h-5"/>
              </button>
            </div>
            <div className="flex gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Filter by name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>
               <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as EmploymentStatus | 'all')}
                  className="rounded-md border border-gray-300 bg-white text-gray-900 pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">All Statuses</option>
                  {Object.values(EmploymentStatus).map(status => (
                    <option key={status} value={status} className="capitalize">{status.replace(/_/g, ' ')}</option>
                  ))}
                </select>
            </div>
          </div>
          <div className="overflow-y-auto">
            {filteredDrivers.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {filteredDrivers.map((driver) => (
                  <li
                    key={driver.id}
                    onClick={() => setSelectedDriver(driver)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition ${
                      selectedDriver?.id === driver.id 
                        ? 'bg-orange-50 border-l-4 border-orange-500' 
                        : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{driver.user?.first_name} {driver.user?.last_name}</p>
                        <p className="text-sm text-gray-500">{driver.license_number}</p>
                      </div>
                      {getStatusPill(driver.employment_status)}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center text-gray-500">
                  <p>No drivers found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          {selectedDriver ? (
            <DriverDetails 
                driver={selectedDriver}
                assignments={data.assignments.filter(a => a.driver_id === selectedDriver.id)}
            />
          ) : (
             <EmptyState 
               icon={<IllustrationTruckIcon />}
               title={drivers.length > 0 ? "Select a Driver" : "No Drivers in System"}
               message={drivers.length > 0 ? "Choose a driver from the list to view their details, compliance status, and history." : "Get started by adding your first driver to the system."}
             />
          )}
        </div>
      </div>
      {isAddDriverModalOpen && (
        <AddDriverModal
            onClose={() => setIsAddDriverModalOpen(false)}
            onAddDriver={handleAddDriver}
        />
      )}
    </>
  );
};

export default DriversPage;
