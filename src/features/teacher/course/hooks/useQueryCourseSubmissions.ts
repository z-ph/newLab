import { type Ref, unref, computed } from "vue";
import { getApiTeacherProcedureSubmissionsCourseCourseid } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的提交记录列表
 */
export function useQueryCourseSubmissions(
  courseId: Ref<string>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["courses", "submissions", unref(courseId)]),
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseCourseid({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
