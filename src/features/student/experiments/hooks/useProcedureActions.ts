import {
  postApiStudentProcedureSubmissionsVideoProcedureidViewed,
  postApiStudentProcedureSubmissionsTopicComplete,
  postApiStudentProcedureSubmissionsDataCollectionComplete,
} from "@/core/api/generated";
import client from "@/core/api/config";
import { useMutation } from "@tanstack/vue-query";
import { toast } from "@/core/utils/toast";
import type { ClassCode } from "@/features/teacher/class-experiment";

/**
 * 标记视频已观看
 */
export function useMarkVideoViewed() {
  return useMutation({
    mutationFn: (params: {
      procedureId: number;
      classCode: NonNullable<ClassCode>;
    }) =>
      postApiStudentProcedureSubmissionsVideoProcedureidViewed({
        path: { procedureId: params.procedureId },
        query: { classCode: params.classCode },
        client,
      }),
    onSuccess: () => {
      toast.success("视频观看记录已更新");
    },
  });
}

/**
 * 完成题目
 */
export function useCompleteTopic() {
  return useMutation({
    mutationFn: (data: any) =>
      postApiStudentProcedureSubmissionsTopicComplete({
        body: data,
        client,
      }),
    onSuccess: () => {
      toast.success("题目已完成");
    },
  });
}

/**
 * 完成数据采集
 */
export function useCompleteDataCollection() {
  return useMutation({
    mutationFn: (params: {
      body: any;
      procedureId: number;
      classCode: string;
      fillBlankAnswers?: string;
      tableCellAnswers?: string;
    }) =>
      postApiStudentProcedureSubmissionsDataCollectionComplete({
        body: params.body,
        query: {
          procedureId: params.procedureId,
          classCode: params.classCode,
          fillBlankAnswers: params.fillBlankAnswers,
          tableCellAnswers: params.tableCellAnswers,
        },
        client,
      }),
    onSuccess: () => {
      toast.success("数据采集已完成");
    },
  });
}
