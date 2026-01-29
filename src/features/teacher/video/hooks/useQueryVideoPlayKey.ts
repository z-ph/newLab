import { getApiResourceVideoKeyByVideoId } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"
import { computed, unref, type Ref } from "vue"

// ✅ 辅助函数：安全地获取 id 值
function getId(videoId: Ref<number | undefined> | number | undefined): number | undefined {
  if (typeof videoId === "number") {
    return videoId
  }
  // videoId 不是 number 的情况下，一定是 Ref（因为类型定义）
  const ref = videoId as Ref<number | undefined>
  return ref.value
}

/**
 * 根据视频ID获取播放密钥
 */
export function useQueryVideoPlayKey(videoId: Ref<number | undefined> | number | undefined) {
  return useQuery({
    queryKey: computed(() => ["video-play-key", getId(videoId)]),
    queryFn: ()=>getApiResourceVideoKeyByVideoId({
      client,
      path:{
        videoId:unref(videoId)!
      }
    }),
    //@ts-expect-error
    select: res=>res.data?.data.downloadUrl,
    enabled: computed(() => !!getId(videoId)),
  })
}
