import { type Ref, toValue, computed, ref } from 'vue'
import { postApiTeacherClassByClassCodeStudents } from '@/core/api/generated'
import { useQuery } from '@tanstack/vue-query'
import client from '@/core/api/config'

/**
 * 查询班级学生列表
 *
 * @param classCode - 班级代码
 * @param initial - 初始分页参数
 * @returns 学生列表查询结果
 */
export function useQueryStudentList(
  classCode: Ref<string>,
  initial: { current?: number; size?: number },
) {
  const current = ref(initial.current || 1)
  const size = ref(initial.size || 10)
  const searchKeyword = ref<string>('')

  const query = useQuery({
    queryKey: computed(() => [
      'student-list',
      toValue(classCode),
      current.value,
      size.value,
      searchKeyword.value,
    ]),
    queryFn: () =>
      postApiTeacherClassByClassCodeStudents({
        path: { classCode: toValue(classCode) },
        body: {
          current: current.value,
          size: size.value,
          studentUsername: searchKeyword.value || undefined,
        },
        client, // ✅ 传入自定义 client
      }),
    select: (response) => ({
      records: response.data?.data?.records || [],
      total: response.data?.data?.total || 0,
    }),
    enabled:computed(()=>Boolean(toValue(classCode)))
  })

  return {
    current,
    size,
    searchKeyword,
    students: computed(() => query.data.value?.records || []),
    total: computed(() => query.data.value?.total || 0),
    isLoading: query.isLoading,
    query,
  }
}
