import { type Ref } from 'vue'
import type { ProcedureSubmissionResponse } from '@/core/api/generated'
import { useGroupByAggregate } from '@/features/shared/hooks'

/**
 * 学生汇总信息（前端计算字段）
 * 基于 API 类型 ProcedureSubmissionResponse 派生
 */
export type StudentSummary = Pick<ProcedureSubmissionResponse, 'studentUsername' | 'studentName'> & {
  submissionCount: number
}

/**
 * 从提交记录中提取唯一学生列表
 *
 * @param submissions 提交记录列表（ref）
 * @returns 学生汇总列表（按姓名排序）
 *
 * @example
 * ```ts
 * const students = useQueryStudentSubmissions(courseId)
 * const studentsList = useStudentList(students.data)
 * ```
 */
export function useStudentList(submissions: Ref<ProcedureSubmissionResponse[] | undefined>) {
  return useGroupByAggregate(submissions, {
    keySelector: (item) => item.studentUsername ?? undefined,
    seed: (key, item) => ({
      studentUsername: key,
      studentName: item.studentName || key,
      submissionCount: 1,
    }),
    aggregator: (current) => ({
      ...current,
      submissionCount: current.submissionCount + 1,
    }),
    sortComparator: (a, b) =>
      (a.studentName || '').localeCompare(b.studentName || '', 'zh-CN'),
  })
}
