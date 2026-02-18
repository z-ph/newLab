import { type Ref, computed, ref, unref } from 'vue'
import { useQueryStudentExperimentDetail } from './useQueryStudentExperimentDetail'
import type { StudentProcedureDetailResponse, StudentExperimentDetailResponse } from '@/core/api/generated'

/**
 * 从实验详情中获取单个步骤详情
 * 注意：需要确保 classCode 参数正确传入，以便获取完整的实验详情
 */
export function useQueryProcedureDetail(
  stepId: Ref<number>,
  options?: {
    experimentId?: Ref<number | undefined>
    classCode?: Ref<string | undefined>
  }
) {
  // 如果提供了 experimentId 和 classCode，则查询实验详情
  const { experimentDetail } = options?.experimentId && options?.classCode
    ? useQueryStudentExperimentDetail(
        options.experimentId as Ref<number>,
        options.classCode as Ref<string>
      )
    : { experimentDetail: ref<StudentExperimentDetailResponse | undefined>(undefined) }

  // 从步骤列表中查找对应的步骤
  const procedureDetail = computed(() => {
    if (!experimentDetail.value?.procedures) return undefined

    return experimentDetail.value.procedures.find(
      (step: StudentProcedureDetailResponse) => step.id === unref(stepId)
    )
  })

  return {
    procedureDetail,
    experimentDetail,
  }
}
