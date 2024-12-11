import { supabase } from "./supabase";

// Fetch all directorates
export async function GetDirectorates() {
  const { data, error } = await supabase.from("directorates").select("*");

  if (error) {
    console.error(error);
    throw new Error("Error fetching directorates");
  }
  return data;
}
// fetch programs with its directorates
export async function GetPrograms() {
  const { data, error } = await supabase.from("programs").select(`
      *,
      directorates (
        name
      )
    `);

  if (error) {
    console.error(error);
    throw new Error("Error fetching programs with directorates");
  }
  return data;
}

// fetch all documents
export async function GetDocuments() {
  const { data, error } = await supabase.from("documents").select("*");
  if (error) {
    console.error(error);
    throw new Error("Error fetching documents");
  }
  return data;
}

// // Add a new directorate with validation
export async function AddDirectorate(directorate) {
  if (!directorate.name) {
    throw new Error("Directorate name is required.");
  }

  const { data, error } = await supabase
    .from("directorates")
    .insert([directorate])
    .select();
  if (error) {
    console.error(error);
    throw new Error("Error adding directorate");
  }
  return data;
}

// Fetch programs by directorate ID
export async function GetProgramsByDirectorate(directorateId) {
  if (!directorateId) {
    throw new Error("Directorate ID is required.");
  }

  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("directorate_id", directorateId);
  if (error) {
    console.error(error);
    throw new Error("Error fetching programs for directorate");
  }
  return data;
}

// // Add a new program with validation
export async function AddProgram(program) {
  if (!program.name || !program.directorate_id) {
    throw new Error("Program name and directorate ID are required.");
  }

  const { data: directorateExists, error: directorateError } = await supabase
    .from("directorates")
    .select("id")
    .eq("id", program.directorate_id)
    .single();

  if (directorateError || !directorateExists) {
    throw new Error("The provided directorate ID does not exist.");
  }

  const { data, error } = await supabase
    .from("programs")
    .insert([program])
    .select();
  if (error) {
    console.error(error);
    throw new Error("Error adding program");
  }
  return data;
}

// Fetch documents by program ID
export async function GetDocumentsByProgram(programId) {
  if (!programId) {
    throw new Error("Program ID is required.");
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("program_id", programId);
  if (error) {
    console.error(error);
    throw new Error("Error fetching documents for program");
  }
  return data;
}

// Add a new document with validations
export async function AddDocument(document) {
  const validTypes = [
    "Strategy",
    "Guideline",
    "Operational Manual",
    "Operational Plan",
    "Roadmap",
    "Other",
  ];
  const validStatuses = [
    "Implemented",
    "Zero Draft",
    "Not Started",
    "In-Progress",
  ];

  if (!document.name) {
    throw new Error("Document name is required.");
  }
  if (!validTypes.includes(document.type)) {
    throw new Error(
      `Invalid document type. Valid types: ${validTypes.join(", ")}`
    );
  }
  if (!validStatuses.includes(document.status)) {
    throw new Error(
      `Invalid document status. Valid statuses: ${validStatuses.join(", ")}`
    );
  }
  if (document.has_expiry && !document.expiry_date) {
    throw new Error("Expiry date is required if has_expiry is true.");
  }

  const { data: programExists, error: programError } = await supabase
    .from("programs")
    .select("id")
    .eq("id", document.program_id)
    .single();

  if (programError || !programExists) {
    throw new Error("The provided program ID does not exist.");
  }

  const { data, error } = await supabase
    .from("documents")
    .insert([document])
    .select();
  if (error) {
    console.error(error);
    throw new Error("Error adding document");
  }
  return data;
}

// Fetch a specific document by ID
export async function GetDocumentById(documentId) {
  if (!documentId) {
    throw new Error("Document ID is required.");
  }

  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .single();
  if (error) {
    console.error(error);
    throw new Error("Error fetching document");
  }
  return data;
}
