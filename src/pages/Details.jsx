/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useMemo, useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  FileIcon,
  Loader,
  Plus,
  UploadCloud,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Loading from "@/components/Loader";
import { Link, useParams } from "react-router-dom";
import { useData } from "../hooks/useData";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { AddResponse } from "../services/apiCorresp";
import { toast } from "react-toastify";
import { supabase } from "../services/supabase";
import { SendMessage } from "../services/sendSms";

function formatDateTime(isoString) {
  if (!isoString) return "Invalid date";
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return "Invalid date";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

function currencyFormat(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "SLE",
  }).format(amount);
}

export default function Details() {
  const { id } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const { data, loading, error, refresh } = useData();
  const [downloading, setIsDownloading] = useState(false);
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [userData, setUserData] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [showResponseFileViewer, setShowResponseFileViewer] = useState(false);
  const [selectedResponseFile, setSelectedResponseFile] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  useEffect(() => {
    const getUserData = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session?.user) {
        setUserData(data.session.user);
      }
    };
    getUserData();
  }, []);

  const { staffs, partners, departments } = data;
  const correspondence = data?.correspondences?.find(
    (corresp) => corresp.id === id
  );

  const filteredResponses = data?.responses?.filter(
    (res) => res.correspondence_id === id
  );

  const { responses } = data;

  const sortedResponses = [...filteredResponses].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const StaffData = userData
    ? staffs.filter((staff) => staff.email === userData.email)
    : [];

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
    const file = event.target.files[0];
    if (file) {
      const { data, error: uploadError } = await supabase.storage
        .from("icons") // To the correspondence bucket not the icons
        .upload(`${file.name}`, file);

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
        setIsUploading(false);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("icons") // From the correspondence bucket not the icons
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setSelectedFileUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };
  async function onSubmit(formData) {
    setIsSubmitting(true);

    const newResponse = {
      feedback: formData.feedback,
      file: formData.file[0], // Handle single file input
      sent_to: formData.recipient,
      correspondence_id: id,
      is_ended: formData.isEnded === "yes",
    };

    try {
      // Submit the response data using the refactored AddResponse function
      const responseData = await AddResponse(newResponse);

      // Filter staffs belonging to the same partner as the correspondence
      const staffsWithSamePartners = staffs.filter(
        (staff) => staff.partner_id === correspondence.partner_id
      );

      // Find the department ID based on the selected recipient
      const selectedDepartment = data?.departments.find(
        (department) => department.name === formData.recipient
      )?.id;

      // Get phone numbers of staffs in the selected department
      const numbers = staffsWithSamePartners
        .filter((staff) => staff.department_id === selectedDepartment)
        .map((staff) => staff.phone);

      // Prepare the message with response feedback and details link
      const link = `${
        import.meta.env.VITE_PUBLIC_URL
      }/correspondences/details/${correspondence.id}`;
      const message = `
        Hello ${userData?.email.split("@gmail.com").join("").replace(",", "")},
        You have a new response feedback: ${formData.feedback}
        View details here: ${link}
      `;

      const staffIds = staffsWithSamePartners
        .filter((staff) => staff.department_id === selectedDepartment)
        .map((staff) => staff.id);

      // Parallelize message sending for efficiency
      const messagePromises = numbers.map((phone) =>
        SendMessage({
          number: phone,
          messageToSend: message,
        })
      );

      // Send Notifications
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

      // Await response creation and message sending concurrently
      await Promise.all([responsePromise, ...messagePromises]);

      reset();
      setIsOpen(false);

      // Optionally reload the page to refresh the data
      window.location.reload();
    } catch (err) {
      // Log and handle any errors during the process
      console.error("Error adding response:", err);
    } finally {
      // Ensure the submitting state is reset
      setIsSubmitting(false);

      await refresh();
    }
  }

  // const handleReminderSubmit = async (e) => {
  //   e.preventDefault(); // Prevent default form submission

  //   if (!id) {
  //     alert("Please select a department.");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     // Filter staffs belonging to the same partner as the correspondence
  //     const staffsWithSamePartners = staffs.filter(
  //       (staff) => staff.partner_id === correspondence.partner_id
  //     );

  //     // Get phone numbers of staffs in the selected department
  //     const numbers = staffsWithSamePartners
  //       .filter((staff) => staff.department_id === id)
  //       .map((staff) => staff.phone);

  //       console.log(numbers)

  //     //   .filter((staff) => staff.department_id === correspondence.id)
  //     //   .map((staff) => staff.phone);

  //     // const numbers = staffsWithSamePartners
  //     //   .filter((staff) => staff.partner_id === correspondence.partner_id) // Filter staff by partner_id
  //     //   .map((staff) => staff.phone); // Map the filtered staff to their phone numbers

  //     // console.log(numbers);

  //     // // Prepare the message
  //     // const link = `${
  //     //   import.meta.env.VITE_PUBLIC_URL
  //     // }/correspondences/details/${correspondence.id}`;
  //     // const message = `
  //     //   Hello, this is a reminder regarding correspondence "${correspondence.title}".
  //     //   Please check the details here: ${link}
  //     // `;

  //     // const staffIds = staffsWithSamePartners
  //     //   .filter((staff) => staff.department_id === selectedDepartment)
  //     //   .map((staff) => staff.id);

  //     // // Send messages
  //     // const messagePromises = numbers.map((phone) =>
  //     //   SendMessage({
  //     //     number: phone,
  //     //     messageToSend: message,
  //     //   })
  //     // );

  //     // // Await all message promises
  //     // await Promise.all(messagePromises);

  //     toast.success("Reminder sent successfully!");
  //   } catch (err) {
  //     console.error("Error sending reminder:", err);
  //     toast.error("Failed to send reminder. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleReminderSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    if (!id) {
      alert("Please select a department.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Assuming `correspondence.id` is available from your route params
      const correspondenceId = correspondence.id;
      console.log(correspondenceId);

      // Find the response for the given correspondence ID (assuming it's already available in `responses`)
      const response = responses.find(
        (resp) => resp.correspondence_id === correspondenceId
      );

      if (!response) {
        alert("No response found for this correspondence.");
        setIsSubmitting(false);
        return;
      }

      // Get the `sent_to` department from the response
      const sentToDepartment = response.sent_to;
      console.log(`Correspondence sent to department: ${sentToDepartment}`);

      // Filter staffs belonging to the same partner as the correspondence
      const staffsWithSamePartners = staffs.filter(
        (staff) => staff.partner_id === correspondence.partner_id
      );

      // Find the department ID based on the selected recipient
      const selectedDepartment = data?.departments.find(
        (department) => department.name === sentToDepartment
      )?.id;

      console.log(selectedDepartment);

      // Get phone numbers of staffs in the selected department
      const numbers = staffsWithSamePartners
        .filter((staff) => staff.department_id === selectedDepartment)
        .map((staff) => staff.phone);

      console.log(numbers);

      // Prepare the message
      const link = `${
        import.meta.env.VITE_PUBLIC_URL
      }/correspondences/details/${correspondence.id}`;
      const message = `
        Hello, this is a reminder regarding correspondence "${correspondence.title}".
        Please check the details here: ${link}
      `;

      const staffIds = staffsWithSamePartners
        .filter((staff) => staff.department_id === selectedDepartment)
        .map((staff) => staff.id);

      // Send messages
      const messagePromises = numbers.map((phone) =>
        SendMessage({
          number: phone,
          messageToSend: message,
        })
      );

      // Await all message promises
      await Promise.all(messagePromises);

      toast.success("Reminder sent successfully!");
    } catch (err) {
      console.error("Error sending reminder:", err);
      toast.error("Failed to send reminder. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (correspondence?.file) {
        const response = await fetch(correspondence.file);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `correspondence-${correspondence.id}${getFileExtension(
          correspondence.file
        )}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Download completed successfully");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
      setShowFileDialog(false);
    }
  };

  // download response file from responses
  const handleDownloadResponseFile = async (response) => {
    setIsDownloading(true);
    try {
      if (response?.responseFile) {
        const fetchResponse = await fetch(response.responseFile);
        const blob = await fetchResponse.blob();
        const url = window.URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `response-${response.id}${getFileExtension(
          response.responseFile
        )}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toast.success("Download completed successfully");
      } else {
        toast.error("No file available for download");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download response file");
    } finally {
      setIsDownloading(false);
    }
  };

  // Helper function to get the file extension based on the file URL
  const getFileExtension = (filename) => {
    if (!filename) return "";
    const parts = filename.split(".");
    return parts.length > 1 ? `.${parts.pop()}` : "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loading size={40} />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          An unexpected error occurred. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  const docs = [
    {
      uri: correspondence?.file || responses.file,
    },
  ];

  const handleOpenResponseFile = (responseFile) => {
    if (responseFile) {
      setSelectedResponseFile([{ uri: responseFile }]);
      setShowResponseFileViewer(true);
    } else {
      toast.error("No file available to view");
    }
  };
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-2 items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-600">
            Correspondence Details
          </h1>
          <div className="flex flex-row gap-2">
            <Badge
              variant="outline"
              className="border-rose-200 text-[#F45B69] hover:bg-[#F45B690D] rounded-md"
            >
              <div className="flex items-center gap-1 justify-center p-1 ">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F45B69]" />
                Delayed
              </div>
            </Badge>
            {/* <Badge
              variant="outline"
              className="border-bgPrimary text-textGreen hover:bg-emerald-50 rounded-md"
            >
              <div className="flex items-center gap-1 justify-center p-1">
                <div className="w-1.5 h-1.5 rounded-full bg-bgPrimary" />
                Completed
              </div>
            </Badge> */}
            <Badge
              variant="outline"
              className="border-rose-200 text-[#F45B69] hover:bg-[#F45B690D] rounded-md"
            >
              <div className="flex items-center gap-1 justify-center p-1 ">
                <div className="w-1.5 h-1.5 rounded-full bg-[#F45B69]" />
                High Priority
              </div>
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <>
            <Card className="border rounded-lg border-gray-600">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-1">Title</div>
                <div className="text-lg font-semibold">
                  {correspondence.title}
                </div>
              </CardContent>
            </Card>
            <Card className="border rounded-lg border-gray-600 ">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-1">Sender</div>
                <div className="text-lg font-semibold">
                  {correspondence.sender}
                </div>
              </CardContent>
            </Card>
            <Card className="border rounded-lg border-gray-600 ">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-1">Amount</div>
                <div className="text-lg font-semibold">
                  {currencyFormat(correspondence.amount)}
                </div>
              </CardContent>
            </Card>
            <Card className="border rounded-lg border-gray-600 ">
              <CardContent className="pt-6">
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="text-lg font-semibold">
                  {formatDateTime(correspondence.created_at)}
                </div>
              </CardContent>
            </Card>
          </>
        </div>

        <div className="flex justify-between items-center">
          {/* Left-aligned button */}
          <Button
            type="submit"
            className={`bg-red-500 hover:bg-red-700 flex items-center justify-center ${
              isSubmitting && "opacity-50 pointer-events-none"
            } font-montserrat font-normal`}
            disabled={isSubmitting}
            onClick={handleReminderSubmit}
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <AlertTriangle className="mr-2" /> Send Reminder
              </>
            )}
          </Button>

          {/* Right-aligned buttons */}
          <div className="flex flex-col md:flex-row gap-3">
            <Button
              variant="outline"
              className="text-textGreen border-bgPrimary hover:bg-teal-50 flex items-center"
              onClick={() => handleDownload()}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Correspondence
            </Button>
            <Button
              className="bg-bgPrimary hover:bg-teal-700 flex items-center"
              onClick={() => setShowFileViewer(true)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Correspondence
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showFileViewer} onOpenChange={setShowFileViewer}>
        <DialogContent className="max-w-[95vw] w-full min-h-[95vh] p-4">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle>Document Viewer</DialogTitle>
          </DialogHeader>
          <div className="w-full h-[calc(95vh-80px)] mt-4 overflow-auto">
            {correspondence?.file && (
              <DocViewer
                documents={docs}
                pluginRenderers={DocViewerRenderers}
                className="doc-viewer-container"
                config={{
                  header: {
                    disableHeader: false,
                    disableFileName: false,
                  },
                  loadingRenderer: () => <Loading size={35} />,
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="container mx-auto p-6 mb-10">
        <div className="space-y-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/dashboard/correspondences" className="text-bold">
                  Correspondence
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-sm font-semibold">
                  Details for {correspondence?.title}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex justify-between items-center space-x-6">
            <h2 className="text-2xl font-semibold text-stone-900">
              Correspondence History
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
            {sortedResponses.map((res, index) => (
              <div key={res.id} className="relative">
                <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-900 rounded-full" />
                    <h3 className="font-semibold">{res.sent_to}</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Feedback</div>
                    <div className="bg-teal-50 border border-teal-300 rounded-md text-center text-sm font-normal text-stone-700 p-5">
                      {res.feedback}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm text-gray-600">Action Taken</div>
                    <Badge className="bg-yellowBg text-[#1B1F26B8] hover:bg-amber-600 rounded-sm flex items-center w-fit p-1">
                      <span>{`Sent To ${res.sent_to}`}</span>
                    </Badge>
                  </div>
                  <div className="text-sm text-stone-700 font-medium">
                    {formatDateTime(res.created_at)}
                  </div>
                  <div className="flex gap-3 justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-textGreen border-bgPrimary hover:bg-teal-50 p-4 text-xs"
                      onClick={() => handleDownloadResponseFile(res)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>

                    <Button
                      size="sm"
                      className="bg-bgPrimary hover:bg-teal-700 p-4 text-xs"
                      onClick={() => handleOpenResponseFile(res.responseFile)}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                {index !== sortedResponses.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-8">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 12H20M20 12L13 5M20 12L13 19"
                        stroke="#008080"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}

            <Dialog
              open={showResponseFileViewer}
              onOpenChange={setShowResponseFileViewer}
            >
              <DialogContent className="max-w-[95vw] w-full min-h-[95vh] p-4">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle>Response Document Viewer</DialogTitle>
                </DialogHeader>
                <div className="w-full h-[calc(95vh-80px)] mt-4 overflow-auto">
                  {selectedResponseFile && (
                    <DocViewer
                      documents={selectedResponseFile}
                      pluginRenderers={DocViewerRenderers}
                      className="doc-viewer-container"
                      config={{
                        header: {
                          disableHeader: false,
                          disableFileName: false,
                        },
                      }}
                    />
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {userData?.user_metadata?.role.toLowerCase() !== "secretary" && (
              <Card className="bg-teal-50 border-blue-100">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px] space-y-4 hover:bg-none">
                  <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-20 h-20 bg-bgPrimary rounded-lg flex items-center justify-center hover:bg-bgPrimay">
                        <Plus size={50} className="w-20 h-20 text-white" />
                      </Button>
                    </DialogTrigger>
                    <h2 className="text-center">
                      Add response to correspondence
                    </h2>
                    <DialogContent className="max-w-[95vw] w-full min-h-[95vh] p-4">
                      <DialogHeader className="col-span-full">
                        <DialogTitle className="text-xl">
                          Respond to Correspondence
                        </DialogTitle>
                      </DialogHeader>

                      <div className="flex flex-col sm:flex-row w-full h-[calc(95vh-80px)] mt-4 overflow-auto">
                        <div className="w-full sm:w-1/2 p-4 border-r">
                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="space-y-4"
                          >
                            <div className="space-y-2">
                              <Textarea
                                className="min-h-[120px] resize-none"
                                placeholder="Enter Feedback"
                                {...register("feedback", {
                                  required: "Feedback is required",
                                })}
                              />
                              {errors.feedback && (
                                <p className="text-sm text-red-500">
                                  {errors.feedback.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <Select
                                onValueChange={(value) =>
                                  setValue("recipient", value)
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Send Correspondence to" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments.map((department) => (
                                    <SelectItem
                                      key={department.id}
                                      value={department.name}
                                    >
                                      {department.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {errors.recipient && (
                                <p className="text-sm text-red-500">
                                  {errors.recipient.message}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2">
                              <label>End of the Correspondence?</label>
                              <RadioGroup
                                onValueChange={(value) =>
                                  setValue("is_ended", value === "no")
                                }
                                defaultValue="no"
                                className="flex gap-4"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="r1" />
                                  <label htmlFor="r1">Yes</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="r2" />
                                  <label htmlFor="r2">No</label>
                                </div>
                              </RadioGroup>
                            </div>

                            <Button
                              className="bg-teal-600 w-full"
                              type="submit"
                              disabled={isSubmitting}
                            >
                              {isSubmitting ? <Loader size={30} /> : "Submit"}
                            </Button>
                          </form>
                        </div>

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
                              <label
                                htmlFor="file-upload"
                                className="cursor-pointer block"
                              >
                                {isUploading ? (
                                  <Loading size={50} />
                                ) : (
                                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                                    <UploadCloud className="h-8 w-8 text-gray-400" />
                                    <span className="text-sm text-gray-600">
                                      Upload File
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      Click or drag and drop
                                    </span>
                                  </div>
                                )}
                                <Input
                                  id="file-upload"
                                  type="file"
                                  className="hidden"
                                  {...register("file")}
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
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
