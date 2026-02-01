/**
 * 班级学生查询 Hooks
 */

import { type Ref, unref, computed } from "vue";
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
    queryKey: computed(() => ["class-students", unref(classCode)]),
    queryFn: () =>
      postApiTeacherClassByClassCodeStudents({
        path: { classCode: unref(classCode) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: () => unref(options?.enable) && !!unref(classCode),
  });
}
