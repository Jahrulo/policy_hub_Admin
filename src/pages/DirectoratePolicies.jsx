import { useState } from "react";
import { Briefcase, Users, } from "lucide-react"; // Added Shield for policies
import StatCard from "../components/StatCard";
import { formatDateToReadableString } from "../lib/utils";
import Tile from "../components/Tile";

function DirectoratePolicies() {
  const [activeTab, setActiveTab] = useState("Program");
  const tabs = ["Program", "Directorates"];

  // Dummy data
  const programs = [
    { id: 1, name: "Program A", updated_at: "2024-11-20" },
    { id: 2, name: "Program B", updated_at: "2024-11-18" },
  ];
  const directorates = [
    { id: 1, name: "Directorate X", updated_at: "2024-11-15" },
    { id: 2, name: "Directorate Y", updated_at: "2024-11-13" },
  ];

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 flex flex-col gap-4 md:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4">
        <div className="flex flex-col space-y-4">
          <p className="text-sm font-normal">
            Manage Programs, Directorates, and Policies
          </p>
        </div>

        <div className="p-2 md:p-4">
          <div className="flex justify-evenly flex-col md:flex-row gap-4 mb-8">
            <StatCard
              title="Total Programs"
              value={programs.length}
              lastUpdated={formatDateToReadableString(programs[0]?.updated_at)}
              icon={Briefcase}
            />
            <StatCard
              title="Total Directorates"
              value={directorates.length}
              lastUpdated={formatDateToReadableString(
                directorates[0]?.updated_at
              )}
              icon={Users}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-start justify-start flex-col p-2 w-full">
          <nav className="overflow-x-auto">
            <ul className="flex flex-wrap items-center justify-center">
              {tabs.map((tab, index) => (
                <li key={index} className="mr-2">
                  <button
                    className={`px-3 py-2 text-sm rounded-md transition-colors text-nowrap font-normal ${
                      activeTab === tab
                        ? "bg-[#008080] text-white"
                        : "border border-[#A2A1A81A] text-[#008080]"
                    }`}
                    onClick={() => handleTabPress(tab)}
                  >
                    {tab}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-3 w-full">
            {activeTab !== "Staffs" && (
              <Tile
                activeTab={activeTab}
                key={activeTab}
                tileData={
                  activeTab === "Program"
                    ? programs
                    : activeTab === "Directorates"
                    ? directorates
                    : []
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectoratePolicies;
