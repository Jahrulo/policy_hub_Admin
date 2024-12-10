import { useState } from "react";
import { Briefcase, Users } from "lucide-react";
import StatCard from "../../components/StatCard";
import StaffTile from "./_components/StaffTile";
import StaffTable from "./_components/StaffTable";
import { formatDateToReadableString } from "../../lib/utils";

function StaffManagement() {
  const [activeTab, setActiveTab] = useState("Program");
  const tabs = ["Program", "Directorates", "Staffs"];

  // Dummy data
  const programs = [
    { id: 1, name: "Program A", updated_at: "2024-11-20" },
    { id: 2, name: "Program B", updated_at: "2024-11-18" },
  ];
  const directorates = [
    { id: 1, name: "Directorate X", updated_at: "2024-11-15" },
    { id: 2, name: "Directorate Y", updated_at: "2024-11-13" },
  ];
  const staffs = [
    {
      id: 1,
      name: "Staff 1",
      role: "Manager",
      phone: "123-456-7890",
      email: "staff1@example.com",
      directorate: "Directorate X",
      updated_at: "2024-11-10",
    },
    {
      id: 2,
      name: "Staff 2",
      role: "Assistant",
      phone: "987-654-3210",
      email: "staff2@example.com",
      directorate: "Directorate Y",
      updated_at: "2024-11-12",
    },
    {
      id: 3,
      name: "Staff 3",
      role: "Engineer",
      phone: "555-555-5555",
      email: "staff3@example.com",
      directorate: "Directorate X",
      updated_at: "2024-11-15",
    },
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
            Manage Programs, Directorates, and Staffs
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
            <StatCard
              title="Total Staffs"
              value={staffs.length}
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
              <StaffTile
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

        {activeTab === "Staffs" && (
          <div className="border rounded-lg p-4 flex flex-col md:flex-row flex-wrap gap-5 w-full">
            <StaffTable data={staffs} />
          </div>
        )}
      </div>
    </div>
  );
}

export default StaffManagement;
