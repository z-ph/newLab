import {
  postApiTeacherProceduresVideo,
  putApiTeacherProceduresVideo,
  postApiTeacherProceduresVideoInsert,
  deleteApiTeacherProceduresByProcedureId,
} from "@/core/api/generated";
import type { GetFirstParamsType } from "@/core/utils/typeUtils";
import { useMutation } from "@tanstack/vue-query";
import client from "@/core/api/config";

/**
 * 创建视频步骤
 */
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

/**
 * 更新视频步骤
 */
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

/**
 * 插入视频步骤到实验
 */
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

/**
 * 删除视频步骤
 */
export function useDeleteVideoProcedure() {
  return useMutation({
    mutationFn: async (params: GetFirstParamsType<typeof deleteApiTeacherProceduresByProcedureId>) => {
      const response = await deleteApiTeacherProceduresByProcedureId({
        ...params,
        client,
      });
      return response.data?.data;
    },
  });
}
