import {
  postApiTeacherProceduresVideo,
  putApiTeacherProceduresVideo,
  postApiTeacherProceduresDataCollection,
  putApiTeacherProceduresDataCollection,
  postApiTeacherProceduresTopic,
  putApiTeacherProceduresTopic,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

// ==================== 视频步骤 ====================
export function useCreateVideoProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherProceduresVideo>) => {
      const response = await postApiTeacherProceduresVideo({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useUpdateVideoProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherProceduresVideo>) => {
      const response = await putApiTeacherProceduresVideo({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

// ==================== 数据采集步骤 ====================
export function useCreateDataCollectionProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherProceduresDataCollection>) => {
      const response = await postApiTeacherProceduresDataCollection({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useUpdateDataCollectionProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherProceduresDataCollection>) => {
      const response = await putApiTeacherProceduresDataCollection({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

// ==================== 主题答题步骤 ====================
export function useCreateTopicProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof postApiTeacherProceduresTopic>) => {
      const response = await postApiTeacherProceduresTopic({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}

export function useUpdateTopicProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof putApiTeacherProceduresTopic>) => {
      const response = await putApiTeacherProceduresTopic({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
