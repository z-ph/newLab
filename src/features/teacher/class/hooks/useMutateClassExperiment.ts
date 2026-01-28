import {
  postApiTeacherClassBindExperiment,
  postApiTeacherClassUnbindExperimentByExperimentId,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useBindExperiment() {
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
  });
}

export function useUnbindExperiment() {
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
  });
}
