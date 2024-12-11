import { Briefcase, Users } from "lucide-react"; // Added Shield for policies
import StatCard from "../components/StatCard";
import { formatDateToReadableString } from "../lib/utils";
import { useDirectorates, usePrograms } from "../Queries";
import Programs from "./Programs";

function DirectoratePolicies() {
  const { directorates, isPending } = useDirectorates();
  const { program: programs, isPending: programLoading } = usePrograms();

  const totalDirectorates = Array.isArray(directorates)
    ? directorates.length
    : 0;
  const totalPrograms = Array.isArray(programs) ? programs.length : 0;

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (programLoading) return <div>Loading...</div>;
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
              value={totalPrograms}
              lastUpdated={formatDateToReadableString(programs[0]?.created_at)}
              icon={Briefcase}
            />
            <StatCard
              title="Total Directorates"
              value={totalDirectorates}
              lastUpdated={formatDateToReadableString(
                directorates[0]?.created_at
              )}
              icon={Users}
            />
          </div>
        </div>

        <Programs />
      </div>
    </div>
  );
}

export default DirectoratePolicies;
