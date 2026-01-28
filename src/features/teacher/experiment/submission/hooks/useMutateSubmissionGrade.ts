import { postApiTeacherProcedureSubmissionsBySubmissionIdGrade } from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 给步骤提交打分
 */
export function useGradeSubmission() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherProcedureSubmissionsBySubmissionIdGrade>) => {
      const response = await postApiTeacherProcedureSubmissionsBySubmissionIdGrade({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
