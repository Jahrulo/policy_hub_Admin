import { useQuery } from "@tanstack/react-query";
import {
  GetDirectorates,
  GetDocuments,
  GetPrograms,
  GetProgramsByDirectorate,

} from "./services/Api";

export function useDirectorates() {
    const {
      data: directorates,
      isPending,
      isError,
    } = useQuery({
      queryKey: ["directorates"],
      queryFn: GetDirectorates,
    
    });

    return { directorates, isPending, isError };
}

export function useProgramById(directorateId) {
  const {
    data: program,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["programs", directorateId],
    queryFn: GetProgramsByDirectorate,
  });

  return { program, isPending, isError };
}
export function usePrograms() {
  const {
    data: program,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["programs"],
    queryFn: GetPrograms,
  });

  return { program, isPending, isError };
}

export function useDocuments() {
   const {
     data: documents,
     isPending,
     isError,
   } = useQuery({
     queryKey: ["documents"],
     queryFn: GetDocuments,
    
   }
  );

   return { documents, isPending, isError };
}
