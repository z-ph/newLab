import { deleteApiTeacherClassByClassCode } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useDeleteClass() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof deleteApiTeacherClassByClassCode>) => {
      const response = await deleteApiTeacherClassByClassCode({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
