import { type Ref, unref, computed } from "vue";
import { getApiTeacherExperimentsCourseByCourseId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 根据课程ID查询该课程的实验列表
 */
export function useQueryCourseExperiments(
  courseId: Ref<string>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["courses", "experiments", unref(courseId)]),
    queryFn: () =>
      getApiTeacherExperimentsCourseByCourseId({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
