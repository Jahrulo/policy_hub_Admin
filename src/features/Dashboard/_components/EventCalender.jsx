import { useEffect, useState } from "react";
import { Calendar } from "@natscale/react-calendar";
import "@natscale/react-calendar/dist/main.css";
import { ChevronUp, ChevronDown } from "lucide-react";
import CorrespondenceCard from "./CorrespondenceCard";
import { useData } from "../../../hooks/useData";

const EventCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredCorrespondence, setFilteredCorrespondence] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("up");
  const [showAll, setShowAll] = useState(false);

  const {
    data: { correspondences },
  } = useData();

  const formatDateForComparison = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  useEffect(() => {
    if (selectedDate && !showAll) {
      const selectedDateStr = formatDateForComparison(selectedDate);
      const filtered = correspondences.filter((item) => {
        const itemDate = formatDateForComparison(item.date);
        return itemDate === selectedDateStr;
      });
      setFilteredCorrespondence(filtered);
      setCurrentIndex(0);
    } else {
      setFilteredCorrespondence(correspondences);
      setCurrentIndex(0);
    }
  }, [selectedDate, correspondences, showAll]);

  const canGoNext = currentIndex < filteredCorrespondence.length - 1;
  const canGoPrevious = currentIndex > 0;

  const handleNext = () => {
    if (canGoNext && !isAnimating) {
      setDirection("down");
      setIsAnimating(true);
      setCurrentIndex((prev) => prev + 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handlePrevious = () => {
    if (canGoPrevious && !isAnimating) {
      setDirection("up");
      setIsAnimating(true);
      setCurrentIndex((prev) => prev - 1);
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  return (
    <div className="w-full bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <div className="w-full flex flex-col lg:flex-row gap-6">
        <div className="hidden md:block w-[40%]">
          <Calendar
            onChange={handleDateChange}
            value={selectedDate}
            className="w-[80%] rounded-lg font-Mons m-8"
            tileClassName={({ date }) => {
              const dateStr = formatDateForComparison(date);
              const hasCorrespondence = correspondences.some(
                (item) => formatDateForComparison(item.date) === dateStr
              );
              const today = new Date();
              const isToday = date.toDateString() === today.toDateString();

              return `rounded-full p-2 ${
                isToday ? "bg-teal-50 text-teal-700 font-bold" : ""
              } ${
                hasCorrespondence ? "font-semibold" : ""
              } hover:bg-teal-100 transition-all`;
            }}
            navigationLabel={({ date }) =>
              date.toLocaleString("default", { month: "long", year: "numeric" })
            }
            prevLabel={<ChevronUp className="text-teal-600" />}
            nextLabel={<ChevronDown className="text-teal-600" />}
            navigationAriaLabel="Calendar Navigation"
          />
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 z-40">
              Correspondence
              {selectedDate && !showAll && (
                <span className="ml-2 text-sm text-gray-500">
                  {selectedDate.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              {showAll && (
                <span className="ml-2 text-sm text-gray-500">Showing All</span>
              )}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={handlePrevious}
                disabled={!canGoPrevious}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  !canGoPrevious ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronUp className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={!canGoNext}
                className={`p-2 rounded-full hover:bg-gray-100 transition-colors ${
                  !canGoNext ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="">
            {filteredCorrespondence.length > 0 ? (
              <div
                className={`relative z-10 transition-transform duration-300 ease-in-out ${
                  isAnimating
                    ? direction === "down"
                      ? "-translate-y-full"
                      : "translate-y-full"
                    : "translate-y-0"
                }`}
              >
                {filteredCorrespondence[currentIndex] && (
                  <div className="min-h-[200px]">
                    <CorrespondenceCard
                      {...filteredCorrespondence[currentIndex]}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <p className="font-normal mb-4">
                  {selectedDate
                    ? "No correspondence for this date."
                    : "Select a date to view correspondence."}
                </p>
                {selectedDate && !showAll && (
                  <button
                    onClick={handleShowAll}
                    className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    Show All Correspondence
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-2 gap-2 text-sm font-medium">
            {filteredCorrespondence.length > 0 && (
              <span className="bg-bgSecondary px-4 py-3 rounded-lg text-textGreen">
                {currentIndex + 1}/{filteredCorrespondence.length}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCalendar;
