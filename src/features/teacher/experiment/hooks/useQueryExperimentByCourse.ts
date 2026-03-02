import { type Ref, unref, computed } from "vue";
import { getApiTeacherExperimentsCourseCourseid } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

export function useQueryExperimentByCourse(
  courseId: Ref<string>,
  options?: { enable?: Ref<boolean> },
) {
  return useQuery({
    queryKey: computed(() => ["experiments", "course", unref(courseId)]),
    queryFn: () =>
      getApiTeacherExperimentsCourseCourseid({
        path: { courseId: unref(courseId) },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: computed(() => unref(options?.enable)),
  });
}
