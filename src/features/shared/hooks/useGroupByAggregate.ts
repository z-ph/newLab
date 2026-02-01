import { computed, type Ref } from 'vue'

/**
 * 分组聚合配置选项
 * @template TItem - 源数据项类型
 * @template TKey - 分组键类型
 * @template TAggregate - 聚合结果类型
 */
export interface GroupByAggregateOptions<TItem, TKey extends string, TAggregate> {
  /** 从数据项中提取分组键（返回 undefined 则跳过该项） */
  keySelector: (item: TItem) => TKey | undefined
  /** 初始化聚合值 */
  seed: (key: TKey, firstItem: TItem) => TAggregate
  /** 聚合函数（接收当前聚合值和下一项，返回新值） */
  aggregator: (current: TAggregate, nextItem: TItem, key: TKey) => TAggregate
  /** 排序函数（可选） */
  sortComparator?: (a: TAggregate, b: TAggregate) => number
}

/**
 * 通用的分组聚合 Hook
 *
 * @template TItem - 源数据项类型
 * @template TKey - 分组键类型
 * @template TAggregate - 聚合结果类型
 *
 * @param items 数据项列表（ref）
 * @param options 分组聚合配置
 * @returns 聚合后的列表（computed）
 *
 * @example
 * ```ts
 * // 按学生分组，统计提交次数
 * const students = useGroupByAggregate(submissions, {
 *   keySelector: (item) => item.studentUsername,
 *   seed: (key, item) => ({
 *     studentUsername: key,
 *     studentName: item.studentName || key,
 *     submissionCount: 1
 *   }),
 *   aggregator: (current, next) => ({
 *     ...current,
 *     submissionCount: current.submissionCount + 1
 *   }),
 *   sortComparator: (a, b) => a.studentName.localeCompare(b.studentName, 'zh-CN')
 * })
 *
 * // 按实验分组，统计平均分
 * const experiments = useGroupByAggregate(submissions, {
 *   keySelector: (item) => item.experimentId,
 *   seed: (key, item) => ({ experimentId: key, totalScore: item.score, count: 1 }),
 *   aggregator: (current, next) => ({
 *     ...current,
 *     totalScore: current.totalScore + next.score,
 *     count: current.count + 1
 *   })
 * })
 * ```
 */
export function useGroupByAggregate<
  TItem,
  TKey extends string,
  TAggregate extends Record<string, any>
>(
  items: Ref<TItem[] | undefined>,
  options: GroupByAggregateOptions<TItem, TKey, TAggregate>
): Ref<TAggregate[]> {
  const { keySelector, seed, aggregator, sortComparator } = options

  return computed<TAggregate[]>(() => {
    const records = items.value || []
    const groupMap = new Map<TKey, TAggregate>()

    records.forEach((item) => {
      const key = keySelector(item)

      // 跳过无效键（null 或 undefined）
      if (key == null) return

      const existing = groupMap.get(key)

      if (existing) {
        // 已存在分组：聚合
        groupMap.set(key, aggregator(existing, item, key))
      } else {
        // 首次遇到该键：初始化
        groupMap.set(key, seed(key, item))
      }
    })

    // 转换为数组
    let result = Array.from(groupMap.values())

    // 可选排序
    if (sortComparator) {
      result = result.sort(sortComparator)
    }

    return result
  })
}
