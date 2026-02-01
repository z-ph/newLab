import { type MaybeRefOrGetter, toValue, computed } from "vue";
import { getApiTeacherProcedureSubmissionsCourseByCourseId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的提交记录列表
 */
export function useQueryCourseSubmissions(
  courseId: MaybeRefOrGetter<string>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["courses", "submissions", toValue(courseId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId: toValue(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
