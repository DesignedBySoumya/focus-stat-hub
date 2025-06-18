
import React from 'react';

interface DateTimelineProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export function DateTimeline({ selectedDate, onDateSelect }: DateTimelineProps) {
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 10);

    for (let i = 0; i < 21; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = date.getDate().toString();
      const month = date.toLocaleDateString('en-US', { month: 'short' });
      const time = '0:00';
      
      dates.push({
        day: dayName,
        date: dayNumber,
        month: month,
        time: time,
        isToday: date.toDateString() === today.toDateString(),
        fullDate: date
      });
    }
    
    return dates;
  };

  const dates = generateDates();

  return (
    <div className="px-6 py-4">
      <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
        {dates.map((dateInfo, index) => (
          <button
            key={index}
            onClick={() => onDateSelect(dateInfo.date)}
            className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg transition-all duration-200 min-w-[60px] ${
              selectedDate === dateInfo.date
                ? 'bg-orange-500 text-white shadow-lg'
                : dateInfo.isToday
                ? 'bg-slate-700 text-orange-400'
                : 'text-gray-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <span className="text-xs font-medium">{dateInfo.month}</span>
            <span className="text-lg font-bold">{dateInfo.date}</span>
            <span className="text-xs">{dateInfo.day}</span>
            <span className="text-xs mt-1">{dateInfo.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
