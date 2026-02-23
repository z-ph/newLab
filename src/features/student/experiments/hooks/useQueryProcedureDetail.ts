import { type Ref, computed, ref, unref } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { useQueryStudentExperimentDetail } from './useQueryStudentExperimentDetail'
import {
  getApiStudentProcedureSubmissionsCompleted,
  getApiStudentProcedureSubmissionsUncompleted,
} from '@/core/api/generated'
import type {
  StudentProcedureDetailResponse,
  StudentExperimentDetailResponse,
  StudentProcedureDetailWithAnswerResponse,
  StudentProcedureDetailWithoutAnswerResponse,
  TopicItem1,
} from '@/core/api/generated'
import client from '@/core/api/config'

/**
 * 合并基本信息和详细信息
 */
type MergedProcedureDetail = StudentProcedureDetailResponse & {
  topicDetail?: StudentProcedureDetailWithAnswerResponse['topicDetail'] | StudentProcedureDetailWithoutAnswerResponse['topicDetail']
  dataCollectionDetail?: StudentProcedureDetailWithAnswerResponse['dataCollectionDetail'] | StudentProcedureDetailWithoutAnswerResponse['dataCollectionDetail']
  videoDetail?: StudentProcedureDetailWithAnswerResponse['videoDetail'] | StudentProcedureDetailWithoutAnswerResponse['videoDetail']
  timedQuizDetail?: StudentProcedureDetailWithAnswerResponse['timedQuizDetail'] | StudentProcedureDetailWithoutAnswerResponse['timedQuizDetail']
  isModifiable?: boolean
  notModifiableReason?: string
  teacherComment?: string
  isAfterEndTime?: boolean
}

/**
 * 从实验详情中获取单个步骤详情
 * 根据步骤完成状态自动调用对应的 API 获取完整题目信息：
 * - 未完成：使用 /api/student/procedure-submissions/uncompleted
 * - 已完成：使用 /api/student/procedure-submissions/completed
 */
export function useQueryProcedureDetail(
  stepId: Ref<number>,
  options?: {
    courseId?: Ref<string | undefined>
    experimentId?: Ref<number | undefined>
    classCode?: Ref<string | undefined>
  }
) {
  // 获取实验详情（基本信息，包含 isCompleted, isAccessible 等）
  const { experimentDetail, query: experimentQuery } = options?.experimentId && options?.classCode
    ? useQueryStudentExperimentDetail(
        options.experimentId as Ref<number>,
        options.classCode as Ref<string>
      )
    : { experimentDetail: ref<StudentExperimentDetailResponse | undefined>(undefined), query: { isLoading: ref(false) } }

  // 从步骤列表中查找对应的步骤基本信息
  const basicProcedureDetail = computed(() => {
    if (!experimentDetail.value?.procedures) return undefined

    return experimentDetail.value.procedures.find(
      (step: StudentProcedureDetailResponse) => step.id === unref(stepId)
    )
  })

  // 是否已完成（必须在 basicProcedureDetail 存在时才能确定）
  const isCompleted = computed(() => basicProcedureDetail.value?.isCompleted ?? false)

  // 是否可访问
  const isAccessible = computed(() => basicProcedureDetail.value?.isAccessible ?? true)

  // 是否已获取到步骤基本信息（确保 experimentDetail 已加载且能找到对应步骤）
  const hasBasicDetail = computed(() => basicProcedureDetail.value !== undefined)

  // 查询未完成的步骤详情
  const uncompletedQuery = useQuery({
    queryKey: computed(() => [
      'student-procedure-uncompleted',
      unref(options?.courseId),
      unref(options?.experimentId),
      unref(stepId),
    ]),
    queryFn: () =>
      getApiStudentProcedureSubmissionsUncompleted({
        query: {
          courseId: unref(options?.courseId)!,
          experimentId: unref(options?.experimentId)!,
          procedureId: unref(stepId),
        },
        client,
      }),
    select: (response) => response.data?.data,
    enabled: computed(
      () =>
        !!unref(options?.courseId) &&
        !!unref(options?.experimentId) &&
        !!unref(stepId) &&
        hasBasicDetail.value &&
        isAccessible.value &&
        !isCompleted.value
    ),
  })

  // 查询已完成的步骤详情
  const completedQuery = useQuery({
    queryKey: computed(() => [
      'student-procedure-completed',
      unref(options?.courseId),
      unref(options?.experimentId),
      unref(stepId),
    ]),
    queryFn: () =>
      getApiStudentProcedureSubmissionsCompleted({
        query: {
          courseId: unref(options?.courseId)!,
          experimentId: unref(options?.experimentId)!,
          procedureId: unref(stepId),
        },
        client,
      }),
    select: (response) => response.data?.data,
    enabled: computed(
      () =>
        !!unref(options?.courseId) &&
        !!unref(options?.experimentId) &&
        !!unref(stepId) &&
        hasBasicDetail.value &&
        isAccessible.value &&
        isCompleted.value
    ),
  })

  // 合并基本信息和详细信息
  const procedureDetail = computed<MergedProcedureDetail | undefined>(() => {
    const basic = basicProcedureDetail.value
    if (!basic) return undefined

    // 如果没有提供 courseId，只返回基本信息
    if (!unref(options?.courseId)) {
      return basic
    }

    // 根据完成状态获取详细信息
    const detailData = isCompleted.value
      ? completedQuery.data.value
      : uncompletedQuery.data.value

    if (!detailData) {
      // 详细信息还在加载，返回基本信息
      return basic
    }

    // 合并基本信息和详细信息
    return {
      ...basic,
      // 从详细 API 获取的字段
      topicDetail: detailData.topicDetail,
      dataCollectionDetail: detailData.dataCollectionDetail,
      videoDetail: detailData.videoDetail,
      timedQuizDetail: detailData.timedQuizDetail,
      // 已完成状态特有的字段
      ...(isCompleted.value && {
        isModifiable: (detailData as StudentProcedureDetailWithAnswerResponse).isModifiable,
        notModifiableReason: (detailData as StudentProcedureDetailWithAnswerResponse).notModifiableReason,
        teacherComment: (detailData as StudentProcedureDetailWithAnswerResponse).teacherComment,
        isAfterEndTime: (detailData as StudentProcedureDetailWithAnswerResponse).isAfterEndTime,
      }),
    }
  })

  // 提取 topics 用于题目步骤
  const topics = computed<TopicItem1[]>(() => {
    const detail = procedureDetail.value
    if (!detail) return []

    // 优先使用 topicDetail（题库答题类型3）
    if (detail.topicDetail?.topics) {
      return detail.topicDetail.topics as TopicItem1[]
    }

    // 限时答题类型5
    if (detail.timedQuizDetail?.topics) {
      return detail.timedQuizDetail.topics as TopicItem1[]
    }

    return []
  })

  return {
    procedureDetail,
    experimentDetail,
    topics,
    // 暴露查询状态（综合加载状态：实验详情加载中 或 步骤详情加载中）
    isLoadingDetail: computed(
      () => experimentQuery.isLoading.value || uncompletedQuery.isLoading.value || completedQuery.isLoading.value
    ),
  }
}
