import { useEffect, useState } from "react";
import CalendarGrid from "@/molecules/CalendarGrid";
import CalendarHeader from "@/molecules/CalendarHeader";
import BookedIcon from "@/atoms/Icons/Booked";
import Modal from "@/molecules/Modal";
import { getPropertyEvents } from "../../api";

export type CalendarProps = {
  isOpen: boolean;
  closeCalendar: (close: boolean) => void;
};

export default function Calendar(props: CalendarProps) {
  const { isOpen = false, closeCalendar } = props;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(true);

  const [propertyEvents, setPropertyEvents] = useState<any>([]);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  useEffect(() => {
    getPropertyEvents(1).then((response: any) => {
      const data = response?.data?.data;
      setPropertyEvents(Array.isArray(data) ? data : []);
    }).catch(() => setPropertyEvents([]));
  }, []);

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        closeCalendar(false);
      }}
    >
      <div className="min-h-screen bg-neutral-50 py-4 md:py-6">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          <CalendarHeader
            currentDate={currentDate}
            onNavigateMonth={navigateMonth}
            onGoToToday={goToToday}
          />

          <CalendarGrid
            currentDate={currentDate}
            events={propertyEvents}
            isLoading={false}
            onDateSelect={handleDateSelect}
          />

          <div className="bg-white rounded-b-xl shadow-sm border border-t-0 border-neutral-200 p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center space-x-2">
                  <div>Booked</div>
                  <div>
                    <BookedIcon />
                  </div>
                </div>
              </div>

              <div className="text-sm text-neutral-500">
                <span>Click any date to view details</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
