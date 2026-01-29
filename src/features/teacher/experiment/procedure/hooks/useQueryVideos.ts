import { postApiTeacherVideosQuery } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 查询所有视频（不分页）
 * 用于下拉选择等场景
 */
export function useQueryVideosAll() {
  return useQuery({
    queryKey: ["videos-all"],
    queryFn: async () => {
      const response = await postApiTeacherVideosQuery({
        client,
        body: {
          pageable: false,
        },
      });
      return response.data?.data;
    },
    select: (response) => {
      // 处理返回数据，统一为数组格式
      if (Array.isArray(response)) {
        return response;
      }
      if (response?.records) {
        return response.records;
      }
      return [];
    },
  });
}
