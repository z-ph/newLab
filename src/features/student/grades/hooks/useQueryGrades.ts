import { type Ref, unref, computed } from 'vue'
import { getApiStudentGrades, getApiStudentGradesGradeid } from '@/core/api/generated'
import client from '@/core/api/config'
import { useQuery } from '@tanstack/vue-query'

/**
 * 查询成绩列表
 */
export function useQueryGrades() {
  const query = useQuery({
    queryKey: ['student-grades'],
    queryFn: () =>
      getApiStudentGrades({
        client,
      }),
    select: (response) => response.data?.data ?? [],
  })

  return {
    grades: query.data,
    query,
  }
}

/**
 * 查询成绩详情
 */
export function useQueryGradeDetail(gradeId: Ref<number>) {
  const query = useQuery({
    queryKey: computed(() => ['student-grade-detail', unref(gradeId)]),
    queryFn: () =>
      getApiStudentGradesGradeid({
        path: { gradeId: unref(gradeId) },
        client,
      }),
    select: (response) => response.data?.data,
    enabled: computed(() => !!unref(gradeId)),
  })

  return {
    grade: query.data,
    query,
  }
}
