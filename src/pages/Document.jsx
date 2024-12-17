import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  Tag,
  Mail,
  Phone,
  Briefcase,
} from "lucide-react";
import { useDocuments, usePrograms } from "../Queries";

function Document() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { documents, updateDocument } = useDocuments();
  const { program } = usePrograms();
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const doc = documents?.find((d) => d.id === parseInt(id));
    setDocument(doc);
  }, [id, documents]);

  const programMap = program?.reduce((acc, program) => {
    acc[program.id] = program.name;
    return acc;
  }, {});

  const handleStatusChange = async (newStatus) => {
    if (document) {
      try {
        await updateDocument(document.id, { doc_status: newStatus });
        setDocument({ ...document, doc_status: newStatus });
      } catch (error) {
        console.error("Failed to update document status:", error);
      }
    }
  };

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{document.name}</CardTitle>
          <Badge
            variant={
              document.status === "Implemented"
                ? "success"
                : document.status === "In-Progress"
                ? "default"
                : document.status === "Zero Draft"
                ? "warning"
                : "destructive"
            }
            className="text-sm"
          >
            {document.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Program:</span>
                <span>
                  {programMap[document.program_id] || "Unknown Program"}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Uploaded By:</span>
                <span>{document.uploaderName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Type:</span>
                <span>{document.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Pages:</span>
                <span>{document.page_count}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Publication Date:</span>
                <span>{document.publication_date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Document Status:</span>
                <span>{document.doc_status}</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Tags:</span>
                <span>{document.tags}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Uploader Email:</span>
                <span>{document.uploaderEmail}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Uploader Phone:</span>
                <span>{document.uploaderPhone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">Uploader Position:</span>
                <span>{document.uploaderPosition}</span>
              </div>
              {document.file && (
                <div className="flex items-center space-x-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">File:</span>
                  <a
                    href={document.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    View Document
                  </a>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <Separator className="my-6" />
        <CardFooter className="flex flex-col items-start space-y-4">
          <h2 className="text-xl font-semibold">Change Document Status</h2>
          <div className="space-x-4">
            <Button onClick={() => handleStatusChange("active")}>
              Mark as Active
            </Button>
            <Button onClick={() => handleStatusChange("completed")}>
              Mark as Completed
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Document;
