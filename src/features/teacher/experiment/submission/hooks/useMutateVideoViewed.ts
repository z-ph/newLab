import { postApiStudentProcedureSubmissionsVideoProcedureidViewed } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 标记视频步骤已观看
 * 用于学生端记录视频观看进度
 */
export function useMarkVideoViewed() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiStudentProcedureSubmissionsVideoProcedureidViewed>) => {
      const response = await postApiStudentProcedureSubmissionsVideoProcedureidViewed({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
