import { calendarEvents } from "src/pages/api/shared";
import CalendarCell from "../CalendarCell";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
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

interface CalendarGridProps {
  currentDate: Date;
  events: any;
  isLoading: boolean;
  onDateSelect: (date: string) => void;
}

const WEEKDAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function CalendarGrid({
  currentDate,
  events,
  isLoading,
  onDateSelect,
}: CalendarGridProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Start on Monday
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Create a map for quick event lookup

  const eventMap = new Map<any, CalendarEvent>();
  events.forEach((eventz: any) => {
    console.log("church: ", eventz);
    eventMap.set(eventz.date, eventz);
  });

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  if (isLoading) {
    return (
      <div className="bg-white shadow-sm border-l border-r border-neutral-200">
        <div className="grid grid-cols-7 border-b border-neutral-200">
          {WEEKDAYS.map((day) => (
            <div
              key={day}
              className="p-3 md:p-4 text-center text-sm font-medium text-neutral-600 bg-neutral-50 border-r border-neutral-200 last:border-r-0"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="p-8 text-center text-neutral-500">
          Loading calendar...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-sm border-l border-r border-neutral-200">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-neutral-200">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="p-3 md:p-4 text-center text-sm font-medium text-neutral-600 bg-neutral-50 border-r border-neutral-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar weeks */}
      {weeks.map((week, weekIndex) => (
        <div
          key={weekIndex}
          className="grid grid-cols-7 border-b border-neutral-200 last:border-b-0"
        >
          {week.map((day, dayIndex) => {
            const dateStr = format(day, "yyyy-MM-dd");
            const event = eventMap.get(dateStr);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isLastInRow = dayIndex === 6;

            return (
              <CalendarCell
                key={dateStr}
                date={day}
                event={event ? event : []}
                isCurrentMonth={isCurrentMonth}
                isLastInRow={isLastInRow}
                onSelect={() => onDateSelect(dateStr)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
