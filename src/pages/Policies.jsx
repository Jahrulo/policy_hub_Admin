/* eslint-disable no-unused-vars */
import { useState } from "react";
import { TabNavigation } from "../components/TabNavigation"


function Policies() {
  const [selectedTab, setSelectedTab] = useState("all-policies");

  // Tabs configuration with values and labels
  const tabs = [
    { value: "submitted-policies", label: "Submitted Policies" },
    { value: "all-policies", label: "All Policies" },
  ];
  return (
    <div className="space-y-8">
      <TabNavigation
        items={tabs}
        defaultValue={selectedTab}
        basePath="/dashboard/policies"
      />
    </div>
  );
}

export default Policies