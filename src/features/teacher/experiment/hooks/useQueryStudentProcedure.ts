import { getApiTeacherStudentsByStudentUsernameExperimentsByExperimentIdProcedures } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

/**
 * 查询学生的实验步骤完成情况
 */
export function useQueryStudentProcedures(
  studentUsername: string | Ref<string>,
  experimentId: number | Ref<number>,
  classCode: string | Ref<string>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["student-procedures", studentUsername, experimentId, classCode],
    queryFn: () =>
      getApiTeacherStudentsByStudentUsernameExperimentsByExperimentIdProcedures({
        path: {
          studentUsername: unref(studentUsername),
          experimentId: unref(experimentId),
        },
        query: {
          classCode: unref(classCode),
        },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
