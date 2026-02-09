/**
 * 类型定义统一导出
 */

import type {
  ClassWithExperimentsResponse,
  ExperimentInfo,
} from "@/core/api/generated";

export * from "./grade";
export type ClassCode = ClassWithExperimentsResponse["classCode"];
export type ClassName = ClassWithExperimentsResponse["className"];
export type ClassExperimentId = ExperimentInfo["classExperimentId"];

export type ExperimentId = ExperimentInfo["experimentId"];
