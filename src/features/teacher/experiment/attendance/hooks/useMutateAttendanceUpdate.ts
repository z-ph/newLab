/**
 * 更新签到状态 Hook
 */

import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { postApiTeacherAttendanceUpdate } from '@/core/api/generated'
import type { UpdateAttendanceRequest } from '@/core/api/generated'

export function useUpdateAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateAttendanceRequest) => {
      return postApiTeacherAttendanceUpdate({
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'attendance'],
      })
    },
  })
}

export function useUpdateAttendanceSuccess() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: UpdateAttendanceRequest) => {
      return postApiTeacherAttendanceUpdate({
        body: data,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['teacher', 'attendance'],
      })
    },
  })
}


