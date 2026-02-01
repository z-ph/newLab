import { type MaybeRefOrGetter, toValue, computed } from "vue";
import { getApiTeacherStudentsByStudentUsernameExperimentsByExperimentIdProcedures } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询学生的实验步骤完成情况
 */
export function useQueryStudentProcedures(
  studentUsername: MaybeRefOrGetter<string>,
  experimentId: MaybeRefOrGetter<number>,
  classCode: MaybeRefOrGetter<string>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["student-procedures", toValue(studentUsername), toValue(experimentId), toValue(classCode)]),
    queryFn: () =>
      getApiTeacherStudentsByStudentUsernameExperimentsByExperimentIdProcedures({
        path: {
          studentUsername: toValue(studentUsername),
          experimentId: toValue(experimentId),
        },
        query: {
          classCode: toValue(classCode),
        },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
