import type { ClassExperimentMapResponse } from "@/core/api/generated";
import { getApiTeacherExperimentsByClassByClassCode } from "@/core/api/generated";
import client from "@/core/api/config";
import { useQuery } from "@tanstack/vue-query";
import { type Ref, unref, computed } from "vue";

/**
 * 查询指定班级的实验列表，按课程分组返回
 */
export function useQueryClassExperimentsGroupedByCourse(
  classCode: Ref<string | undefined>,
) {
  const query = useQuery({
    queryKey: computed(() => ["class-experiments-grouped", unref(classCode)]),
    queryFn: () => getApiTeacherExperimentsByClassByClassCode({
      path: {
        classCode: unref(classCode) || "",
      },
      client,
    }),
    select: (response) => response.data?.data, // ✅ 必须使用 select 提取数据
    enabled: computed(() => !!unref(classCode)),
  });

  return {
    query,
  };
}

/**
 * 将 ClassExperimentMapResponse 转换为数组格式
 * 在组件中使用此工具函数处理数据
 */
export function toCourseGroups(
  data: ClassExperimentMapResponse | undefined,
) {
  const courseExperiments = data?.courseExperiments;
  if (!courseExperiments) return [];

  return Object.entries(courseExperiments).map(([courseId, value]) => ({
    courseId,
    courseCode: value?.courseCode,
    courseInfo: value?.detail?.courseInfo,
    experiments: value?.detail?.experiments || [],
  }));
}

