/**
 * 全局 Toast 服务
 * 用于在组件外部（如拦截器）显示消息提示
 */

import type { ToastMessageOptions } from 'primevue/toast'
import type { ToastServiceMethods } from 'primevue/toastservice'

let toastService: ToastServiceMethods | null = null

/**
 * 初始化全局 Toast 服务
 * 在 main.ts 中调用
 */
export function initToast(service: ToastServiceMethods) {
  toastService = service
}

/**
 * 显示消息
 */
export function showToast(options: ToastMessageOptions) {
  if (!toastService) {
    console.warn('Toast service not initialized. Call initToast() in main.ts')
    console.log('Toast:', options)
    return
  }
  toastService.add(options)
}

/**
 * 快捷方法
 */
export const toast = {
  success(detail: string, summary: string = '成功') {
    showToast({ severity: 'success', summary, detail, life: 3000 })
  },
  error(detail: string, summary: string = '错误') {
    showToast({ severity: 'error', summary, detail, life: 3000 })
  },
  warn(detail: string, summary: string = '提示') {
    showToast({ severity: 'warn', summary, detail, life: 3000 })
  },
  info(detail: string, summary: string = '信息') {
    showToast({ severity: 'info', summary, detail, life: 3000 })
  },
}
