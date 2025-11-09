import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  parseISO,
  isAfter,
  isBefore,
  isWithinInterval,
} from "date-fns";

interface CalendarEvent {
  id: string;
  price: number;
  is_booked: boolean;
  date: string;
  created_at: Date;
  booked_by: {};
  property: {};
}

interface BookingCalendarProps {
  events: CalendarEvent[];
  onCheckInSelect: (date: string | null) => void;
  onCheckOutSelect: (date: string | null) => void;
  checkInDate: string | null;
  checkOutDate: string | null;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function BookingCalendar({
  events,
  onCheckInSelect,
  onCheckOutSelect,
  checkInDate,
  checkOutDate,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const eventMap = new Map<string, CalendarEvent>();
  events.forEach((event: CalendarEvent) => {
    eventMap.set(event.date, event);
  });

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleDateClick = (date: Date, event: CalendarEvent | undefined) => {
    if (!isSameMonth(date, currentDate)) return;
    if (event?.is_booked) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isBefore(date, today)) return;

    const dateString = format(date, "yyyy-MM-dd");

    if (!checkInDate) {
      onCheckInSelect(dateString);
    } else if (!checkOutDate) {
      const checkIn = parseISO(checkInDate);
      if (isAfter(date, checkIn)) {
        onCheckOutSelect(dateString);
      } else {
        onCheckInSelect(dateString);
      }
    } else {
      onCheckInSelect(dateString);
      onCheckOutSelect(null);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    try {
      const checkIn = parseISO(checkInDate);
      const checkOut = parseISO(checkOutDate);
      return isWithinInterval(date, { start: checkIn, end: checkOut });
    } catch {
      return false;
    }
  };

  const isCheckIn = (date: Date) => {
    if (!checkInDate) return false;
    try {
      return isSameDay(date, parseISO(checkInDate));
    } catch {
      return false;
    }
  };

  const isCheckOut = (date: Date) => {
    if (!checkOutDate) return false;
    try {
      return isSameDay(date, parseISO(checkOutDate));
    } catch {
      return false;
    }
  };

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h3 className="text-lg font-semibold text-gray-800">{monthName}</h3>
        <button
          type="button"
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7">
            {week.map((day, dayIndex) => {
              const dateString = format(day, "yyyy-MM-dd");
              const event = eventMap.get(dateString);
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isBooked = event?.is_booked;
              const inRange = isDateInRange(day);
              const isCheckInDate = isCheckIn(day);
              const isCheckOutDate = isCheckOut(day);
              const isPast = isBefore(day, new Date()) && !isSameDay(day, new Date());

              let cellClasses = "relative h-12 flex items-center justify-center text-sm border-b border-r ";
              
              if (dayIndex === 6) cellClasses += "border-r-0 ";
              if (weekIndex === weeks.length - 1) cellClasses += "border-b-0 ";

              if (!isCurrentMonth) {
                cellClasses += "bg-gray-50 text-gray-300 ";
              } else if (isBooked || isPast) {
                cellClasses += "bg-gray-100 text-gray-400 cursor-not-allowed ";
              } else if (isCheckInDate || isCheckOutDate) {
                cellClasses += "bg-gold text-white font-bold cursor-pointer ";
              } else if (inRange) {
                cellClasses += "bg-yellow-50 text-gray-800 cursor-pointer hover:bg-yellow-100 ";
              } else {
                cellClasses += "text-gray-700 cursor-pointer hover:bg-gray-50 ";
              }

              return (
                <div
                  key={dayIndex}
                  className={cellClasses}
                  onClick={() => handleDateClick(day, event)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                >
                  <div className="flex flex-col items-center">
                    <span>{format(day, "d")}</span>
                    {isBooked && isCurrentMonth && (
                      <span className="text-xs text-red-500">✕</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gold rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-50 border border-yellow-200 rounded"></div>
          <span>In Range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-gray-100 rounded"></div>
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  );
}
