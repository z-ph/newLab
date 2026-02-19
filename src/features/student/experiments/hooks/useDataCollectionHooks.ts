/**
 * 数据采集步骤 Hooks
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { computed } from 'vue'
import {
  postApiStudentProcedureSubmissionsDataCollectionComplete,
  putApiStudentProcedureSubmissionsDataCollectionUpdate,
  getApiStudentProcedureSubmissions,
} from '@/core/api/generated'
import type {
  PostApiStudentProcedureSubmissionsDataCollectionCompleteData,
  PutApiStudentProcedureSubmissionsDataCollectionUpdateData,
} from '@/core/api/generated'
import client from '@/core/api/config'
import { toast } from '@/core/utils/toast'
import type { DataCollectionSubmitParams } from '../utils/dataCollection'

/**
 * 完成数据采集
 */
export function useSubmitDataCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      procedureId: number
      classCode: string
      data: DataCollectionSubmitParams
    }) => {
      const body: PostApiStudentProcedureSubmissionsDataCollectionCompleteData['body'] = {}
      if (params.data.photos) body.photos = params.data.photos
      if (params.data.documents) body.documents = params.data.documents

      return postApiStudentProcedureSubmissionsDataCollectionComplete({
        body: Object.keys(body).length > 0 ? body : undefined,
        query: {
          procedureId: params.procedureId,
          classCode: params.classCode,
          fillBlankAnswers: params.data.fillBlankAnswers,
          tableCellAnswers: params.data.tableCellAnswers,
        },
        client,
      })
    },
    onSuccess: () => {
      toast.success('数据采集已完成')
      queryClient.invalidateQueries({ queryKey: ['student-experiment-detail'] })
      queryClient.invalidateQueries({ queryKey: ['student-procedure-submissions'] })
    },
  })
}

/**
 * 更新数据采集答案
 */
export function useUpdateDataCollection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (params: {
      procedureId: number
      classCode: string
      data: DataCollectionSubmitParams
    }) => {
      const body: PutApiStudentProcedureSubmissionsDataCollectionUpdateData['body'] = {}
      if (params.data.photos) body.photos = params.data.photos
      if (params.data.documents) body.documents = params.data.documents

      return putApiStudentProcedureSubmissionsDataCollectionUpdate({
        body: Object.keys(body).length > 0 ? body : undefined,
        query: {
          procedureId: params.procedureId,
          classCode: params.classCode,
          fillBlankAnswers: params.data.fillBlankAnswers,
          tableCellAnswers: params.data.tableCellAnswers,
        },
        client,
      })
    },
    onSuccess: () => {
      toast.success('数据采集已更新')
      queryClient.invalidateQueries({ queryKey: ['student-experiment-detail'] })
      queryClient.invalidateQueries({ queryKey: ['student-procedure-submissions'] })
    },
  })
}

/**
 * 查询学生提交的步骤列表
 */
export function useQueryStudentProcedureSubmissions(experimentId?: Ref<number | undefined>) {
  return useQuery({
    queryKey: ['student-procedure-submissions', experimentId],
    queryFn: () => getApiStudentProcedureSubmissions({
      query: experimentId?.value
        ? { experimentId: String(experimentId.value) }
        : undefined,
      client,
    }),
    select: (res) => res.data?.data ?? [],
    enabled: experimentId ? computed(() => !!experimentId.value) : undefined,
  })
}
