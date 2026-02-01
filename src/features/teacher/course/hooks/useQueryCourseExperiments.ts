import { type MaybeRefOrGetter, toValue, computed } from "vue";
import { getApiTeacherExperimentsCourseByCourseId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的实验列表
 */
export function useQueryCourseExperiments(
  courseId: MaybeRefOrGetter<string>,
  options?: { enable?: MaybeRefOrGetter<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["courses", "experiments", toValue(courseId)]),
    queryFn: () =>
      getApiTeacherExperimentsCourseByCourseId({
        path: { courseId: toValue(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
