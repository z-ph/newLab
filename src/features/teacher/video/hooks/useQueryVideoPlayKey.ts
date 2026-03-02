import { type Ref, unref, computed } from "vue"
import { getApiResourceVideoKeyVideoid } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

/**
 * 根据视频ID获取播放密钥
 */
export function useQueryVideoPlayKey(videoId: Ref<number | undefined>) {
  return useQuery({
    queryKey: computed(() => ["video-play-key", unref(videoId)]),
    queryFn: ()=>getApiResourceVideoKeyVideoid({
      client,
      path:{
        videoId:unref(videoId)!
      }
    }),
    select: (res) => (res.data?.data as any)?.downloadUrl,
    enabled: computed(() => !!unref(videoId)),
  })
}
