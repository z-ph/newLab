import { getApiTeacherExperimentsQuery } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import client from "@/core/api/config";

/**
 * 查询所有实验
 */
export function useQueryExperimentAll(options?: Partial<QueryOptions> & {
  courseId?: string;
  experimentName?: string;
}) {
  const courseId = ref(options?.courseId);
  const experimentName = ref(options?.experimentName);

  return useQuery({
    queryKey: computed(() => ["experiments-all", courseId.value, experimentName.value]),
    queryFn: () =>
      getApiTeacherExperimentsQuery({
        client,
        query: {
          pageable: false,
          courseId: courseId.value,
          experimentName: experimentName.value,
        },
      }),
    select: (res) => res.data?.data?.records,
    enabled: options?.enable,
  });
}

/**
 * 分页查询实验
 */
export function useQueryExperimentPage(initial: {
  current?: number;
  size?: number;
  courseId?: string;
  experimentName?: string;
}) {
  const current = ref(initial.current || 1);
  const size = ref(initial.size || 10);
  const courseId = ref(initial.courseId);
  const experimentName = ref(initial.experimentName);

  const query = useQuery({
    queryKey: computed(() => ["experiments-page", current.value, size.value, courseId.value, experimentName.value]),
    queryFn: () =>
      getApiTeacherExperimentsQuery({
        client,
        query: {
          current: current.value,
          size: size.value,
          courseId: courseId.value,
          experimentName: experimentName.value,
          pageable: true,
        },
      }),
    select: (res) => res.data?.data,
  });

  const experiments = computed(() => query.data.value?.records || []);
  const total = computed(() => query.data.value?.total || 0);

  return {
    current,
    size,
    experiments,
    total,
    query,
  };
}
