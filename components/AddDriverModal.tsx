
import React, { useState } from 'react';
import { Driver, User, EmploymentStatus } from '../types';
import { CloseIcon } from './icons/Icons';

interface AddDriverModalProps {
  onClose: () => void;
  onAddDriver: (driverData: Omit<Driver, 'id' | 'created_at' | 'updated_at' | 'user_id'> & { user: Omit<User, 'id' | 'created_at' | 'updated_at' | 'role' | 'email_verified'>}) => void;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ onClose, onAddDriver }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        license_number: '',
        license_type: 'Class 2',
        license_expiry_date: '',
        date_of_birth: '',
        hire_date: new Date().toISOString().split('T')[0],
        employment_status: EmploymentStatus.ACTIVE,
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.first_name || !formData.last_name || !formData.license_number || !formData.license_expiry_date || !formData.date_of_birth) {
            setError('Please fill out all required fields (*).');
            return;
        }
        setError('');
        const { first_name, last_name, email, phone, ...driverData } = formData;
        onAddDriver({
            ...driverData,
            user: { first_name, last_name, email, phone, is_active: true },
        });
    };

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <header className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold">Add New Driver</h2>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200"><CloseIcon className="w-6 h-6" /></button>
            </header>
            <form onSubmit={handleSubmit}>
                <main className="p-6 space-y-4 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2">Personal Information</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">First Name*</label>
                            <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                            <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Date of Birth*</label>
                            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>

                         <h3 className="md:col-span-2 text-lg font-semibold text-gray-800 border-b pb-2 mt-4">License & Employment</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">License Number*</label>
                            <input type="text" name="license_number" value={formData.license_number} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">License Type</label>
                            <input type="text" name="license_type" value={formData.license_type} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">License Expiry Date*</label>
                            <input type="date" name="license_expiry_date" value={formData.license_expiry_date} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Hire Date</label>
                            <input type="date" name="hire_date" value={formData.hire_date} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Employment Status</label>
                            <select name="employment_status" value={formData.employment_status} onChange={handleChange} className="mt-1 block w-full rounded-md border border-gray-300 bg-white text-gray-900 pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 capitalize">
                                {Object.values(EmploymentStatus).map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                            </select>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </main>
                <footer className="p-4 bg-gray-50 border-t flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                    <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700">Add Driver</button>
                </footer>
            </form>
        </div>
    </div>
    );
};

export default AddDriverModal;
