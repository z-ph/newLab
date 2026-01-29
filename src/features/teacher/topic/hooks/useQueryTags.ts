import { getApiTeacherTags } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

/**
 * 查询所有标签（用于筛选和表单）
 */
export function useQueryTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () =>
      getApiTeacherTags({
        path: { type: "" }, // 空字符串表示查询所有标签
        client,
      }),
    select: (response) => response.data?.data,
  })
}
