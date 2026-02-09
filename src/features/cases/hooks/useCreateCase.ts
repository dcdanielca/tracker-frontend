import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { casesApi } from "../services/casesApi";
import { queryClient } from "@/lib/queryClient";
import { PATHS } from "@/routes/paths";

export function useCreateCase() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: casesApi.createCase,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["cases"] });
      toast.success("Caso creado exitosamente");
      navigate(PATHS.caseDetail(data.id));
    },
    onError: () => {
      toast.error("Error al crear el caso");
    },
  });
}
