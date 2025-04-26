// Create new file: src/components/Calendar/OrderCalendar.jsx
import { useState } from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { CalendarDaysIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';

const OrderCalendar = ({ orders = [], onSelectOrder, customerInfo = {} }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  // Get previous and next month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format dates for comparison - safely handles different date formats
  const formatDateForComparison = (date) => {
    try {
      if (date instanceof Date) {
        if (isNaN(date.getTime())) {
          // Invalid date object
          console.warn("Invalid date object:", date);
          return null;
        }
        
        // Valid date object - format as YYYY-MM-DD
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
      
      // Not a date object - return null
      console.warn("Not a date object:", date);
      return null;
    } catch (err) {
      console.error("Error formatting date:", err);
      return null;
    }
  };
  
  // Get orders for a specific date
  const getOrdersForDate = (day) => {
    try {
      const dateToCheck = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      const formattedDate = formatDateForComparison(dateToCheck);
      
      if (!formattedDate) return [];
      
      return orders.filter(order => {
        try {
          // Try different date formats
          // 1. Check if order has a date property in DD/MM/YYYY format (from our formatter)
          if (order.date) {
            let orderDate;
            // Handle British format (DD/MM/YYYY)
            if (order.date.includes('/')) {
              const [day, month, year] = order.date.split('/');
              orderDate = new Date(`${year}-${month}-${day}`);
            } else {
              // Try direct parsing
              orderDate = new Date(order.date);
            }
            
            if (!isNaN(orderDate.getTime())) {
              const orderDateStr = formatDateForComparison(orderDate);
              return orderDateStr === formattedDate;
            }
          }
          
          // 2. Check if the order has a bookingDate in ISO format
          if (order.bookingDate) {
            const orderDate = new Date(order.bookingDate);
            if (!isNaN(orderDate.getTime())) {
              const orderDateStr = formatDateForComparison(orderDate);
              return orderDateStr === formattedDate;
            }
          }
          
          return false;
        } catch (err) {
          console.error("Error filtering orders by date:", err);
          return false;
        }
      });
    } catch (err) {
      console.error("Error getting orders for date:", err);
      return [];
    }
  };
  
  // Get status badge styles
  const getStatusStyles = (status) => {
    switch(status) {
      case 'COMPLETED':
        return 'bg-green-100 dark:bg-green-900/20 dark:text-green-400 text-green-600';
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/20 dark:text-red-400 text-red-600';
      case 'CONFIRMED':
        return 'bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 text-blue-600';
      default:
        return 'bg-amber-100 dark:bg-amber-900/20 dark:text-amber-600 text-amber-700';
    }
  };

  // Helper function to get customer display name
  const getCustomerDisplayName = (order) => {
    if (!order) return '';
    
    if (order.customerName) {
      return order.customerName;
    }
    
    if (order.customerID && customerInfo[order.customerID]?.fullName) {
      return customerInfo[order.customerID].fullName;
    }
    
    return `Customer #${order.customerID || 'Unknown'}`;
  };

  // Calendar grid rendering function
  const renderCalendarDays = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const days = [];
    
    // Add day names
    dayNames.forEach(day => {
      days.push(
        <div key={`day-name-${day}`} className="py-2 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
          {day}
        </div>
      );
    });
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div 
          key={`empty-${i}`} 
          className="border border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50"
        />
      );
    }
    
    // Add days
    const today = new Date();
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = 
        today.getDate() === i && 
        today.getMonth() === currentMonth.getMonth() && 
        today.getFullYear() === currentMonth.getFullYear();
        
      let dayOrders = [];
      try {
        dayOrders = getOrdersForDate(i);
      } catch (err) {
        console.error(`Error getting orders for day ${i}:`, err);
        dayOrders = [];
      }
      
      const hasOrders = dayOrders.length > 0;
      
      days.push(
        <div 
          key={`day-${i}`} 
          className={`min-h-[100px] border p-1 overflow-auto ${
            isToday 
              ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/10' 
              : 'border-gray-200 dark:border-slate-700'
          } ${hasOrders ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'}`}
        >
          <div className={`text-right text-sm font-medium ${
            isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`
          }>
            {i}
          </div>
          
          {/* Orders for this day */}
          <div className="mt-1 space-y-1">
            {dayOrders.map(order => (
              <div 
                key={order.bookingID || `order-${Math.random()}`}
                className={`rounded-md p-1 text-xs ${
                  order.status !== "COMPLETED" ? 'cursor-pointer hover:brightness-95 active:scale-95' : ''
                } transition-all ${getStatusStyles(order.status)}`}
                onClick={() => {
                  if (order.status !== "COMPLETED" && onSelectOrder) {
                    onSelectOrder(order);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate font-medium">
                    {order.time || "N/A"}
                  </span>
                  <span className="text-[10px] font-medium uppercase opacity-75">
                    {order.status && order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                  </span>
                </div>
                <div className="flex items-center space-x-1 truncate">
                  <UserIcon className="h-3 w-3" />
                  <span className="truncate">
                    {order.customerID && customerInfo[order.customerID]?.fullName 
                      ? customerInfo[order.customerID].fullName 
                      : `Customer #${order.customerID || 'Unknown'}`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate text-[10px] opacity-75">
                    {order.serviceName || "Service"}
                  </span>
                  <span className="flex items-center">
                    <CurrencyDollarIcon className="h-3 w-3" />
                    <span>{formatCurrency(order.price || 0)}</span>
                  </span>
                </div>
                {order.status !== "COMPLETED" && (
                  <div className="mt-1 text-[10px] text-center opacity-75">
                    Click to update
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }
    
    return days;
  };
  
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h2>
        <div className="flex space-x-2">
          <button
            onClick={prevMonth}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="rounded-lg border border-gray-300 px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            className="rounded-lg border border-gray-300 p-2 text-gray-600 hover:bg-gray-50 dark:border-slate-600 dark:text-gray-300 dark:hover:bg-slate-700"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {renderCalendarDays()}
      </div>
      
      <div className="mt-4 flex flex-wrap justify-center gap-4">
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-amber-100 dark:bg-amber-900/30"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Pending</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Confirmed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-green-100 dark:bg-green-900/30"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Completed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="h-3 w-3 rounded-full bg-red-100 dark:bg-red-900/30"></div>
          <span className="text-xs text-gray-600 dark:text-gray-400">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default OrderCalendar;