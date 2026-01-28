import { getApiTeacherProcedureSubmissionsCourseByCourseId } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的提交记录列表
 */
export function useQueryCourseSubmissions(
  courseId: string | Ref<string>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["courses", "submissions", courseId],
    queryFn: () =>
      getApiTeacherProcedureSubmissionsCourseByCourseId({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
