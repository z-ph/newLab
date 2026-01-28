import { postApiTeacherClassBatch } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";

export function useCreateClassBatch() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherClassBatch>) => {
      const response = await postApiTeacherClassBatch(params);
      return response.data?.data;
    },
  });
}
