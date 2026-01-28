import { getApiTeacherClassCodeByClassCode } from "@/core/api/generated";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed } from "vue";
import client from "@/core/api/config";

export default function useQueryClassByCodeBase(
  classCode: string,
  options: QueryOptions,
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () =>
      getApiTeacherClassCodeByClassCode({
        path: {
          classCode,
        },
        client,
      }),
    select: (res) => res.data?.data,
  });
}

export function useQueryClassByCode(classCode: string) {
  const query = useQueryClassByCodeBase(classCode, {
    queryKey: computed(() => ["class-by-code", classCode]),
  });
  return { query };
}
