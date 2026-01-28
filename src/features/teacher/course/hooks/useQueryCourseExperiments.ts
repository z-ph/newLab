import { getApiTeacherExperimentsCourseByCourseId } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import type { Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { unref } from "vue";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的实验列表
 */
export function useQueryCourseExperiments(
  courseId: string | Ref<string>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["courses", "experiments", courseId],
    queryFn: () =>
      getApiTeacherExperimentsCourseByCourseId({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
