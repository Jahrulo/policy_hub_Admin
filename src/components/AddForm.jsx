/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
// import { useData } from "../../../hooks/useData";
import Loading from "../components/Loader";
// import { supabase } from "../../../services/supabase";
// import { toast } from "react-toastify";

const AddForm = ({ activeTab, isOpen = true, onClose }) => {
  const [dialogOpen, setDialogOpen] = useState(isOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  const [staffRole, setStaffRole] = useState("Other");

  const handleStaffRoleChange = (value) => {
    setStaffRole(value);
  };

  const directorates = [
    { id: 1, name: "Directorate X", updated_at: "2024-11-15" },
    { id: 2, name: "Directorate Y", updated_at: "2024-11-13" },
  ];

//   const [donorLink, setDonorLink] = useState("no");
//   const { data, refresh } = useData();
//   const { departments, partners, staffs } = data;

  useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);

//   const handleFileChange = async (event) => {
//     setIsUploading(true);
//     const file = event.target.files[0];
//     if (file) {
//       const { data, error: uploadError } = await supabase.storage
//         .from("icons")
//         .upload(`${file.name}`, file);

//       if (uploadError) {
//         console.error("Error uploading file:", uploadError);
//         setIsUploading(false);
//         return;
//       }

//       const { data: publicUrl } = supabase.storage
//         .from("icons")
//         .getPublicUrl(data.path);

//       setSelectedFileUrl(publicUrl.publicUrl);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setSelectedFile({
//           name: file.name,
//           type: file.type,
//           data: reader.result,
//         });
//       };
//       reader.readAsDataURL(file);
//       setIsUploading(false);
//     }
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsSubmitting(true);

//     const formData = new FormData(event.target);
//     const formValues = Object.fromEntries(formData.entries());

//     if (selectedFileUrl) {
//       formValues.icon = {
//         name: selectedFile.name,
//         type: selectedFile.type,
//         data: selectedFile.data,
//         url: selectedFileUrl,
//       };
//     }

//     if (activeTab === "Staff") {
//       formValues.donorLink = donorLink;

//       try {
//         const { user, error: authError } = await supabase.auth.signUp({
//           email: formValues.email,
//           password: "temporaryPassword123",
//         });

//         if (authError) {
//           toast.error("Error creating staff user: " + authError.message);
//           setIsSubmitting(false);
//           return;
//         }

//         const { error: updateError } = await supabase.auth.updateUser({
//           data: {
//             role: staffRole,
//           },
//         });

//         if (updateError) {
//           toast.error(
//             "Error updating staff user metadata: " + updateError.message
//           );
//           setIsSubmitting(false);
//           return;
//         }

//         const { error: resetError } = await supabase.auth.resetPasswordForEmail(
//           formValues.email,
//           {
//             redirectTo: `${window.location.origin}/reset-password`,
//           }
//         );

//         if (resetError) {
//           toast.error(
//             "Error sending password reset link: " + resetError.message
//           );
//           setIsSubmitting(false);
//           return;
//         }

//         const { data, error: databaseError } = await supabase
//           .from(`staffs`)
//           .insert([formValues]);

//         if (databaseError) {
//           console.log("Database error: ", databaseError);
//           toast.error("Something went wrong, try again");
//           setIsSubmitting(false);
//           return;
//         }

//         handleClose();
//         event.target.reset();
//         setSelectedFile(null);
//         setDonorLink("no");
//         toast.success("Staff added successfully");
//         await refresh();
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         setIsSubmitting(false);
//       }
//     } else {
//       try {
//         const table = activeTab.toLowerCase();
//         const { data, error } = await supabase
//           .from(`${table}s`)
//           .insert([formValues]);

//         if (error) {
//           console.log("Error here: ", error);
//           toast.error("Something went wrong, try again");
//           setIsSubmitting(false);
//           return;
//         }

//         handleClose();
//         event.target.reset();
//         setSelectedFile(null);
//         setDonorLink("no");
//         toast.success(`${activeTab} added successfully`);
//       } catch (error) {
//         console.error("Error submitting form:", error);
//         setIsSubmitting(false);
//       }
//     }
//   };

  const handleClose = () => {
    setDialogOpen(false);
    if (onClose) onClose();
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleClose} className="mb-2">
      <DialogContent className="max-h-[90vh] w-[90vw] max-w-[500px] p-0">
        <DialogHeader className="p-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Add new {activeTab}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[calc(90vh-8rem)]">
          <form onSubmit={() => {}} className="p-4 space-y-4">
            {activeTab === "Program" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="h-10"
                    placeholder="Enter program name"
                    name="name"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="directorate_id"
                    className="text-sm font-medium"
                  >
                    Directorate
                  </Label>
                  <Select name="directorate_id" required>
                    <SelectTrigger id="directorate_id">
                      <SelectValue placeholder="Select Directorate" />
                    </SelectTrigger>
                    <SelectContent>
                      {directorates.map((directorate) => (
                        <SelectItem key={directorate.id} value={directorate.id}>
                          {directorate.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {activeTab === "Directorates" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="h-10"
                    placeholder="Enter directorate name"
                    name="name"
                    type="text"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="h-10"
                    placeholder="Enter email"
                    name="email"
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    className="h-10"
                    placeholder="Enter phone number"
                    name="phone"
                    type="tel"
                    required
                  />
                </div>
              </>
            )}

            <div className="border-t p-4 bg-white mb-2">
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="px-4 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 px-4 w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loading size={30} /> : `Add ${activeTab}`}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddForm;
