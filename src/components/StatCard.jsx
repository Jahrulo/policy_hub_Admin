/* eslint-disable react/prop-types */


const StatCard = ({ title, value, lastUpdated, icon: Icon, percentage }) => {
  const getStatusStyles = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "completed") {
      return {
        container: "bg-bgSecondary text-textGreen",
        iconColor: "#30BE82",
      };
    } else if (statusLower === "pending") {
      return {
        container: "bg-[#FFCC000D] text-yellowBg",
        iconColor: "#FFCC00",
      };
    } else if (statusLower === "ongoing") {
      return {
        container: "bg-[#32ADE60D] text-[#32ADE6]",
        iconColor: "#32ADE6",
      };
    } else if (statusLower === "delayed") {
      return {
        container: "bg-[#F45B690D] text-[#F45B69]",
        iconColor: "#F45B69",
      };
    }
    return {
      container: "bg-bgSecondary",
      iconColor: "#008080",
    };
  };

  const statusStyles = getStatusStyles(title);
  return (
    <div className="w-full border border-gray-300 rounded-xl shadow-sm bg-white">
      <div className="p-4">
        <div className="w-full flex flex-col items-center gap-3 lg:flex-row ">
          <div
            className={`${statusStyles.container} w-25 h-25 p-2 rounded-md flex items-center justify-center`}
          >
            {Icon && <Icon size={35} color={`${statusStyles.iconColor}`} />}
          </div>
          <h2 className="text-lg font-normal mb-2 text-wrap break-words text-clip md:text-wrap">
            {title}
          </h2>
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-3xl font-bold mb-4 text-wrap lg:text-nowrap mt-2">
            {value}
          </p>

          {percentage && (
            <p
              className={`text-3xl font-bold mb-4 text-wrap lg:text-nowrap mt-2 flex flex-row-reverse items-center gap-4 ${statusStyles.container} px-4 rounded-lg`}
            >
              <span className="font-normal text-lg">{percentage}</span>
              <svg
                width="9"
                height="8"
                viewBox="0 0 9 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
              >
                <path
                  d="M2.93227 7.84924L6.46812 7.84924C8.0117 7.84924 8.97345 6.17482 8.19568 4.8415L6.42775 1.81077C5.656 0.48776 3.74439 0.487759 2.97264 1.81077L1.20471 4.8415C0.426946 6.17481 1.38869 7.84924 2.93227 7.84924Z"
                  fill="currentColor"
                />
              </svg>
            </p>
          )}
        </div>
      </div>

      <div className="p-4 w-full flex flex-col gap-3 lg:flex-row justify-between items-center text-gray-500 text-sm font-normal border-t border-gray-300 pt-2 mt-2">
        <span>
          Updated: {lastUpdated === "Invalid Date" ? "Not Yet" : lastUpdated}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
