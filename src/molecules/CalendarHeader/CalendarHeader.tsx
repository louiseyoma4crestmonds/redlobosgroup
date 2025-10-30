import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import Button from "@/atoms/Button";

interface CalendarHeaderProps {
  currentDate: Date;
  onNavigateMonth: (direction: "prev" | "next") => void;
  onGoToToday: () => void;
}

export function CalendarHeader({
  currentDate,
  onNavigateMonth,
  onGoToToday,
}: CalendarHeaderProps) {
  const monthName = currentDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="bg-white rounded-t-xl shadow-sm border border-neutral-200 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onGoToToday}
            variant="primary"
            data-testid="button-today"
          >
            Today
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              variant="secondary"
              onClick={() => onNavigateMonth("prev")}
              data-testid="button-prev-month"
            >
              <ChevronLeft className="h-4 w-4 text-gold hover:text-white" />
            </Button>
            <Button
              variant="secondary"
              onClick={() => onNavigateMonth("next")}
              data-testid="button-next-month"
            >
              <ChevronRight className="h-4 w-4 text-gold hover:text-white" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <h1
            className="text-lg font-semibold text-neutral-800"
            data-testid="text-current-month"
          >
            {monthName}
          </h1>
        </div>
      </div>
    </div>
  );
}
