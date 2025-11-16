
import React, { useState } from 'react';
import { Route, RouteType, RoadConditions } from '../types';

interface AddRouteFormProps {
  onCancel: () => void;
  onAddRoute: (route: Omit<Route, 'id' | 'created_at' | 'updated_at' | 'border_crossings' | 'toll_gates' | 'total_toll_cost' | 'is_active' | 'is_popular'> & { road_conditions: RoadConditions }) => void;
}

const AddRouteForm: React.FC<AddRouteFormProps> = ({ onCancel, onAddRoute }) => {
    const [formData, setFormData] = useState({
        route_name: '',
        route_code: '',
        origin_city: '',
        origin_country: 'Zimbabwe',
        destination_city: '',
        destination_country: 'Zimbabwe',
        distance_km: '',
        estimated_duration_hours: '',
        route_type: RouteType.DOMESTIC,
        road_conditions: RoadConditions.GOOD,
        notes: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.route_name || !formData.origin_city || !formData.destination_city || !formData.distance_km) {
            setError('Route Name, Origin, Destination, and Distance are required.');
            return;
        }
        setError('');
        const { route_code, origin_country, destination_country, notes, ...rest } = formData;
        onAddRoute({
            ...rest,
            route_code: route_code || `${formData.origin_city.substring(0,3).toUpperCase()}-${formData.destination_city.substring(0,3).toUpperCase()}-NEW`,
            origin_country: formData.route_type === RouteType.DOMESTIC ? 'Zimbabwe' : formData.origin_country,
            destination_country: formData.route_type === RouteType.DOMESTIC ? 'Zimbabwe' : formData.destination_country,
            notes: notes || undefined,
            distance_km: parseFloat(formData.distance_km),
            estimated_duration_hours: parseFloat(formData.estimated_duration_hours) || 0,
        });
    };

    return (
    <div className="bg-white rounded-xl shadow-md p-6 overflow-y-auto">
        <form onSubmit={handleSubmit}>
            <div className="border-b border-gray-200 pb-4 mb-6">
                 <h3 className="text-2xl font-bold leading-6 text-gray-900">Add New Company Route</h3>
                 <p className="mt-1 text-md text-gray-500">Define a new route for your logistics operations.</p>
            </div>
            <main className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Route Name*</label>
                        <input type="text" name="route_name" placeholder="e.g., Harare - Bulawayo" value={formData.route_name} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Origin City*</label>
                        <input type="text" name="origin_city" placeholder="e.g., Harare" value={formData.origin_city} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Destination City*</label>
                        <input type="text" name="destination_city" placeholder="e.g., Bulawayo" value={formData.destination_city} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Distance (km)*</label>
                        <input type="number" name="distance_km" placeholder="e.g., 440" value={formData.distance_km} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Est. Duration (hours)</label>
                        <input type="number" name="estimated_duration_hours" placeholder="e.g., 6" value={formData.estimated_duration_hours} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Route Type</label>
                        <select name="route_type" value={formData.route_type} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 capitalize">
                            {Object.values(RouteType).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Road Conditions</label>
                        <select name="road_conditions" value={formData.road_conditions} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 capitalize">
                            {Object.values(RoadConditions).map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                        </select>
                    </div>
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </main>
            <footer className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
                <button type="button" onClick={onCancel} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">Save Route</button>
            </footer>
        </form>
    </div>
    );
};

export default AddRouteForm;
