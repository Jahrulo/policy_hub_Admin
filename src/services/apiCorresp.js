import { supabase, supabaseUrl } from "./supabase";
import { toast } from "react-toastify";

export async function AddResponse(newResponse) {
  const fileName = `${Math.random()}-${newResponse.file.name}`.replaceAll(
    "/",
    ""
  ); // Ensure unique responseFile names
  const filePath = `responses/${fileName}`; // Path for responseFile in storage
  let responseData = null; // To store inserted response data

  try {
    // 1. Insert the response data with the responseFile URL (to be uploaded next)
    const { data, error } = await supabase
      .from("responses")
      .insert([
        {
          feedback: newResponse.feedback,
          sent_to: newResponse.sent_to,
          correspondence_id: newResponse.correspondence_id,
          responseFile: `${supabaseUrl}/storage/v1/object/public/correspondence_files/${filePath}`,
        },
      ])
      .single();

    if (error) {
      console.error("Response insertion error:", error);
      throw new Error("Response could not be added.");
    }

    responseData = data; // Save response data for potential rollback

    // 2. Upload the responseFile to Supabase storage
    const { error: fileUploadError } = await supabase.storage
      .from("correspondence_files")
      .upload(filePath, newResponse.file);

    if (fileUploadError) {
      // Rollback response entry in case of upload failure
      await supabase.from("responses").delete().eq("id", responseData.id);
      console.error("File upload error:", fileUploadError);
      throw new Error("File upload failed, response submission canceled.");
    }

    // 3. Update the correspondence table with status and other fields
    const { error: updateError } = await supabase
      .from("correspondences")
      .update({
        is_ended: true,
        status: "Completed",
        sentTo: newResponse.sent_to,
      })
      .eq("id", newResponse.correspondence_id);

    if (updateError) {
      // Rollback both responseFile and response in case of update failure
      await supabase.storage.from("correspondence_files").remove([filePath]);
      await supabase.from("responses").delete().eq("id", responseData.id);
      console.error("Correspondence update error:", updateError);
      throw new Error(
        "Correspondence update failed, response submission canceled."
      );
    }

    toast.success("Response added and correspondence updated successfully!");
    return responseData; // Return the response data if successful
  } catch (err) {
    console.error("AddResponse error:", err);
    toast.error(err.message || "An error occurred. Please try again.");
    throw err;
  }
}
