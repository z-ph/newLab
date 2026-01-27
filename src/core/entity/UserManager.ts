/**
 * 用户信息存储的键名
 */
const USER_INFO_KEY = 'userInfo'

/**
 * 用户信息接口
 */
export interface UserInfo {
  /** 用户 ID */
  userId?: number
  /** 用户名 */
  username?: string
  /** 姓名 */
  name?: string
  /** 用户角色 */
  role?: string
}

/**
 * 用户信息管理器静态类
 *
 * 提供用户信息的增删改查功能
 */
export class UserManager {
  /**
   * 私有构造函数，防止实例化
   */
  private constructor() {}

  /**
   * 保存用户信息
   * @param userInfo - 用户信息对象，为 null 时会移除
   */
  static setUserInfo(userInfo: UserInfo | null): void {
    if (userInfo) {
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo))
    } else {
      localStorage.removeItem(USER_INFO_KEY)
    }
  }

  /**
   * 获取当前存储的用户信息
   * @returns 用户信息对象，不存在时返回 null
   */
  static getUserInfo(): UserInfo | null {
    const userInfoStr = localStorage.getItem(USER_INFO_KEY)
    if (!userInfoStr) {
      return null
    }

    try {
      return JSON.parse(userInfoStr) as UserInfo
    } catch {
      return null
    }
  }

  /**
   * 移除当前存储的用户信息
   */
  static removeUserInfo(): void {
    localStorage.removeItem(USER_INFO_KEY)
  }

  /**
   * 更新用户信息（setUserInfo 的别名）
   * @param userInfo - 新的用户信息对象
   */
  static updateUserInfo(userInfo: UserInfo): void {
    UserManager.setUserInfo(userInfo)
  }

  /**
   * 检查是否存在用户信息
   * @returns 是否存在有效的用户信息
   */
  static hasUserInfo(): boolean {
    return UserManager.getUserInfo() !== null
  }

  /**
   * 获取用户 ID
   * @returns 用户 ID，不存在时返回 undefined
   */
  static getUserId(): number | undefined {
    return UserManager.getUserInfo()?.userId
  }

  /**
   * 获取用户名
   * @returns 用户名，不存在时返回 undefined
   */
  static getUsername(): string | undefined {
    return UserManager.getUserInfo()?.username
  }

  /**
   * 获取姓名
   * @returns 姓名，不存在时返回 undefined
   */
  static getName(): string | undefined {
    return UserManager.getUserInfo()?.name
  }

  /**
   * 获取用户角色
   * @returns 用户角色，不存在时返回 undefined
   */
  static getRole(): string | undefined {
    return UserManager.getUserInfo()?.role
  }

  /**
   * 清除所有认证相关数据（Token 和用户信息）
   */
  static clearAuth(): void {
    UserManager.removeUserInfo()
  }

  /**
   * 判断当前用户是否是教师
   * @returns 是否是教师角色
   */
  static isTeacher(): boolean {
    return UserManager.getRole() === 'teacher'
  }

  /**
   * 判断当前用户是否是学生
   * @returns 是否是学生角色
   */
  static isStudent(): boolean {
    return UserManager.getRole() === 'student'
  }
}
