import { postApiTeacherTopics, putApiTeacherTopics, deleteApiTeacherTopicsByTopicId, deleteApiTeacherTopicsBatch } from "@/core/api/generated"
import client from "@/core/api/config"
import { useMutation } from "@tanstack/vue-query"
import { toast } from "@/core/utils/toast"

/**
 * 创建题目
 */
export function useCreateTopic() {
  return useMutation({
    mutationFn: (data: {
      type: number
      content: string
      choices?: string
      correctAnswer: string
      tagIds?: number[]
    }) =>
      postApiTeacherTopics({
        body: data,
        client,
      }),
    onSuccess: () => {
      toast.success("题目创建成功")
    },
  })
}

/**
 * 更新题目
 */
export function useUpdateTopic() {
  return useMutation({
    mutationFn: (data: {
      id: number
      type?: number
      content?: string
      choices?: string
      correctAnswer?: string
      tagIds?: number[]
    }) =>
      putApiTeacherTopics({
        body: data,
        client,
      }),
    onSuccess: () => {
      toast.success("题目更新成功")
    },
  })
}

/**
 * 删除单个题目
 */
export function useDeleteTopic() {
  return useMutation({
    mutationFn: (topicId: number) =>
      deleteApiTeacherTopicsByTopicId({
        path: { topicId },
        client,
      }),
    onSuccess: () => {
      toast.success("题目删除成功")
    },
  })
}

/**
 * 批量删除题目
 */
export function useBatchDeleteTopics() {
  return useMutation({
    mutationFn: (topicIds: number[]) =>
      deleteApiTeacherTopicsBatch({
        body: { topicIds },
        client,
      }),
    onSuccess: () => {
      toast.success("批量删除成功")
    },
  })
}
