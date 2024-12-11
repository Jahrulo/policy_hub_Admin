/* eslint-disable no-unused-vars */
import { useState } from "react";
import { TabNavigation } from "../components/TabNavigation";
import Tile from "../components/Tile";
import { usePrograms } from "../Queries";
import AddProgram from "../components/AddProgram";
import { toast } from "react-toastify";

function Programs() {
  const { program: programs, isPending} = usePrograms();
  const [selectedTab, setSelectedTab] = useState("programs");

  // Tabs configuration with values and labels
  const tabs = [
    { value: "programs", label: "Programs" },
    { value: "directorates", label: "Directorates" },
  ];

  if (isPending) {
    toast.success("Loading programs...");
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
        <AddProgram />
      </div>
      <div className="mt-3 w-full">
        <Tile activeTab={selectedTab} key={selectedTab} tileData={programs} />
      </div>
    </>
  );
}

export default Programs;
