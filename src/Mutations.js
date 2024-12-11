import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { AddDirectorate, AddProgram, AddDocument } from "./services/Api";

export function useAddDirectorate() {
  const queryClient = useQueryClient();

  const { isPending, mutate: addDirectorate } = useMutation({
    mutationFn: AddDirectorate,
    onSuccess: () => {
      toast.success("Directorate added successfully");
      queryClient.invalidateQueries("directorates");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add directorate");
    },
  });

  return { isPending, addDirectorate };
}

export function useAddProgram() {
  const queryClient = useQueryClient();

  const { isPending, mutate: addProgram } = useMutation({
    mutationFn: AddProgram,
    onSuccess: () => {
      toast.success("Program added successfully");
      queryClient.invalidateQueries("programs");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add program");
    },
  });

  return { isPending, addProgram };
}

export function useAddDocument() {
  const queryClient = useQueryClient();

  const { isPending, mutate: addDocument } = useMutation({
    mutationFn: AddDocument,
    onSuccess: () => {
      toast.success("Document added successfully");
      queryClient.invalidateQueries("documents");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add document");
    },
  });

  return { isPending, addDocument };
}
