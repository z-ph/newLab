/**
 * 获取标签类型名称
 *
 * @param type - 标签类型值（"1": 学科, "2": 难度, "4": 自定义）
 * @returns 标签类型的中文名称
 */
export function getTagTypeName(type?: string): string {
  const typeMap: Record<string, string> = {
    '1': '学科标签',
    '2': '难度标签',
    '4': '自定义标签',
  }
  return typeMap[type || ''] || '未知'
}

/**
 * 获取标签颜色（用于 PrimeVue Tag 组件）
 *
 * @param type - 标签类型值
 * @returns PrimeVue Tag 的 severity 属性值
 */
export function getTagSeverity(
  type?: string,
): 'success' | 'warn' | 'contrast' | undefined {
  const severityMap: Record<string, 'success' | 'warn' | 'contrast'> = {
    '1': 'success',
    '2': 'warn',
    '4': 'contrast',
  }
  return severityMap[type || '']
}
