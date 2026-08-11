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
  differenceInCalendarDays,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarEvent {
  id?: string | number;
  date: string; // "yyyy-MM-dd"
  is_booked: boolean;
}

interface BookingCalendarProps {
  events: CalendarEvent[];
  onCheckInSelect: (date: string | null) => void;
  onCheckOutSelect: (date: string | null) => void;
  checkInDate: string | null;
  checkOutDate: string | null;
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default function BookingCalendar({
  events,
  onCheckInSelect,
  onCheckOutSelect,
  checkInDate,
  checkOutDate,
  currentDate,
  onMonthChange,
}: BookingCalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart),
    end: endOfWeek(monthEnd),
  });

  // Build a fast lookup: date-string → is_booked
  const bookedSet = new Set<string>();
  events.forEach((e) => {
    if (e.is_booked) bookedSet.add(e.date);
  });

  const isBooked = (date: Date) => bookedSet.has(format(date, "yyyy-MM-dd"));
  const isPast = (date: Date) => isBefore(date, today) && !isSameDay(date, today);

  /** Returns true if any booked day falls strictly between start and end (inclusive of end, exclusive of start if needed) */
  const hasBookedInRange = (start: Date, end: Date): boolean => {
    const s = isAfter(start, end) ? end : start;
    const e = isAfter(start, end) ? start : end;
    for (const b of Array.from(bookedSet)) {
      const bd = parseISO(b);
      if (isWithinInterval(bd, { start: s, end: e })) return true;
    }
    return false;
  };

  const handleDateClick = (date: Date) => {
    if (!isSameMonth(date, currentDate)) return;
    if (isBooked(date) || isPast(date)) return;

    const dateString = format(date, "yyyy-MM-dd");

    if (!checkInDate) {
      // No selection yet — set check-in
      onCheckInSelect(dateString);
      onCheckOutSelect(null);
      return;
    }

    const checkIn = parseISO(checkInDate);

    if (!checkOutDate) {
      if (isSameDay(date, checkIn)) {
        // Clicked same day — deselect
        onCheckInSelect(null);
        return;
      }

      if (isAfter(date, checkIn)) {
        // Check no booked dates in range
        if (hasBookedInRange(checkIn, date)) {
          // Start fresh from this date as new check-in
          onCheckInSelect(dateString);
          onCheckOutSelect(null);
        } else {
          onCheckOutSelect(dateString);
        }
      } else {
        // Clicked before check-in — reassign as new check-in
        onCheckInSelect(dateString);
        onCheckOutSelect(null);
      }
      return;
    }

    // Both dates set — restart selection
    onCheckInSelect(dateString);
    onCheckOutSelect(null);
  };

  // Determine hover/range state per day
  const isCheckInDay = (date: Date) =>
    !!checkInDate && isSameDay(date, parseISO(checkInDate));
  const isCheckOutDay = (date: Date) =>
    !!checkOutDate && isSameDay(date, parseISO(checkOutDate));
  const isInRange = (date: Date) => {
    if (!checkInDate || !checkOutDate) return false;
    try {
      return isWithinInterval(date, {
        start: parseISO(checkInDate),
        end: parseISO(checkOutDate),
      });
    } catch {
      return false;
    }
  };

  // Split into weeks
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  const navigateMonth = (dir: "prev" | "next") => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + (dir === "next" ? 1 : -1));
    onMonthChange(d);
  };

  // Disable "prev" if already on current month
  const isPrevDisabled =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  return (
    <div className="w-full select-none">
      {/* Month nav */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          disabled={isPrevDisabled}
          onClick={() => navigateMonth("prev")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <span className="text-base font-semibold text-gray-800">
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={() => navigateMonth("next")}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold text-gray-400 py-1 tracking-wide"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="rounded-xl overflow-hidden border border-gray-100">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map((day, di) => {
              const inCurrentMonth = isSameMonth(day, currentDate);
              const booked = isBooked(day);
              const past = isPast(day);
              const disabled = !inCurrentMonth || booked || past;
              const checkIn = isCheckInDay(day);
              const checkOut = isCheckOutDay(day);
              const inRange = isInRange(day);

              let bg = "bg-white";
              let text = "text-gray-800";
              let cursor = "cursor-pointer hover:bg-gray-50";
              let rounded = "";

              if (!inCurrentMonth) {
                bg = "bg-gray-50";
                text = "text-gray-200";
                cursor = "cursor-default";
              } else if (booked) {
                bg = "bg-gray-100";
                text = "text-gray-300 line-through";
                cursor = "cursor-not-allowed";
              } else if (past) {
                bg = "bg-white";
                text = "text-gray-300";
                cursor = "cursor-not-allowed";
              } else if (checkIn || checkOut) {
                bg = "bg-gold";
                text = "text-white font-bold";
                cursor = "cursor-pointer";
                rounded = checkIn ? "rounded-l-full" : "rounded-r-full";
              } else if (inRange) {
                bg = "bg-amber-50";
                text = "text-gray-700";
                cursor = "cursor-pointer hover:bg-amber-100";
              } else {
                cursor = "cursor-pointer hover:bg-gray-50";
              }

              return (
                <div
                  key={di}
                  role="button"
                  tabIndex={disabled ? -1 : 0}
                  aria-label={format(day, "PPP")}
                  aria-disabled={disabled}
                  className={[
                    "relative h-11 flex flex-col items-center justify-center text-sm transition-colors",
                    "border-b border-r border-gray-100",
                    di === 6 ? "border-r-0" : "",
                    wi === weeks.length - 1 ? "border-b-0" : "",
                    bg,
                    text,
                    cursor,
                    rounded,
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => !disabled && handleDateClick(day)}
                  onKeyDown={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && !disabled) {
                      handleDateClick(day);
                    }
                  }}
                >
                  <span className="leading-none">{format(day, "d")}</span>
                  {booked && inCurrentMonth && (
                    <span className="text-[9px] leading-none text-red-400 mt-0.5">
                      booked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gold inline-block" />
          Selected
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-100 inline-block" />
          Your stay
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-gray-200 inline-block" />
          Unavailable
        </span>
      </div>
    </div>
  );
}
