/* eslint-disable react/prop-types */
import {  useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

function SideBar({ icon: Icon, label, href, imgSrc }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isActive =
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  const onClick = () => {
    navigate(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "rounded-r-lg flex items-center justify-center lg:justify-normal px-2 text-gray-700 text-sm font-[500] transition-all hover:bg-[#7aacac0d] hover:w-full",
        isActive &&
          "border-l-4 border-bgPrimary text-bgPrimary bg-[#0080800D] w-full"
      )}
    >
      <div className="flex items-center gap-x-1 py-4">
        <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
          {Icon ? (
            <Icon
              size={30}
              className={cn("text-black", isActive && "text-bgPrimary")}
            />
          ) : (
            <img
              src={imgSrc}
              width={28}
              height={28}
              alt={imgSrc}
              className={`${isActive && "text-bgPrimary"}`}
            />
          )}
        </div>
        <p className="hidden lg:block text-left font-Mons font-semibold text-md px-2 break-words">
          {label}
        </p>
      </div>
    </button>
  );
}

export default SideBar;
