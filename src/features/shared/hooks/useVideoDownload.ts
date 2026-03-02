import { getApiDownloadVideoKey, getApiDownloadPlayPlaykey } from "@/core/api/generated";
import { useQuery } from "@tanstack/vue-query";
import type { Ref } from "vue";
import client from "@/core/api/config";

/**
 * 获取视频下载链接
 * @param key 视频密钥
 */
export function useVideoDownload(key: string | Ref<string>) {
  return useQuery({
    queryKey: ["video-download", typeof key === "string" ? key : key.value],
    queryFn: async () => {
      const response = await getApiDownloadVideoKey({
        path: { key: typeof key === "string" ? key : key.value },
        client,
      });
      return response.data;
    },
    enabled: !!key,
  });
}

/**
 * 获取视频播放链接
 * @param playKey 播放密钥
 */
export function useVideoPlay(playKey: string | Ref<string>) {
  return useQuery({
    queryKey: ["video-play", typeof playKey === "string" ? playKey : playKey.value],
    queryFn: async () => {
      const response = await getApiDownloadPlayPlaykey({
        path: { playKey: typeof playKey === "string" ? playKey : playKey.value },
        client,
      });
      return response.data;
    },
    enabled: !!playKey,
  });
}
