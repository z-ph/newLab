import { deleteApiTeacherClassById } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";

export function useDeleteClass() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof deleteApiTeacherClassById>) => {
      const response = await deleteApiTeacherClassById(params);
      return response.data?.data;
    },
  });
}
