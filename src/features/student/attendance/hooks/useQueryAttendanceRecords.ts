import {
  getApiStudentAttendanceRecords,
  getApiStudentAttendanceStats,
} from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 查询签到记录列表
 */
export function useQueryAttendanceRecords() {
  const query = useQuery({
    queryKey: ['student-attendance-records'],
    queryFn: () =>
      getApiStudentAttendanceRecords({
        client,
      }),
    select: (response) => response.data?.data ?? [],
  })

  return {
    records: query.data,
    query,
  }
}

/**
 * 查询签到统计
 */
export function useQueryAttendanceStats() {
  const query = useQuery({
    queryKey: ['student-attendance-stats'],
    queryFn: () =>
      getApiStudentAttendanceStats({
        client,
      }),
    select: (response) => response.data?.data,
  })

  return {
    stats: query.data,
    query,
  }
}
