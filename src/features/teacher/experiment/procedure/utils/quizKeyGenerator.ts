/**
 * 限时答题密钥生成器
 *
 * 用于生成和验证限时答题步骤的唯一访问密钥
 *
 * 功能：
 * - 生成唯一访问密钥（基于学生、班级实验、步骤的组合）
 * - 验证密钥有效性
 * - 从密钥中提取信息
 */

import { TIME_UNITS } from '../constants'

/**
 * 密钥组成部分接口
 */
export interface QuizKeyComponents {
  /** 学生ID */
  studentId: number
  /** 班级实验ID */
  classExperimentId: number
  /** 步骤ID */
  procedureId: number
  /** 开始答题时间戳 */
  startTimestamp: number
}

/**
 * 限时答题密钥生成器
 *
 * 密钥格式（Base64编码）：
 * {
 *   "v": 1,                    // 版本号
 *   "s": studentId,            // 学生ID
 *   "c": classExperimentId,    // 班级实验ID
 *   "p": procedureId,          // 步骤ID
 *   "t": startTimestamp,       // 开始时间戳
 *   "h": hash                  // 校验码（简单校验）
 * }
 */
export class TimedQuizKeyGenerator {
  /** 密钥版本 */
  private static readonly KEY_VERSION = 1

  /** 密钥前缀 */
  private static readonly KEY_PREFIX = 'TQK'

  /**
   * 生成限时答题密钥
   *
   * @param studentId - 学生ID
   * @param classExperimentId - 班级实验ID
   * @param procedureId - 步骤ID
   * @param startTimestamp - 开始答题时间戳（默认为当前时间）
   * @returns Base64编码的密钥字符串
   */
  static generateKey(
    studentId: number,
    classExperimentId: number,
    procedureId: number,
    startTimestamp: number = Date.now()
  ): string {
    const payload = {
      v: this.KEY_VERSION,
      s: studentId,
      c: classExperimentId,
      p: procedureId,
      t: startTimestamp,
      h: this.calculateHash(studentId, classExperimentId, procedureId, startTimestamp),
    }

    const json = JSON.stringify(payload)
    const base64 = btoa(json)
    return `${this.KEY_PREFIX}${base64}`
  }

  /**
   * 解析密钥
   *
   * @param key - 密钥字符串
   * @returns 解析后的密钥组成部分，如果密钥无效则返回 null
   */
  static parseKey(key: string): QuizKeyComponents | null {
    try {
      // 验证前缀
      if (!key.startsWith(this.KEY_PREFIX)) {
        return null
      }

      // 移除前缀并解码
      const base64 = key.slice(this.KEY_PREFIX.length)
      const json = atob(base64)
      const payload = JSON.parse(json)

      // 验证版本
      if (payload.v !== this.KEY_VERSION) {
        return null
      }

      // 验证必需字段
      if (
        typeof payload.s !== 'number' ||
        typeof payload.c !== 'number' ||
        typeof payload.p !== 'number' ||
        typeof payload.t !== 'number'
      ) {
        return null
      }

      // 验证校验码
      const expectedHash = this.calculateHash(payload.s, payload.c, payload.p, payload.t)
      if (payload.h !== expectedHash) {
        return null
      }

      return {
        studentId: payload.s,
        classExperimentId: payload.c,
        procedureId: payload.p,
        startTimestamp: payload.t,
      }
    } catch {
      return null
    }
  }

  /**
   * 验证密钥是否有效
   *
   * @param key - 密钥字符串
   * @param expectedStudentId - 期望的学生ID
   * @param expectedClassExperimentId - 期望的班级实验ID
   * @param expectedProcedureId - 期望的步骤ID
   * @param timeLimitMinutes - 答题时间限制（分钟），用于验证是否超时
   * @returns 是否有效
   */
  static validateKey(
    key: string,
    expectedStudentId: number,
    expectedClassExperimentId: number,
    expectedProcedureId: number,
    timeLimitMinutes?: number
  ): boolean {
    const components = this.parseKey(key)
    if (!components) {
      return false
    }

    // 验证ID匹配
    if (
      components.studentId !== expectedStudentId ||
      components.classExperimentId !== expectedClassExperimentId ||
      components.procedureId !== expectedProcedureId
    ) {
      return false
    }

    // 验证时间限制
    if (timeLimitMinutes !== undefined) {
      const elapsedMinutes = (Date.now() - components.startTimestamp) / TIME_UNITS.MINUTE_TO_MS
      if (elapsedMinutes > timeLimitMinutes) {
        return false
      }
    }

    return true
  }

  /**
   * 检查密钥是否过期
   *
   * @param key - 密钥字符串
   * @param timeLimitMinutes - 答题时间限制（分钟）
   * @returns 是否过期
   */
  static isExpired(key: string, timeLimitMinutes: number): boolean {
    const components = this.parseKey(key)
    if (!components) {
      return true
    }

    const elapsedMinutes = (Date.now() - components.startTimestamp) / TIME_UNITS.MINUTE_TO_MS
    return elapsedMinutes > timeLimitMinutes
  }

  /**
   * 获取密钥剩余时间（分钟）
   *
   * @param key - 密钥字符串
   * @param timeLimitMinutes - 答题时间限制（分钟）
   * @returns 剩余分钟数，如果密钥无效或已过期则返回 0
   */
  static getRemainingMinutes(key: string, timeLimitMinutes: number): number {
    const components = this.parseKey(key)
    if (!components) {
      return 0
    }

    const elapsedMinutes = (Date.now() - components.startTimestamp) / TIME_UNITS.MINUTE_TO_MS
    const remaining = timeLimitMinutes - elapsedMinutes
    return Math.max(0, Math.floor(remaining))
  }

  /**
   * 计算简单校验码
   *
   * @param studentId - 学生ID
   * @param classExperimentId - 班级实验ID
   * @param procedureId - 步骤ID
   * @param timestamp - 时间戳
   * @returns 校验码
   */
  private static calculateHash(
    studentId: number,
    classExperimentId: number,
    procedureId: number,
    timestamp: number
  ): number {
    // 简单的异或校验码
    const sum = studentId ^ classExperimentId ^ procedureId ^ Math.floor(timestamp / 1000)
    return sum & 0xffffffff // 确保是32位整数
  }

  /**
   * 生成示例密钥（用于测试）
   *
   * @returns 示例密钥
   */
  static generateExampleKey(): string {
    return this.generateKey(1, 100, 1000, Date.now())
  }

  /**
   * 格式化密钥（添加分隔符，便于阅读）
   *
   * @param key - 密钥字符串
   * @param segmentLength - 每段长度（默认8）
   * @returns 格式化后的密钥
   */
  static formatKey(key: string, segmentLength: number = 8): string {
    const payload = key.slice(this.KEY_PREFIX.length)
    const segments: string[] = []

    for (let i = 0; i < payload.length; i += segmentLength) {
      segments.push(payload.slice(i, i + segmentLength))
    }

    return `${this.KEY_PREFIX}${segments.join('-')}`
  }

  /**
   * 从格式化密钥中提取原始密钥
   *
   * @param formattedKey - 格式化后的密钥
   * @returns 原始密钥
   */
  static unformatKey(formattedKey: string): string {
    return formattedKey.replace(/-/g, '')
  }
}
