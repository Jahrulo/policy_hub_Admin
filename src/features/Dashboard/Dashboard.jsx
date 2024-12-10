import { Briefcase, Users } from "lucide-react";
import StatCard from "../../components/StatCard";
import { formatDateToReadableString } from "../../lib/utils";
// import Loading from "../../components/Loader";

const DashboardPage = () => {
  // Dummy Data
  const staffs = [
    { id: 1, name: "John Doe", updated_at: "2024-11-20T10:15:30Z" },
    { id: 2, name: "Jane Smith", updated_at: "2024-11-19T14:22:10Z" },
    { id: 3, name: "Emily Johnson", updated_at: "2024-11-18T16:42:05Z" },
  ];

  const directorates = [
    { id: 1, name: "Directorate X", updated_at: "2024-11-19T11:00:00Z" },
    { id: 2, name: "Directorate Y", updated_at: "2024-11-18T09:45:00Z" },
  ];

  const programs = [
    { id: 1, name: "Program A", updated_at: "2024-11-19T13:20:00Z" },
    { id: 2, name: "Program B", updated_at: "2024-11-18T15:35:00Z" },
  ];

  // Calculations
  const totalStaff = staffs.length;

  // const pending = correspondences.filter(
  //   (correspondence) => correspondence.category?.toLowerCase() === "pending"
  // ).length;
  const totalDirectorates = directorates.length;
  const totalPrograms = programs.length;

  return (
    <div className="p-4 flex flex-col gap-4 md:flex-row">
      <div className="w-full flex flex-col gap-4">
        <div className="p-2 md:p-4">
          <div className="flex justify-evenly flex-col md:flex-row gap-4 mb-8">
            {/* Stat Cards */}
            <StatCard
              title="Total Staff"
              value={totalStaff}
              lastUpdated={formatDateToReadableString(staffs[0]?.updated_at)}
              icon={Users}
            />

            {/* <StatCard
              title="Total Pending"
              value={pending}
              lastUpdated={formatDateToReadableString(
                correspondences[0]?.updated_at
              )}
              icon={Loader}
            /> */}
            <StatCard
              title="Total Directorates"
              value={totalDirectorates}
              lastUpdated={formatDateToReadableString(
                directorates[0]?.updated_at
              )}
              icon={Briefcase}
            />
            <StatCard
              title="Total Programs"
              value={totalPrograms}
              lastUpdated={formatDateToReadableString(programs[0]?.updated_at)}
              icon={Briefcase}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
