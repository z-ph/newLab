import {
  postApiTeacherExperiments,
  putApiTeacherExperiments,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useCreateExperiment() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherExperiments>) => {
      const response = await postApiTeacherExperiments({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useUpdateExperiment() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherExperiments>) => {
      const response = await putApiTeacherExperiments({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
