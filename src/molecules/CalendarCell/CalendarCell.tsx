import BookedIcon from "@/atoms/Icons/Booked";
import { format } from "date-fns";

/*
interface CalendarEvent {
  id: string;
  price: number;
  is_booked: boolean;
  data: Date;
  created_at: Date;
  booked_by: {};
  property: {};
}
  */

interface DateCellProps {
  date: Date;
  event: any;
  isCurrentMonth: boolean;
  isLastInRow: boolean;
  onSelect: () => void;
}

export default function CalendarCell({
  date,
  event,
  isCurrentMonth = false,
  isLastInRow = false,
  onSelect,
}: DateCellProps) {
  const dayNumber = format(date, "d");

  /*
  const getPriceColor = (price?: number) => {
    if (!price) return "text-neutral-800";
    if (price === 50000) return "text-primary"; // Premium rate - blue
    if (price === 55500) return "text-success"; // Best value - green
    return "text-neutral-800"; // Standard rate
  };

  const getPriceDisplay = (price?: number) => {
    if (!price) return null;
    return `$${(price / 100).toFixed(0)}`;
  };
  */

  const cellClasses = [
    "min-h-20 md:min-h-24 p-2 md:p-3",
    isCurrentMonth
      ? "hover:bg-neutral-50 cursor-pointer transition-colors group"
      : "bg-neutral-50",
    !isLastInRow ? "border-r border-neutral-200" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={cellClasses}
      onClick={isCurrentMonth ? onSelect : undefined}
      role="button"
      tabIndex={0}
      onKeyDown={isCurrentMonth ? onSelect : undefined}
      data-testid={`cell-date-${format(date, "yyyy-MM-dd")}`}
    >
      <div className="flex items-start justify-between">
        <div
          className={`text-sm text-gold font-medium mb-1 ${
            isCurrentMonth
              ? event?.price
                ? "text-neutral-800"
                : "text-warning"
              : "text-neutral-400"
          }`}
        >
          {dayNumber}
        </div>
        {event?.is_booked && isCurrentMonth && (
          <i className="fas fa-bed text-neutral-400 text-xs" title="Booked" />
        )}
      </div>

      <div>
        {event.is_booked ? (
          <div className="w-full place-content-center">
            <BookedIcon />
          </div>
        ) : event.is_booked !== undefined ? (
          <div>$ {event.price}</div>
        ) : (
          <div>$255</div>
        )}
      </div>
    </div>
  );
}
