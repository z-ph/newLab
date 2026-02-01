/**
 * 学生步骤提交查询 Hooks
 */

import { type Ref, unref, computed } from "vue";
import { getApiTeacherProcedureSubmissionsCourseByCourseId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询课程下所有学生的步骤提交
 */
export function useQueryStudentSubmissions(
  courseId: Ref<string | undefined>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["student-submissions", unref(courseId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId: unref(courseId)! },
        client,
      }),
    select: (res) => res.data?.data || [],
    enabled: computed(() => !!unref(options?.enable) && !!unref(courseId)),
  });
}
