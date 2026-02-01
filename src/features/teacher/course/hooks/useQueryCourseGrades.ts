import { type Ref, unref, computed } from "vue";
import { getApiTeacherGradesCourseByCourseId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的成绩列表
 */
export function useQueryCourseGrades(
  courseId: Ref<string>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["courses", "grades", unref(courseId)]),
    queryFn: () =>
      getApiTeacherGradesCourseByCourseId({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
