import { type Ref, unref } from "vue";
import { getApiTeacherClassCodeClasscode } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import client from "@/core/api/config";

export default function useQueryClassByCodeBase(
  classCode: Ref<string>,
  options: QueryOptions,
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () =>
      getApiTeacherClassCodeClasscode({
        path: {
          classCode: unref(classCode),
        },
        client,
      }),
    select: (res) => res.data?.data,
  });
}

export function useQueryClassByCode(classCode: Ref<string>) {
  const query = useQueryClassByCodeBase(classCode, {
    queryKey: computed(() => ["class-by-code", unref(classCode)]),
  });
  return { query };
}
