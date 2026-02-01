import { postApiTeacherTopicsQuery, getApiTeacherTopicsByTopicId, getApiTeacherTopicsStatistics } from "@/core/api/generated"
import client from "@/core/api/config"
import { useQuery } from "@tanstack/vue-query"
import { type Ref, unref, computed, ref } from "vue"

/**
 * 分页查询题目列表
 */
export function useQueryTopicPage(initial: {
  current?: number
  size?: number
  type?: number
  keyword?: string
  tagIds?: number[]
  difficultyTagIds?: number[]
  subjectTagIds?: number[]
  requireAllTags?: boolean
  createdBy?: string
}) {
  const current = ref(initial.current || 1)
  const size = ref(initial.size || 10)
  const type = ref(initial.type)
  const keyword = ref(initial.keyword)
  const tagIds = ref(initial.tagIds)
  const difficultyTagIds = ref(initial.difficultyTagIds)
  const subjectTagIds = ref(initial.subjectTagIds)
  const requireAllTags = ref(initial.requireAllTags)
  const createdBy = ref(initial.createdBy)

  const query = useQuery({
    queryKey: computed(() => [
      "topics",
      current.value,
      size.value,
      type.value,
      keyword.value,
      tagIds.value,
      difficultyTagIds.value,
      subjectTagIds.value,
      requireAllTags.value,
      createdBy.value,
    ]),
    queryFn: () =>
      postApiTeacherTopicsQuery({
        body: {
          current: current.value,
          size: size.value,
          type: type.value,
          keyword: keyword.value,
          tagIds: tagIds.value,
          difficultyTagIds: difficultyTagIds.value,
          subjectTagIds: subjectTagIds.value,
          requireAllTags: requireAllTags.value,
          createdBy: createdBy.value,
        },
        client,
      }),
    select: (response) => response.data?.data,
  })

  const topics = computed(() => query.data.value?.records || [])
  const total = computed(() => query.data.value?.total || 0)

  return {
    current,
    size,
    type,
    keyword,
    tagIds,
    difficultyTagIds,
    subjectTagIds,
    requireAllTags,
    createdBy,
    topics,
    total,
    query,
  }
}

/**
 * 根据 ID 查询单个题目
 */
export function useQueryTopicById(topicId: Ref<number>) {
  return useQuery({
    queryKey: computed(() => ["topic", unref(topicId)]),
    queryFn: () =>
      getApiTeacherTopicsByTopicId({
        path: { topicId: unref(topicId) },
        client,
      }),
    select: (response) => response.data?.data,
    enabled: computed(() => !!unref(topicId)),
  })
}

/**
 * 查询题目统计信息
 */
export function useQueryTopicStatistics() {
  return useQuery({
    queryKey: ["topic-statistics"],
    queryFn: () =>
      getApiTeacherTopicsStatistics({
        client,
      }),
    select: (response) => response.data?.data,
  })
}
