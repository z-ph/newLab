/**
 * 步骤时间延长相关 Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { type Ref, computed } from 'vue'
import {
  getApiTeacherProceduresExtensions,
  postApiTeacherProceduresExtensions,
  postApiTeacherProceduresExtensionsByExperiment,
  putApiTeacherProceduresExtensionsId,
  deleteApiTeacherProceduresExtensionsId,
} from '@/core/api/generated'
import client from '@/core/api/config'
import type {
  BatchExtendProcedureTimeRequest,
  BatchExtendByExperimentRequest,
} from '@/core/api/generated'

/**
 * 查询延长记录
 */
export function useQueryExtensions(params: Ref<{
  current?: number
  size?: number
  pageable?: boolean
  studentUsername?: string
  teacherUsername?: string
  experimentalProcedureId?: number
}>) {
  const current = computed(() => params.value.current ?? 1)
  const size = computed(() => params.value.size ?? 10)
  const pageable = computed(() => params.value.pageable ?? true)

  return useQuery({
    queryKey: ['teacher', 'procedures', 'extensions', computed(() => ({
      current: current.value,
      size: size.value,
      pageable: pageable.value,
      studentUsername: params.value.studentUsername,
      teacherUsername: params.value.teacherUsername,
      experimentalProcedureId: params.value.experimentalProcedureId,
    }))],
    queryFn: () => getApiTeacherProceduresExtensions({
      client,
      query: {
        current: current.value,
        size: size.value,
        pageable: pageable.value,
        studentUsername: params.value.studentUsername,
        teacherUsername: params.value.teacherUsername,
        experimentalProcedureId: params.value.experimentalProcedureId,
      },
    }),
    select: (res) => res.data?.data,
  })
}

/**
 * 批量延长学生步骤时间（按步骤）
 */
export function useBatchExtendByProcedure() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BatchExtendProcedureTimeRequest) => {
      return postApiTeacherProceduresExtensions({
        body: data,
        client,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'procedures', 'extensions'],
      })
    },
  })
}

/**
 * 批量延长学生步骤时间（按实验，延长该实验下所有步骤）
 */
export function useBatchExtendByExperiment() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: BatchExtendByExperimentRequest) => {
      return postApiTeacherProceduresExtensionsByExperiment({
        body: data,
        client,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'procedures', 'extensions'],
      })
    },
  })
}

/**
 * 更新延长记录
 */
export function useUpdateExtension() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: { id: number; extendedMinutes: number }) => {
      return putApiTeacherProceduresExtensionsId({
        client,
        path: { id: params.id },
        query: { extendedMinutes: params.extendedMinutes },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'procedures', 'extensions'],
      })
    },
  })
}

/**
 * 删除延长记录
 */
export function useDeleteExtension() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => {
      return deleteApiTeacherProceduresExtensionsId({
        client,
        path: { id },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'procedures', 'extensions'],
      })
    },
  })
}
