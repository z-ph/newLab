import { type MaybeRefOrGetter, toValue } from "vue";
import { getApiTeacherClassCodeByClassCode } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import client from "@/core/api/config";

export default function useQueryClassByCodeBase(
  classCode: MaybeRefOrGetter<string>,
  options: QueryOptions,
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () =>
      getApiTeacherClassCodeByClassCode({
        path: {
          classCode: toValue(classCode),
        },
        client,
      }),
    select: (res) => res.data?.data,
  });
}

export function useQueryClassByCode(classCode: MaybeRefOrGetter<string>) {
  const query = useQueryClassByCodeBase(classCode, {
    queryKey: computed(() => ["class-by-code", toValue(classCode)]),
  });
  return { query };
}
