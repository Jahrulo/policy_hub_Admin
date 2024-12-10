import React from "react";
import { File } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDateToReadableString } from "../../../lib/utils";

const CorrespondenceCard = ({
  donor,
  amount,
  category,
  title,
  created_at,
  status,
}) => {
  const getStatusStyles = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === "pending") {
      return {
        container: "bg-bgSecondary text-textGreen",
        iconColor: "text-bgPrimary",
        snipBg: "bg-[#30BE821A]",
        buttonText: "Open",
        buttonBg: "bg-bgPrimary hover:bg-bgPrimaryHover",
      };
    } else if (statusLower?.includes("sent")) {
      return {
        container: "bg-cardRedBg text-cardRedButton",
        iconColor: "text-cardRedButton",
        snipBg: "bg-yellowBg",
        buttonText: "Send a Reminder",
        buttonBg: "bg-cardRedButton hover:bg-cardRedHover",
      };
    }
    return {
      container: "bg-gray-100 text-gray-600",
      iconColor: "text-gray-400",
      snipBg: "bg-gray-200",
      buttonText: "View",
      buttonBg: "bg-gray-300 hover:bg-gray-400",
    };
  };

  const statusStyles = getStatusStyles(status);

  return (
    <div
      className={`${statusStyles.container} w-full border border-gray-200 rounded-2xl transition-shadow duration-200 flex flex-col justify-between min-h-[200px] shadow-sm hover:shadow-md`}
    >
      <div className="p-4 sm:p-6 flex-grow">
        {/* Header Section */}
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-4">
          <div className="flex items-start gap-4">
            <div className="bg-[#0080800D] p-2 sm:p-3 rounded-xl flex items-center justify-center shrink-0">
              <File size={28} className={`${statusStyles.iconColor}`} />
            </div>
            <div className="flex flex-col gap-1">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 line-clamp-1">
                {donor}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">Le: {amount}</p>
            </div>
          </div>

          <div
            className={`${statusStyles.snipBg} px-3 py-1.5 rounded-full text-sm font-medium ml-0 sm:ml-auto`}
          >
            {category}
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2">
            {title}
          </h3>
          <p
            className={`${
              statusStyles.text || "text-gray-600"
            } text-sm sm:text-base font-medium p-2 w-fit`}
          >
            {formatDateToReadableString(created_at)}
          </p>
        </div>
      </div>

      {/* Button Section */}
      <div className="px-4 py-3">
        <Link
          to="/"
          className={`${statusStyles.buttonBg} p-3 rounded-lg text-white text-center font-semibold block transition-colors duration-150`}
        >
          {statusStyles.buttonText}
        </Link>
      </div>
    </div>
  );
};

export default CorrespondenceCard;
