import { File, Shield, Users } from "lucide-react";
import StatCard from '../components/StatCard';
import { formatDateToReadableString } from "../lib/utils";

 // Dummy data
  const programs = [
    { id: 1, name: "Program A", updated_at: "2024-11-20" },
    { id: 2, name: "Program B", updated_at: "2024-11-18" },
  ];
  const directorates = [
    { id: 1, name: "Directorate X", updated_at: "2024-11-15" },
    { id: 2, name: "Directorate Y", updated_at: "2024-11-13" },
  ];
  const policies = [
    { id: 1, name: "Policy A", updated_at: "2024-11-22" },
    { id: 2, name: "Policy B", updated_at: "2024-11-19" },
  ];

export default function Home() {
  return (
    <div className="p-2 md:p-4">
      <div className="flex justify-evenly flex-col md:flex-row gap-4 mb-8">
        <StatCard
          title="Total Programs"
          value={programs.length}
          lastUpdated={formatDateToReadableString(programs[0]?.updated_at)}
          icon={File}
        />
        <StatCard
          title="Total Directorates"
          value={directorates.length}
          lastUpdated={formatDateToReadableString(directorates[0]?.updated_at)}
          icon={Users}
        />
        <StatCard
          title="Total Policies"
          value={policies.length}
          lastUpdated={formatDateToReadableString(policies[0]?.updated_at)}
          icon={Shield} // Using Shield icon for policies
        />
      </div>
    </div>
  );
}
