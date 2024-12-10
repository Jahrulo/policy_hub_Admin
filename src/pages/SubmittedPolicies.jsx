/* eslint-disable no-unused-vars */
import { useState } from "react";
import { TabNavigation } from "../components/TabNavigation";
import DataTable from "../components/DataTable";
import { Button } from "../components/ui/button";
import { Eye } from "lucide-react";
import { toast } from "react-toastify";
import { Badge } from "../components/ui/badge";

const documents = [
  {
    id: "1",
    name: "National Health Strategy",
    type: "Strategy",
    publication_date: "2024-01-15",
    has_expiry: true,
    expiry_date: "2029-01-15",
    aligned_health_document_id: null,
    page_count: 120,
    status: "Implemented",
    tags: ["health", "national", "strategy"],
    program_id: "101",
    program_name: "National Health Program",
    uploader_id: "501",
    uploader_name: "John Doe",
  },
  {
    id: "2",
    name: "Maternal Health Operational Plan",
    type: "Operational Plan",
    publication_date: "2023-11-01",
    has_expiry: false,
    expiry_date: null,
    aligned_health_document_id: "1",
    page_count: 45,
    status: "In-Progress",
    tags: ["maternal", "health", "operations"],
    program_id: "102",
    program_name: "Maternal Health Program",
    uploader_id: "502",
    uploader_name: "Jane Smith",
  },
  {
    id: "3",
    name: "COVID-19 Response Roadmap",
    type: "Roadmap",
    publication_date: "2024-03-10",
    has_expiry: true,
    expiry_date: "2025-03-10",
    aligned_health_document_id: null,
    page_count: 30,
    status: "Zero Draft",
    tags: ["COVID-19", "response", "roadmap"],
    program_id: "103",
    program_name: "Emergency Response Program",
    uploader_id: "503",
    uploader_name: "Alice Johnson",
  },
  {
    id: "4",
    name: "Community Health Guidelines",
    type: "Guideline",
    publication_date: "2022-07-20",
    has_expiry: false,
    expiry_date: null,
    aligned_health_document_id: "1",
    page_count: 60,
    status: "Implemented",
    tags: ["community", "health", "guidelines"],
    program_id: "104",
    program_name: "Community Health Program",
    uploader_id: "504",
    uploader_name: "Bob Brown",
  },
  {
    id: "5",
    name: "Youth Health Operational Manual",
    type: "Operational Manual",
    publication_date: "2024-05-05",
    has_expiry: false,
    expiry_date: null,
    aligned_health_document_id: null,
    page_count: 80,
    status: "Not Started",
    tags: ["youth", "health", "manual"],
    program_id: "105",
    program_name: "Youth Health Program",
    uploader_id: "505",
    uploader_name: "Charlie Green",
  },
];

function SubmittedPolicies() {
  const [selectedTab, setSelectedTab] = useState("submitted-policies");

  // Tabs configuration with values and labels
  const tabs = [
    { value: "submitted-policies", label: "Submitted Policies" },
    { value: "all-policies", label: "All Policies" },
  ];

  const columns = [
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "publication_date", label: "Publication Date" },
    { key: "program_name", label: "Program Name" },
    { key: "uploader_name", label: "Uploaded By" },
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

  return (
    <div className="space-y-8">
      <TabNavigation
        items={tabs}
        defaultValue={selectedTab}
        basePath="/dashboard/policies"
      />

      {/* Data - Table and Search */}
      <div className="flex justify-between items-center">
        <DataTable
          rows={documents}
          columns={columns}
          searchKeys={["name", "type", "program_name", "uploader_name"]}
          caption="A list of submitted policy documents."
        />
     
      </div>
    </div>
  );
}

export default SubmittedPolicies;
