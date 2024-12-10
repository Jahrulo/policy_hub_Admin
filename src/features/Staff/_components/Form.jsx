import React from "react";
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
import { useData } from "../../../hooks/useData";
import Loading from "../../../components/Loader";
import { supabase } from "../../../services/supabase";
import { toast } from "react-toastify";

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

  const [donorLink, setDonorLink] = useState("no");
  const { data, refresh } = useData();
  const { departments, partners, staffs } = data;

  useEffect(() => {
    setDialogOpen(isOpen);
  }, [isOpen]);

  const handleFileChange = async (event) => {
    setIsUploading(true);
    const file = event.target.files[0];
    if (file) {
      const { data, error: uploadError } = await supabase.storage
        .from("icons")
        .upload(`${file.name}`, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        setIsUploading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("icons")
        .getPublicUrl(data.path);

      setSelectedFileUrl(publicUrl.publicUrl);

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile({
          name: file.name,
          type: file.type,
          data: reader.result,
        });
      };
      reader.readAsDataURL(file);
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.target);
    const formValues = Object.fromEntries(formData.entries());

    if (selectedFileUrl) {
      formValues.icon = {
        name: selectedFile.name,
        type: selectedFile.type,
        data: selectedFile.data,
        url: selectedFileUrl,
      };
    }

    if (activeTab === "Staff") {
      formValues.donorLink = donorLink;

      try {
        const { user, error: authError } = await supabase.auth.signUp({
          email: formValues.email,
          password: "temporaryPassword123",
        });

        if (authError) {
          toast.error("Error creating staff user: " + authError.message);
          setIsSubmitting(false);
          return;
        }

        const { error: updateError } = await supabase.auth.updateUser({
          data: {
            role: staffRole,
          },
        });

        if (updateError) {
          toast.error(
            "Error updating staff user metadata: " + updateError.message
          );
          setIsSubmitting(false);
          return;
        }

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          formValues.email,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

        if (resetError) {
          toast.error(
            "Error sending password reset link: " + resetError.message
          );
          setIsSubmitting(false);
          return;
        }

        const { data, error: databaseError } = await supabase
          .from(`staffs`)
          .insert([formValues]);

        if (databaseError) {
          console.log("Database error: ", databaseError);
          toast.error("Something went wrong, try again");
          setIsSubmitting(false);
          return;
        }

        handleClose();
        event.target.reset();
        setSelectedFile(null);
        setDonorLink("no");
        toast.success("Staff added successfully");
        await refresh();
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsSubmitting(false);
      }
    } else {
      try {
        const table = activeTab.toLowerCase();
        const { data, error } = await supabase
          .from(`${table}s`)
          .insert([formValues]);

        if (error) {
          console.log("Error here: ", error);
          toast.error("Something went wrong, try again");
          setIsSubmitting(false);
          return;
        }

        handleClose();
        event.target.reset();
        setSelectedFile(null);
        setDonorLink("no");
        toast.success(`${activeTab} added successfully`);
      } catch (error) {
        console.error("Error submitting form:", error);
        setIsSubmitting(false);
      }
    }
  };

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
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {activeTab !== "Department" && (
              <div className="space-y-2">
                <Label htmlFor="department_id" className="text-sm font-medium">
                  Department
                </Label>
                <Select name="department_id" required>
                  <SelectTrigger id="department_id">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                className="h-10"
                placeholder="Enter name"
                name="name"
                type="text"
                required
              />
            </div>

            {activeTab !== "Department" && (
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
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
            )}

            {activeTab === "Staff" && (
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role
                </Label>
                <Select
                  name="role"
                  required
                  value={staffRole}
                  onValueChange={(value) => handleStaffRoleChange(value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select Staff Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={"secretary"}>Secretary</SelectItem>
                    <SelectItem value={"admin"}>Admin</SelectItem>
                    <SelectItem value={"team_lead"}>Team Lead</SelectItem>
                    <SelectItem value={"other"}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {activeTab === "Staff" && (
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  className="h-10"
                  placeholder="23274400001"
                  name="phone"
                  type="text"
                  required
                />
              </div>
            )}

            {activeTab === "Department" && (
              <div className="space-y-2">
                <Label
                  htmlFor="correspondence_duration"
                  className="text-sm font-medium"
                >
                  Enter Correspondence Duration(days)
                </Label>
                <Input
                  id="correspondence_duration"
                  className="h-10"
                  placeholder="Enter Correspondence Duration"
                  name="correspondence_duration"
                  type="number"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                className="h-24 resize-none"
                placeholder="Enter a detailed description"
                name="description"
                required
              />
            </div>

            {activeTab === "Partner" && (
              <>
                <div className="rounded-lg border border-dashed border-gray-300 p-4 hover:border-teal-500 transition-colors">
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    {!isUploading ? (
                      <div className="flex flex-col items-center justify-center gap-2 text-center">
                        {selectedFile && (
                          <div className="w-full max-w-[200px] mx-auto mb-3">
                            <img
                              src={selectedFile.data}
                              alt="Preview"
                              className="object-contain max-h-[120px] rounded-md shadow"
                            />
                          </div>
                        )}
                        <UploadCloud className="h-8 w-8 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {selectedFile
                            ? selectedFile.name
                            : "Upload Company Logo"}
                        </span>
                        <span className="text-xs text-gray-400">
                          Click or drag and drop company Logo
                        </span>
                      </div>
                    ) : (
                      <Loading size={50} />
                    )}
                    <Input
                      id="file-upload"
                      type="file"
                      name="icon"
                      className="hidden"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Date
                  </Label>
                  <Input
                    type="date"
                    id="date"
                    name="date"
                    required
                    className="h-10"
                  />
                </div>
              </>
            )}

            {activeTab === "Staff" && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Add Donor Link</Label>
                <RadioGroup
                  defaultValue="no"
                  className="flex gap-4"
                  value={donorLink}
                  onValueChange={setDonorLink}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no">No</Label>
                  </div>
                </RadioGroup>

                {donorLink === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="partner_id" className="text-sm font-medium">
                      Select Donor
                    </Label>
                    <Select name="partner_id" required>
                      <SelectTrigger id="partner_id">
                        <SelectValue placeholder="Select Donor" />
                      </SelectTrigger>
                      <SelectContent>
                        {partners.map((partner) => (
                          <SelectItem key={partner.id} value={partner.id}>
                            {partner.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
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
