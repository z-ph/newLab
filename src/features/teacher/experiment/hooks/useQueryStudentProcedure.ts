import { type Ref, toValue, computed } from "vue";
import { getApiTeacherStudentsByStudentUsernameExperimentsByExperimentIdProcedures } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询学生的实验步骤完成情况
 */
export function useQueryStudentProcedures(
  studentUsername: Ref<string>,
  experimentId: Ref<number>,
  classCode: Ref<string>,
  options?: { enable?: Ref<boolean> },
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
