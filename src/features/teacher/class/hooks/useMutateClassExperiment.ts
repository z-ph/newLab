import {
  postApiTeacherClassBindExperiment,
  postApiTeacherClassUnbindExperimentByExperimentId,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useBindExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      params: GetFirstParamsType<typeof postApiTeacherClassBindExperiment>,
    ) => {
      const response = await postApiTeacherClassBindExperiment({
        ...params,
        client,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-experiments"],
      });
    },
  });
}

export function useUnbindExperiment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      params: GetFirstParamsType<typeof postApiTeacherClassUnbindExperimentByExperimentId>,
    ) => {
      const response = await postApiTeacherClassUnbindExperimentByExperimentId({
        ...params,
        client,
      });
      return response.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["class-experiments"],
      });
    },
  });
}
