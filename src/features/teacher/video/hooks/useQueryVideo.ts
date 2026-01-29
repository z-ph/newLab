import { postApiTeacherVideosQuery } from "@/core/api/generated"
import type { GetApiParamsTypeBase } from "@/core/utils/typeUtils"
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions"
import { useQuery } from "@tanstack/vue-query"
import { computed, ref, type Ref } from "vue"
import client from "@/core/api/config"

/**
 * 视频查询基础 hook
 */
export function useQueryVideoBase(
  queryParams: GetApiParamsTypeBase<typeof postApiTeacherVideosQuery, "body"> | Ref<GetApiParamsTypeBase<typeof postApiTeacherVideosQuery, "body">>,
  options: QueryOptions,
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () =>
      postApiTeacherVideosQuery({
        body: typeof queryParams === "object" && "value" in queryParams ? queryParams.value : queryParams,
        client,
      }),
    select: (response) => response.data?.data,
  })
}

/**
 * 分页查询视频列表
 */
export function useQueryVideoPage(initial: {
  current?: number
  size?: number
  fileName?: string
}) {
  const current = ref(initial.current || 1)
  const size = ref(initial.size || 10)
  const fileName = ref(initial.fileName || "")

  const queryParams = computed(() => ({
    current: current.value,
    size: size.value,
    pageable: true,
    ...(fileName.value && { originalFileName: fileName.value }),
  }))

  const query = useQueryVideoBase(
    queryParams,
    {
      queryKey: computed(() => ["videos-page", current.value, size.value, fileName.value]),
    },
  )

  const videos = computed(() => query.data.value?.records || [])
  const total = computed(() => query.data.value?.total || 0)

  return {
    current,
    size,
    fileName,
    videos,
    total,
    query,
  }
}

/**
 * 查询所有视频（不分页）
 */
export function useQueryVideoAll() {
  const query = useQueryVideoBase(
    {
      pageable: false,
    },
    {
      queryKey: ["videos-all"],
    },
  )
  return { query }
}
