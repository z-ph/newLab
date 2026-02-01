import { type MaybeRefOrGetter, toValue, computed } from "vue";
import { getApiTeacherGradesCourseByCourseId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的成绩列表
 */
export function useQueryCourseGrades(
  courseId: MaybeRefOrGetter<string>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["courses", "grades", toValue(courseId)]),
    queryFn: () =>
      getApiTeacherGradesCourseByCourseId({
        path: { courseId: toValue(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
