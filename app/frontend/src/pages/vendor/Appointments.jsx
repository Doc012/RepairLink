import { useState } from 'react';
import { 
  CheckIcon, 
  XMarkIcon, 
  ClockIcon,
  CalendarDaysIcon
} from '@heroicons/react/24/outline';

const Appointments = () => {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      customerName: 'Alice Johnson',
      service: 'Car Repair',
      date: '2024-04-15',
      time: '10:00 AM',
      status: 'PENDING',
      price: 150.00
    },
    // Add more mock appointments
  ]);

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
      CONFIRMED: 'text-green-600 bg-green-50 dark:bg-green-900/20',
      CANCELLED: 'text-red-600 bg-red-50 dark:bg-red-900/20',
      COMPLETED: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Appointments
        </h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-slate-800 dark:text-white dark:ring-slate-700 dark:hover:bg-slate-700">
            <CalendarDaysIcon className="mr-2 h-5 w-5" />
            View Calendar
          </button>
        </div>
      </div>

      {/* Appointments List */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {appointment.customerName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      {appointment.service}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      {appointment.date} at {appointment.time}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-gray-900 dark:text-white">
                      ${appointment.price}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex space-x-2">
                      {appointment.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'CONFIRMED')}
                            className="rounded-full bg-green-50 p-1 text-green-600 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/40"
                          >
                            <CheckIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(appointment.id, 'CANCELLED')}
                            className="rounded-full bg-red-50 p-1 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40"
                          >
                            <XMarkIcon className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      {appointment.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleStatusChange(appointment.id, 'COMPLETED')}
                          className="rounded-full bg-blue-50 p-1 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40"
                        >
                          <ClockIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;