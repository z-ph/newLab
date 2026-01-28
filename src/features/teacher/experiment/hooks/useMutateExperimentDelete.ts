import { deleteApiTeacherExperimentsByExperimentId } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useDeleteExperiment() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof deleteApiTeacherExperimentsByExperimentId>) => {
      const response = await deleteApiTeacherExperimentsByExperimentId({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
