import { postApiTeacherCoursesQuery, getApiTeacherCoursesById } from "@/core/api/generated";
import type { GetApiParamsTypeBase } from "@/core/utils/typeUtils";
import type { QueryOptions } from "@/features/shared/types/UseQueryOptions";
import { useQuery } from "@tanstack/vue-query";
import { computed, ref, type Ref } from "vue";
import client from "@/core/api/config";

/**
 * 课程查询基础 hook
 */
export default function useQueryCourseBase(
  queryParams: GetApiParamsTypeBase<typeof postApiTeacherCoursesQuery, "body">,
  options: QueryOptions,
) {
  return useQuery({
    queryKey: options.queryKey,
    queryFn: () =>
      postApiTeacherCoursesQuery({
        body: queryParams,
        client,
      }),
    select: (res) => res.data?.data,
  });
}

/**
 * 查询所有课程（不分页）
 */
export function useQueryCourseAll() {
  const query = useQueryCourseBase(
    {
      pageable:false
    },
    {
      queryKey: ["courses-all"],
    },
  );
  return { query };
}

/**
 * 分页查询课程
 */
export function useQueryCoursePage(initial: {
  current?: number;
  size?: number;
}) {
  const current = ref(initial.current || 1);
  const size = ref(initial.size || 20);
  const query = useQueryCourseBase(
    {
      current: current.value,
      size: size.value,
    },
    {
      queryKey: computed(() => ["courses-page", current.value, size.value]),
    },
  );
  return {
    current,
    size,
    query,
  };
}

/**
 * 根据课程ID查询课程详情
 */
export function useQueryCourseById(
  courseId: number | Ref<number>,
  options?: Partial<QueryOptions>,
) {
  return useQuery({
    queryKey: options?.queryKey || ["courses", courseId],
    queryFn: () =>
      getApiTeacherCoursesById({
        path: { id: typeof courseId === 'number' ? courseId : courseId.value },
        client,
      }),
    select: (res) => res.data?.data,
    enabled: options?.enable,
  });
}
