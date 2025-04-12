import { useState } from 'react';
import { 
  CurrencyDollarIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { formatCurrency } from '../../utils/formatCurrency';

const Orders = () => {
  const [orders, setOrders] = useState([
    {
      id: 1,
      customerName: "Jane Smith",
      service: "Full Car Service",
      amount: 3499.99,  // Now in ZAR
      date: "2024-04-15",
      time: "14:30",
      status: "COMPLETED",
      paymentStatus: "PAID"
    },
    {
      id: 2,
      customerName: "Mike Johnson",
      service: "Oil Change",
      amount: 799.99,  // Now in ZAR
      date: "2024-04-16",
      time: "10:00",
      status: "PENDING",
      paymentStatus: "UNPAID"
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "text-green-600 bg-green-50 dark:bg-green-900/20",
      PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      CANCELLED: "text-red-600 bg-red-50 dark:bg-red-900/20"
    };
    return colors[status] || colors.PENDING;
  };

  const getPaymentStatusColor = (status) => {
    return status === "PAID" 
      ? "text-green-600 bg-green-50 dark:bg-green-900/20"
      : "text-red-600 bg-red-50 dark:bg-red-900/20";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Orders
        </h1>
        <div className="flex space-x-2">
          <button className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700">
            Filter
          </button>
        </div>
      </div>

      {/* Orders List */}
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
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 dark:text-slate-400">
                  Payment
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <UserIcon className="mr-2 h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-900 dark:text-white">
                      {order.service}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-gray-900 dark:text-white">
                      <CurrencyDollarIcon className="mr-1 h-5 w-5 text-gray-400" />
                      {formatCurrency(order.amount)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center text-gray-900 dark:text-white">
                      <CalendarDaysIcon className="mr-1 h-5 w-5 text-gray-400" />
                      {order.date}
                      <ClockIcon className="ml-2 mr-1 h-5 w-5 text-gray-400" />
                      {order.time}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
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

export default Orders;