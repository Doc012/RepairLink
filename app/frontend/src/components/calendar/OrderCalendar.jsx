// Create new file: src/components/Calendar/OrderCalendar.jsx
import { useState } from 'react';
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from 'date-fns';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';

const OrderCalendar = ({ orders }) => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  // Add getStatusColor function
  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: "text-green-600 bg-green-50 dark:bg-green-900/20",
      PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20",
      CANCELLED: "text-red-600 bg-red-50 dark:bg-red-900/20"
    };
    return colors[status] || colors.PENDING;
  };

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  }

  // Get orders for the selected day
  const selectedDayOrders = orders.filter((order) =>
    isSameDay(parseISO(order.bookingDate), selectedDay)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {format(firstDayCurrentMonth, 'MMMM yyyy')}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={previousMonth}
            className="rounded-lg border border-gray-300 p-2 text-gray-400 hover:text-gray-500 dark:border-slate-600 dark:hover:text-slate-300"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <button
            onClick={nextMonth}
            className="rounded-lg border border-gray-300 p-2 text-gray-400 hover:text-gray-500 dark:border-slate-600 dark:hover:text-slate-300"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 dark:bg-slate-700 dark:text-slate-200">
        <div className="bg-white py-2 dark:bg-slate-800">S</div>
        <div className="bg-white py-2 dark:bg-slate-800">M</div>
        <div className="bg-white py-2 dark:bg-slate-800">T</div>
        <div className="bg-white py-2 dark:bg-slate-800">W</div>
        <div className="bg-white py-2 dark:bg-slate-800">T</div>
        <div className="bg-white py-2 dark:bg-slate-800">F</div>
        <div className="bg-white py-2 dark:bg-slate-800">S</div>
      </div>

      <div className="grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm dark:bg-slate-700">
        {days.map((day, dayIdx) => {
          const dayOrders = orders.filter((order) =>
            isSameDay(parseISO(order.bookingDate), day)
          );

          return (
            <div
              key={day.toString()}
              className={`relative bg-white dark:bg-slate-800 ${
                dayIdx === 0 && colStartClasses[getDay(day)]
              }`}
            >
              <button
                onClick={() => setSelectedDay(day)}
                className={`flex h-14 w-full flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-slate-700/50 ${
                  isEqual(day, selectedDay) && 'bg-gray-50 font-semibold text-blue-600'
                } ${!isSameMonth(day, firstDayCurrentMonth) && 'text-gray-400'} ${
                  isToday(day) && 'text-blue-600 font-semibold'
                }`}
              >
                <time dateTime={format(day, 'yyyy-MM-dd')}>
                  {format(day, 'd')}
                </time>
                {dayOrders.length > 0 && (
                  <div className="mt-1">
                    <span className="flex h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                  </div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Selected day orders */}
      {selectedDayOrders.length > 0 && (
        <div className="mt-6">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Orders for {format(selectedDay, 'MMMM d, yyyy')}
          </h3>
          <ol className="mt-4 space-y-2">
            {selectedDayOrders.map((order) => (
              <li
                key={order.bookingID}
                className="group flex items-center space-x-4 rounded-lg px-4 py-2 hover:bg-gray-50 dark:hover:bg-slate-700/50"
              >
                <time
                  dateTime={`${order.bookingDate}T${order.scheduledTime}`}
                  className="flex-none text-sm text-gray-500 dark:text-slate-400"
                >
                  {order.scheduledTime}
                </time>
                <div className="flex-auto">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {order.serviceName}
                  </p>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">
                    {order.customerName}
                  </p>
                </div>
                <div
                  className={`flex-none rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

export default OrderCalendar;