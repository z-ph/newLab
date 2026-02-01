import { type MaybeRefOrGetter, toValue, computed } from "vue"
import { getApiResourceVideoKeyByVideoId } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"

/**
 * 根据视频ID获取播放密钥
 */
export function useQueryVideoPlayKey(videoId: MaybeRefOrGetter<number | undefined>) {
  return useQuery({
    queryKey: computed(() => ["video-play-key", toValue(videoId)]),
    queryFn: ()=>getApiResourceVideoKeyByVideoId({
      client,
      path:{
        videoId:toValue(videoId)!
      }
    }),
    //@ts-expect-error
    select: res=>res.data?.data.downloadUrl,
    enabled: computed(() => !!toValue(videoId)),
  })
}
