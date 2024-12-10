import { CheckCircle2, Clock, AlertTriangle, Ellipsis } from "lucide-react";
import StatCard from "../../components/StatCard";
import { useData } from "../../hooks/useData";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

function Stats() {
  const { data } = useData();
  const { correspondences } = data;

  const totalCorrespondences = correspondences.length;

  const completedCount = correspondences.filter(
    (correspondence) => correspondence.is_ended === true
  ).length;

  const pendingCount = correspondences.filter(
    (correspondence) => correspondence.status.toLowerCase() === "pending"
  ).length;

  const ongoingCount = correspondences.filter(
    (correspondence) => correspondence.category.toLowerCase() === "in progress"
  ).length;

  const delayedCount = correspondences.filter(
    (correspondence) => correspondence.category.toLowerCase() === "delayed"
  ).length;

  const stats = [
    {
      title: "Completed",
      value: completedCount,
      percentage:
        ((completedCount / totalCorrespondences) * 100).toFixed(2) + "%",
      lastUpdated: formatDate(
        correspondences.find(
          (correspondence) =>
            correspondence.category.toLowerCase() === "completed"
        )?.created_at
      ),
      icon: CheckCircle2,
    },
    {
      title: "Pending",
      value: pendingCount,
      percentage:
        ((pendingCount / totalCorrespondences) * 100).toFixed(2) + "%",
      lastUpdated: formatDate(
        correspondences.find(
          (correspondence) =>
            correspondence.category.toLowerCase() === "pending"
        )?.created_at
      ),
      icon: Ellipsis,
    },
    {
      title: "Ongoing",
      value: ongoingCount,
      percentage:
        ((ongoingCount / totalCorrespondences) * 100).toFixed(2) + "%",
      lastUpdated: formatDate(
        correspondences.find(
          (correspondence) =>
            correspondence.category.toLowerCase() === "in progress"
        )?.created_at
      ),
      icon: Clock,
    },
    {
      title: "Delayed",
      value: delayedCount,
      percentage:
        ((delayedCount / totalCorrespondences) * 100).toFixed(2) + "%",
      lastUpdated: formatDate(
        correspondences.find(
          (correspondence) =>
            correspondence.category.toLowerCase() === "delayed"
        )?.created_at
      ),
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="flex justify-evenly flex-col md:flex-row gap-4 mb-8">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}

export default Stats;
