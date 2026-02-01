import { type Ref, toValue, computed } from "vue";
import { getApiTeacherExperimentsCourseByCourseId } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useQueryExperimentByCourse(
  courseId: Ref<string>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["experiments", "course", toValue(courseId)]),
    queryFn: () =>
      getApiTeacherExperimentsCourseByCourseId({
        path: { courseId: toValue(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => toValue(options?.enable)),
  });
}
