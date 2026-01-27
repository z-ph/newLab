/**
 * 通用菜单类型
 */

/**
 * 菜单项配置
 */
export interface MenuItem {
  path: string
  name: string
  title: string
  icon: string
  children?: MenuItem[]
}
