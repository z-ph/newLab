import { postApiTeacherClassQuery } from "@/core/api/generated";
import type { GetApiParamsTypeBase } from "@/core/utils/typeUtils";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref } from "vue";
import client from "@/core/api/config";

export default function useQueryClassBase(
  queryParams: GetApiParamsTypeBase<typeof postApiTeacherClassQuery, "body">,
  options: QueryOptions,
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () =>
      postApiTeacherClassQuery({
        body: queryParams,
        client,
      }),
    select: (res) => res.data?.data,
  });
}

export function useQueryClassAll() {
  const query = useQueryClassBase(
    {
      pageable: false,
    },
    {
      queryKey: ["classes-all"],
    },
  );
  return { query };
}

export function useQueryClassPage(initial: {
  current?: number;
  size?: number;
}) {
  const current = ref(initial.current || 1);
  const size = ref(initial.size || 20);
  const query = useQueryClassBase(
    {
      pageable: true,
      current: current.value,
      size: size.value,
    },
    {
      queryKey: computed(() => ["classes-page", current.value, size.value]),
    },
  );
  return {
    current,
    size,
    query,
  };
}
