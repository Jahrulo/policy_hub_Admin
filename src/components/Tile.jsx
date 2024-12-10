/* eslint-disable react/prop-types */
import  { useState } from "react";
import AddForm from "./AddForm";
import { formatDateToReadableString } from "../lib/utils";

const Tile = ({ tileData, activeTab }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="border rounded-lg p-4 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="h-[90px] w-full">
          <div
            onClick={() => setShowForm(true)}
            className="bg-white border border-[#A2A1A81A] rounded-md p-6 h-full w-full cursor-pointer hover:border-gray-300 transition-colors"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex-shrink-0">
                <img
                  src="/icons/StaffCross.svg"
                  className="w-10 h-10"
                  alt="Add new"
                />
              </div>

              <p className="text-sm text-[#A2A1A8] font-normal truncate flex-grow">
                Add new {activeTab}
              </p>
            </div>
          </div>
        </div>

        {/* Tile Cards */}
        {tileData.map((tile) => (
          <div key={tile.id} className="flex-grow">
            <TileCard
              title={tile.name}
              description={tile.description}
              imgSrc={
                activeTab === "Partner" ? JSON.parse(tile?.icon)?.url : ""
              }
              date={tile.created_at}
            />
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showForm && (
        <AddForm
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          activeTab={activeTab}
        />
      )}
    </div>
  );
};

export default Tile;

function TileCard({ title, description, imgSrc, date }) {
  return (
    <div className="bg-[#A2A1A80D] rounded-md p-4 flex flex-col h-full">
      <div className="flex items-center space-x-2 mb-2">
        <div className="bg-[#A2A1A80D] p-2 rounded-md">
          {imgSrc ? (
            <img src={imgSrc} alt="icon" className="w-7 h-7 object-cover" />
          ) : (
            <img
              src="/icons/hugeIcon.svg"
              alt="fallback icon"
              className="w-7 h-7"
            />
          )}
        </div>
        <h1 className="text-lg font-semibold text-[#333] truncate max-w-[85%]">
          {title}
        </h1>
      </div>
      <div className="flex-grow">
        <p className="text-sm break-words text-[#A2A1A8] font-normal text-clip">
          {description}
        </p>
      </div>
      <div className="text-sm text-[#A2A1A8] font-normal">
        {formatDateToReadableString(date)}
      </div>
    </div>
  );
}
