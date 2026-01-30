/**
 * Token 存储的键名
 */
const TOKEN_KEY = 'token'

/**
 * Token Payload 接口
 */
export interface TokenPayload {
  /** 用户 ID */
  sub?: string
  /** 签发时间 */
  iat?: number
  /** 过期时间 */
  exp?: number
  /** 用户名 */
  username?: string
  /** 用户角色 */
  role?: string
  /** 其他自定义字段 */
  [key: string]: unknown
}

/**
 * Token 管理器静态类
 *
 * 提供 Token 的增删改查、解析和过期验证功能
 */
export class TokenManager {
  /**
   * 私有构造函数，防止实例化
   */
  private constructor() {}

  /**
   * 保存/更新 Token
   * @param token - JWT token 字符串，为 null 时会移除 token
   */
  static setToken(token: string | null): void {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  /**
   * 获取当前存储的 Token
   * @returns Token 字符串，不存在时返回 null
   */
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
  }

  /**
   * 移除当前存储的 Token
   */
  static removeToken(): void {
    localStorage.removeItem(TOKEN_KEY)
  }

  /**
   * 更新 Token（setToken 的别名）
   * @param token - 新的 JWT token 字符串
   */
  static updateToken(token: string): void {
    TokenManager.setToken(token)
  }

  /**
   * 检查是否存在 Token
   * @returns 是否存在有效的 Token 字符串
   */
  static hasToken(): boolean {
    const token = TokenManager.getToken()
    return token !== null && token.trim().length > 0
  }

  /**
   * 解析 Token 的 Payload
   * @param token - JWT token 字符串，默认使用当前存储的 token
   * @returns 解析后的 Payload 对象，失败时返回 null
   */
  static parsePayload(token?: string): TokenPayload | null {
    const targetToken = token ?? TokenManager.getToken()

    if (!targetToken) {
      return null
    }

    try {
      // JWT 格式: header.payload.signature
      const parts = targetToken.split('.')

      if (parts.length !== 3) {
        return null
      }

      // 解码 Base64URL 格式的 payload
      const base64Url = parts[1]!
      // 将 Base64URL 转换为 Base64
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      // 补全 padding
      const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')

      // 解码并解析 JSON
      const decoded = atob(paddedBase64)
      const payload = JSON.parse(decoded) as TokenPayload

      return payload
    } catch {
      return null
    }
  }

  /**
   * 获取 Token Payload 中的指定字段
   * @param key - Payload 字段名
   * @param token - JWT token 字符串，默认使用当前存储的 token
   * @returns 字段值，不存在时返回 undefined
   */
  static getPayloadField<K extends keyof TokenPayload>(
    key: K,
    token?: string
  ): TokenPayload[K] | undefined {
    const payload = TokenManager.parsePayload(token)
    return payload?.[key]
  }

  /**
   * 判断 Token 是否已过期
   * @param token - JWT token 字符串，默认使用当前存储的 token
   * @returns true 表示已过期或无效，false 表示有效
   */
  static isExpired(token?: string): boolean {
    const payload = TokenManager.parsePayload(token)

    if (!payload || !payload.exp) {
      // 没有 exp 字段的 token 视为无效
      return true
    }

    // exp 是秒级时间戳，Date.now() 是毫秒
    const now = Math.floor(Date.now() / 1000)
    return payload.exp < now
  }

  /**
   * 获取 Token 的剩余有效时间（秒）
   * @param token - JWT token 字符串，默认使用当前存储的 token
   * @returns 剩余秒数，已过期或无效时返回 0
   */
  static getRemainingTime(token?: string): number {
    const payload = TokenManager.parsePayload(token)

    if (!payload || !payload.exp) {
      return 0
    }

    const now = Math.floor(Date.now() / 1000)
    const remaining = payload.exp - now

    return Math.max(0, remaining)
  }

  /**
   * 判断当前存储的 Token 是否有效
   * @returns true 表示有效，false 表示无效
   */
  static isValid(): boolean {
    if (!TokenManager.hasToken()) {
      return false
    }

    return !TokenManager.isExpired()
  }

  /**
   * 获取 Token 中的用户信息
   * @param token - JWT token 字符串，默认使用当前存储的 token
   * @returns 用户信息对象
   */
  static getUserInfo(token?: string): {
    userId?: string
    username?: string
    role?: string
    exp?: number
    iat?: number
  } | null {
    const payload = TokenManager.parsePayload(token)

    if (!payload) {
      return null
    }

    return {
      userId: payload.sub,
      username: payload.username,
      role: payload.role,
      exp: payload.exp,
      iat: payload.iat,
    }
  }
}
