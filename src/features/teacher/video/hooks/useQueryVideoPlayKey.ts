import { type Ref, unref, computed } from "vue"
import { getApiResourceVideoKeyByVideoId } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

/**
 * 根据视频ID获取播放密钥
 */
export function useQueryVideoPlayKey(videoId: Ref<number | undefined>) {
  return useQuery({
    queryKey: computed(() => ["video-play-key", unref(videoId)]),
    queryFn: ()=>getApiResourceVideoKeyByVideoId({
      client,
      path:{
        videoId:unref(videoId)!
      }
    }),
    //@ts-expect-error
    select: res=>res.data?.data.downloadUrl,
    enabled: computed(() => !!unref(videoId)),
  })
}
