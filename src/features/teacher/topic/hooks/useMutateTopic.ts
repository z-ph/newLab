import { postApiTeacherTopics, putApiTeacherTopics, deleteApiTeacherTopicsTopicid, deleteApiTeacherTopicsBatch } from "@/core/api/generated"
import client from "@/core/api/config"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { toast } from "@/core/utils/toast"

/**
 * 创建题目
 */
export function useCreateTopic() {
  const queryClient = useQueryClient()

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
      queryClient.invalidateQueries({
        queryKey: ["topics"],
      })
    },
  })
}

/**
 * 更新题目
 */
export function useUpdateTopic() {
  const queryClient = useQueryClient()

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
      queryClient.invalidateQueries({
        queryKey: ["topics"],
      })
    },
  })
}

/**
 * 删除单个题目
 */
export function useDeleteTopic() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicId: number) =>
      deleteApiTeacherTopicsTopicid({
        path: { topicId },
        client,
      }),
    onSuccess: () => {
      toast.success("题目删除成功")
      queryClient.invalidateQueries({
        queryKey: ["topics"],
      })
    },
  })
}

/**
 * 批量删除题目
 */
export function useBatchDeleteTopics() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (topicIds: number[]) =>
      deleteApiTeacherTopicsBatch({
        body: { topicIds },
        client,
      }),
    onSuccess: () => {
      toast.success("批量删除成功")
      queryClient.invalidateQueries({
        queryKey: ["topics"],
      })
    },
  })
}
