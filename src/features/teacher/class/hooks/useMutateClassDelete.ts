import { deleteApiTeacherClassById } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useDeleteClass() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof deleteApiTeacherClassById>) => {
      const response = await deleteApiTeacherClassById({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
