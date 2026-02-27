import {
  postApiTeacherExperiments,
  putApiTeacherExperiments,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useCreateExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherExperiments>) => {
      const response = await postApiTeacherExperiments({
        ...params,
        client,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experiments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["experiments-page"],
      });
      queryClient.invalidateQueries({
        queryKey: ["experiments-all"],
      });
    },
  });
}

export function useUpdateExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherExperiments>) => {
      const response = await putApiTeacherExperiments({
        ...params,
        client,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["experiments"],
      });
      queryClient.invalidateQueries({
        queryKey: ["experiments-page"],
      });
      queryClient.invalidateQueries({
        queryKey: ["experiments-all"],
      });
    },
  });
}
