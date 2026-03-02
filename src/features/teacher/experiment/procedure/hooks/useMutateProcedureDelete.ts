import { deleteApiTeacherProceduresProcedureid } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 删除实验步骤
 */
export function useDeleteProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof deleteApiTeacherProceduresProcedureid>) => {
      const response = await deleteApiTeacherProceduresProcedureid({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
