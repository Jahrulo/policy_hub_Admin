/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { TabNavigation } from "../components/TabNavigation";
import { toast } from "react-toastify";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import DataTable from "../components/DataTable";
import { Eye } from "lucide-react";
import { useDocuments, usePrograms } from "../Queries";

function Policies() {
  const [selectedTab, setSelectedTab] = useState("all-policies");
  const { documents } = useDocuments();

  console.log(documents);

  // Tabs configuration with values and labels
  const tabs = [
    { value: "all-policies", label: "All Policies" },
    { value: "submitted-policies", label: "Submitted Policies" },
  ];

  const columns = [
    { key: "name", label: "Title" },
    { key: "program_id", label: "Program" },
    { key: "uploaderName", label: "Uploaded By" },
    { key: "type", label: "Type" },
    { key: "page_count", label: "Pages" },
    { key: "publication_date", label: "Publication Date" },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <Badge
          variant={
            status === "Completed"
              ? "success"
              : status === "In-Progress"
              ? "default"
              : status === "NotStarted"
              ? "warning"
              : "destructive"
          }
        >
          {status}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <Button
          size="sm"
          onClick={() => toast.success(`Viewing details for ${row.name}`)}
        >
          <Eye />
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-8">
        <TabNavigation
          items={tabs}
          defaultValue={selectedTab}
          basePath="/dashboard/policies"
        />
      </div>
      <div className="flex justify-between items-center">
        <DataTable
          rows={documents}
          columns={columns}
          searchKeys={["name", "type", "program_name", "uploader_name"]}
          caption="A LIST OF ALL POLICIES DOCUMENTS."
        />
      </div>
    </>
  );
}

export default Policies;
