import React, { useState, useMemo, useEffect } from 'react';
import { mockVehicles, mockExpenses } from '../data/mockData';
import { Vehicle, VehicleStatus, VehicleExpense } from '../types';
import VehicleDetails from './VehicleDetails';
import { PlusIcon, SearchIcon, IllustrationTruckIcon } from './icons/Icons';
import EmptyState from './EmptyState';
import AddExpenseModal from './AddExpenseModal';
import AddVehicleModal from './AddVehicleModal';
import { ShellCard, SectionHeader, StatusPill } from "./UiKit";

const FleetDashboard: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(vehicles.length > 0 ? vehicles[0] : null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expenses, setExpenses] = useState<VehicleExpense[]>(() => 
    [...mockExpenses].sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime())
  );
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isAddVehicleModalOpen, setIsAddVehicleModalOpen] = useState(false);

  const filteredVehicles = useMemo(() => {
    if (!searchTerm) {
      return vehicles;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return vehicles.filter(vehicle =>
      vehicle.registration_number.toLowerCase().includes(lowercasedFilter) ||
      vehicle.make.toLowerCase().includes(lowercasedFilter)
    );
  }, [vehicles, searchTerm]);

  useEffect(() => {
    if (!selectedVehicle && filteredVehicles.length > 0) {
      setSelectedVehicle(filteredVehicles[0]);
    } else if (selectedVehicle && !filteredVehicles.find(v => v.id === selectedVehicle.id)) {
      setSelectedVehicle(filteredVehicles.length > 0 ? filteredVehicles[0] : null);
    }
  }, [searchTerm, selectedVehicle, filteredVehicles]);

  const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'created_at' | 'updated_at'>) => {
    const newVehicle: Vehicle = {
      ...newVehicleData,
      id: Date.now(), // Simple unique ID for mock data
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setVehicles(prev => [newVehicle, ...prev]);
    setIsAddVehicleModalOpen(false);
    setSelectedVehicle(newVehicle);
  };

  const handleAddExpense = (newExpense: Omit<VehicleExpense, 'id' | 'vehicle_id' | 'created_at' | 'recorded_by'>) => {
    if (!selectedVehicle) return;
    const newExpenseWithId: VehicleExpense = {
        ...newExpense,
        id: Date.now(),
        vehicle_id: selectedVehicle.id,
        recorded_by: 1, // Assuming user ID 1 is recording
        created_at: new Date().toISOString(),
    };
    setExpenses(prev => [...prev, newExpenseWithId].sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime()));
    setIsAddExpenseModalOpen(false);
  };

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
        {/* Left column - vehicle list */}
        <ShellCard className="flex flex-col p-4">
          <SectionHeader
            title={`Vehicle fleet (${filteredVehicles.length})`}
            subtitle="Tap a truck to see its details"
            actions={
              <button
                className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition flex-shrink-0"
                onClick={() => setIsAddVehicleModalOpen(true)}
              >
                <PlusIcon className="w-5 h-5" />
              </button>
            }
          />

          <div className="mt-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Filter by reg. number or make..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 pl-9 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="mt-3 -mx-2 px-2 flex-1 space-y-1 overflow-y-auto">
            {filteredVehicles.length > 0 ? (
              filteredVehicles.map((vehicle) => {
                 const isSelected = selectedVehicle?.id === vehicle.id;
                return (
                  <button
                    key={vehicle.id}
                    onClick={() => setSelectedVehicle(vehicle)}
                    className={`w-full text-left rounded-xl px-3 py-2.5 transition ${
                      isSelected ? "bg-orange-50 border border-orange-200" : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-gray-900">{vehicle.make} {vehicle.model}</p>
                        <p className="text-sm text-gray-500">{vehicle.registration_number}</p>
                      </div>
                       <StatusPill
                        label={vehicle.status.replace(/_/g, ' ')}
                        tone={
                          vehicle.status === VehicleStatus.ACTIVE ? 'success'
                          : vehicle.status === VehicleStatus.MAINTENANCE ? 'warn'
                          : vehicle.status === VehicleStatus.OUT_OF_SERVICE ? 'danger'
                          : 'neutral'
                        }
                      />
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="p-8 text-center text-gray-500">
                  <p>No vehicles found{searchTerm ? ` for "${searchTerm}"` : ''}.</p>
              </div>
            )}
          </div>
        </ShellCard>

        {/* Right column - details */}
        <div className="flex flex-col">
          {selectedVehicle ? (
            <VehicleDetails 
                vehicle={selectedVehicle}
                expenses={expenses}
                onAddExpenseClick={() => setIsAddExpenseModalOpen(true)}
            />
          ) : (
             <EmptyState 
               icon={<IllustrationTruckIcon />}
               title={vehicles.length > 0 ? "Select a Vehicle" : "No Vehicles in Fleet"}
               message={vehicles.length > 0 ? "Choose a vehicle from the list to view its details, maintenance history, and expenses." : "Get started by adding your first vehicle to the fleet."}
             />
          )}
        </div>
      </div>
      {isAddExpenseModalOpen && selectedVehicle && (
        <AddExpenseModal
            onClose={() => setIsAddExpenseModalOpen(false)}
            onAddExpense={handleAddExpense}
        />
      )}
      {isAddVehicleModalOpen && (
        <AddVehicleModal
            onClose={() => setIsAddVehicleModalOpen(false)}
            onAddVehicle={handleAddVehicle}
        />
      )}
    </>
  );
};

export default FleetDashboard;