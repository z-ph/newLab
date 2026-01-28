import { postApiTeacherClassBatch } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useCreateClassBatch() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherClassBatch>) => {
      const response = await postApiTeacherClassBatch({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
