import { getApiTeacherClassCodeClasscode } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import { type Ref, unref, computed, ref } from "vue";
import client from "@/core/api/config";

/**
 * 查询指定班级的实验列表
 * API 返回 ClassWithExperimentsResponse（包含 experiments 数组）
 */
export function useQueryClassExperiments(
  classCode: Ref<string | undefined>,
) {
  const current = ref(1);
  const size = ref(10);
  const query = useQuery({
    queryKey: computed(() => ["class-experiments", unref(classCode)]),
    queryFn: () =>
      getApiTeacherClassCodeClasscode({
        path: { classCode: unref(classCode)! },
        client,
      }),
    select: (res) => res.data?.data?.experiments || [],
    enabled: computed(() => !!unref(classCode)),
  });

  return {
    current,
    size,
    query,
  };
}
