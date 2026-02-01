/**
 * 班级学生查询 Hooks
 */

import { type Ref, toValue, computed } from "vue";
import { postApiTeacherClassByClassCodeStudents } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询班级学生列表
 */
export function useQueryClassStudents(
  classCode: Ref<string>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["class-students", toValue(classCode)]),
    queryFn: () =>
      postApiTeacherClassByClassCodeStudents({
        path: { classCode: toValue(classCode) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: () => toValue(options?.enable) && !!toValue(classCode),
  });
}
