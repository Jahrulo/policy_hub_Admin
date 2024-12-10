/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { UploadCloud, File, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useData } from "@/hooks/useData";
import Loading from "@/components/Loader";
import { supabase } from "@/services/supabase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { SendMessage } from "../../services/sendSms";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const AddCorresp = ({ isOpen = true, onClose }) => {
  const [dialogOpen, setDialogOpen] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const navigate = useNavigate();
  const { data } = useData();
  const { departments, partners, staffs } = data;
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserData(data.session.user);
      }
    };
    getUserData();
  }, []);

  useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const StaffData = userData
    ? staffs.filter((staff) => staff.email === userData.email)
    : [];
  const partnerName = StaffData[0]?.partner_id
    ? partners.find((partner) => partner.id === StaffData[0].partner_id)
    : null;

  const getFileIcon = () => {
    if (!selectedFile) return null;
    return (
      <div className="w-full h-[calc(95vh-80px)] mt-4 overflow-auto">
        <DocViewer
          documents={[
            {
              uri: selectedFileUrl,
              fileType: selectedFile.type,
            },
          ]}
          pluginRenderers={DocViewerRenderers}
          className="doc-viewer-container"
          config={{
            header: {
              disableHeader: false,
              disableFileName: false,
            },
          }}
        />
      </div>
    );
  };

  const handleFileChange = async (event) => {
    setIsUploading(true);
    const file = event.target.files[0];

    if (file) {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }

      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      try {
        const fileName = `${Date.now()}-${file.name}`;
        const { data, error: uploadError } = await supabase.storage
          .from("correspondence_files")
          .upload(fileName, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrl } = supabase.storage
          .from("correspondence_files")
          .getPublicUrl(fileName);

        setSelectedFile(file);
        setSelectedFileUrl(publicUrl.publicUrl);
      } catch (error) {
        console.error("Error uploading file:", error);
        toast.error("Failed to upload file. Please try again.");
      }
    }
    setIsUploading(false);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSelectedFileUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(event.target);
      const formValues = Object.fromEntries(formData.entries());

      if (!StaffData[0]) {
        throw new Error("Correspondence data not found");
      }

      formValues.partner_id = StaffData[0].partner_id;
      formValues.creator_id = StaffData[0].id;
      formValues.donor = partnerName?.name;
      formValues.file = selectedFileUrl;
      formValues.category = "PENDING";
      formValues.status = "Pending";

      const { error, data: corres } = await supabase
        .from("correspondences")
        .insert([formValues])
        .select("id, title, sender, priority")
        .single();

      if (error) throw error;

      toast.success(`Correspondence added successfully`);

      handleClose();
      event.target.reset();
      handleRemoveFile();

      const numbers = staffs
        .filter((staff) => staff.partner_id === StaffData[0].partner_id)
        .map((staff) => staff.phone);

      const staffIds = staffs
        .filter((staff) => staff.partner_id === StaffData[0].partner_id)
        .map((staff) => staff.id);

      const link = `${
        import.meta.env.VITE_PUBLIC_URL
      }/correspondences/details/${corres?.id}`;
      const message = `
Hello ${userData?.email.split("@gmail.com").join().replace(",", "")},
You have a new correspondence titled ${corres?.title} from ${
        corres?.sender
      } with ${corres?.priority} priority.
View details here: ${link}
`;
      for (const phone of numbers) {
        await SendMessage({
          number: phone,
          messageToSend: message,
        });
      }

      await supabase.from("notifications").insert([
        {
          title: corres?.title,
          summary_message: message,
          staffs: staffIds,
          link,
          status: "unread",
          sent_by: userData?.email,
        },
      ]);

      navigate(`/dashboard/correspondences/details/${corres?.id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(error.message || "Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setDialogOpen(false);
    handleRemoveFile();
    if (onClose) onClose();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] w-full min-h-[95vh] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Add new Policy
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row w-full h-[calc(95vh-80px)] mt-4 overflow-auto">
          {/* Left Side: Form Details */}
          <div className="w-full sm:w-1/2 p-4 border-r">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Enter Title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Directorates</Label>
                <Select name="priority" required>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select Director" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Director X">Director X</SelectItem>
                    <SelectItem value="Director Y">Director Y</SelectItem>
                    <SelectItem value="Director Z">Director Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="space-y-2">
                  <Select name="currency" required>
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SLE">SLE</SelectItem>
                      <SelectItem value="$">USD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Input
                  id="amount"
                  name="amount"
                  type="number"
                  required
                  placeholder="Enter Amount"
                />
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" required />
              </div>

              {/* <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select name="priority" required>
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="LOW">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div> */}

              <div className="border-t p-4 bg-white">
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loading size={30} /> : "Add Policy"}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Side: File Preview and Management */}
          <div className="w-full sm:w-1/2 p-4">
            <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:border-teal-500 transition-colors relative">
              {selectedFile ? (
                <div className="flex flex-col items-center">
                  {getFileIcon()}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <label htmlFor="file-upload" className="cursor-pointer block">
                  {isUploading ? (
                    <Loading size={50} />
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-2 text-center">
                      <UploadCloud className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Upload File</span>
                      <span className="text-xs text-gray-400">
                        Click or drag and drop
                      </span>
                    </div>
                  )}
                  <Input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="*/*"
                  />
                </label>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCorresp;
