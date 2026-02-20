import { getApiTeacherExperiments } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import client from "@/core/api/config";

/**
 * 查询所有实验
 */
export function useQueryExperimentAll(options?: Partial<QueryOptions>) {
  return useQuery({
    queryKey: options?.queryKey || ["experiments-all"],
    queryFn: () =>
      getApiTeacherExperiments({
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}

/**
 * 分页查询实验
 */
export function useQueryExperimentPage(initial: {
  current?: number;
  size?: number;
}) {
  const current = ref(initial.current || 1);
  const size = ref(initial.size || 10);
  const query = useQuery({
    queryKey: computed(() => ["experiments-page", current.value, size.value]),
    queryFn: () =>
      getApiTeacherExperiments({
        client,
      }),
    select: (res) => res.data?.data,
  });

  const experiments = computed(() => {
    const all = query.data.value || [];
    const start = (current.value - 1) * size.value;
    const end = start + size.value;
    return all.slice(start, end);
  });

  const total = computed(() => (query.data.value || []).length);

  return {
    current,
    size,
    experiments,
    total,
    query,
  };
}
