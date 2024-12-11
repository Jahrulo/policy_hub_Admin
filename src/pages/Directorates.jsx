/* eslint-disable no-unused-vars */
import { useState } from "react";
import Tile from "../components/Tile";
import { useDirectorates } from "../Queries";
import { TabNavigation } from "../components/TabNavigation";
import AddDirectorate from "../components/AddDirectorates";
import { toast } from "react-toastify";


function Directorate() {
  const { directorates, isPending } = useDirectorates();
  const [selectedTab, setSelectedTab] = useState("directorates");

  // Tabs configuration with values and labels
  const tabs = [
    { value: "programs", label: "Programs" },
    { value: "directorates", label: "Directorates" },
  ];

  if (isPending) {
    toast.success("Loading directorates...");
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="space-y-8">
        <TabNavigation
          items={tabs}
          defaultValue={selectedTab}
          basePath="/dashboard/program-directorates"
        />
        <AddDirectorate />
      </div>
      <div className="mt-3 w-full">
        <Tile
          activeTab={selectedTab}
          key={selectedTab}
          tileData={directorates}
        />
      </div>
    </>
  );
}

export default Directorate;
