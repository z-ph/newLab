import { useBreakpoints } from '@vueuse/core'

const breakpoints = useBreakpoints({
  md: 768,
  lg: 1024,
})

/**
 * 全局移动端检测状态
 * 使用 VueUse 的 useBreakpoints 实现响应式断点检测
 */
export const isMobile = breakpoints.smaller('md')  // < 768px

/**
 * 判断是否为平板设备（768px - 1024px）
 */
export const isTablet = breakpoints.between('md', 'lg')

/**
 * 判断是否为桌面设备（>= 1024px）
 */
export const isDesktop = breakpoints.greaterOrEqual('lg')
