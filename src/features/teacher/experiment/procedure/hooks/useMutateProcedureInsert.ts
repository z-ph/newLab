import {
  postApiTeacherProceduresVideoInsert,
  postApiTeacherProceduresDataCollectionInsert,
  postApiTeacherProceduresTopicInsert,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

// ==================== 插入视频步骤 ====================
export function useInsertVideoProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherProceduresVideoInsert>) => {
      const response = await postApiTeacherProceduresVideoInsert({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

// ==================== 插入数据采集步骤 ====================
export function useInsertDataCollectionProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherProceduresDataCollectionInsert>) => {
      const response = await postApiTeacherProceduresDataCollectionInsert({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

// ==================== 插入主题答题步骤 ====================
export function useInsertTopicProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherProceduresTopicInsert>) => {
      const response = await postApiTeacherProceduresTopicInsert({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
