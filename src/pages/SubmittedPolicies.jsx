/* eslint-disable no-unused-vars */
import { useState, useMemo } from "react";
import { TabNavigation } from "../components/TabNavigation";
import DataTable from "../components/DataTable";
import { Button } from "../components/ui/button";
import { Eye } from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "../components/ui/badge";
import { useDocuments, usePrograms } from "../Queries";

function SubmittedPolicies() {
  const [selectedTab, setSelectedTab] = useState("submitted-policies");
  const { documents } = useDocuments();
  const { program } = usePrograms();

  // Create a map of program IDs to program names
  const programMap = program?.reduce((acc, program) => {
    acc[program.id] = program.name;
    return acc;
  }, {});

  // Tabs configuration with values and labels
  const tabs = [
    { value: "all-policies", label: "All Policies" },
    { value: "submitted-policies", label: "Submitted Policies" },
  ];

  const columns = [
    { key: "name", label: "Title" },
    {
      key: "program_id",
      label: "Program",
      render: (program_id) => programMap[program_id] || "Unknown Program",
    },
    { key: "uploaderName", label: "Uploaded By" },
    { key: "type", label: "Type" },
    { key: "page_count", label: "Pages" },
    { key: "publication_date", label: "Publication Date" },
    { key: "doc_status", label: "Policy Status" },
    {
      key: "status",
      label: "Status",
      render: (status) => (
        <Badge
          variant={
            status === "Implemented"
              ? "success"
              : status === "In-Progress"
              ? "default"
              : status === "Zero Draft"
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

  const filteredDocuments = useMemo(() => {
    return documents?.filter((doc) => doc.doc_status === "pending") || [];
  }, [documents]);

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
          rows={filteredDocuments}
          columns={columns}
          searchKeys={["name", "type", "program_name", "uploader_name"]}
          caption="A LIST OF SUBMITTED POLICIES DOCUMENTS (PENDING)."
        />
      </div>
    </>
  );
}

export default SubmittedPolicies;
