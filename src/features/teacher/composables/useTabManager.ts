import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'

/**
 * 标签页信息
 */
export interface TabInfo {
  key: string // fullPath，作为标签页的唯一标识
  title: string // 显示标题
  path: string // 完整路径
  closable: boolean // 主标签页=false，详情页=true
}

/**
 * 标签页管理系统
 *
 * 功能：
 * - 管理打开的标签页列表
 * - 提供打开/关闭/切换标签页方法
 * - 初始化主标签页（所有一级菜单）
 * - 标签页状态持久化（localStorage）
 */
export function useTabManager() {
  const router = useRouter()
  const route = useRoute()

  // 路由标题映射
  const routeTitles: Record<string, string> = {
    '/teacher/overview/': '概览',
    '/teacher/overview': '概览',
    '/teacher/courses/': '课程管理',
    '/teacher/courses': '课程管理',
    '/teacher/classes/': '班级管理',
    '/teacher/classes': '班级管理',
    '/teacher/classes/list': '班级列表',
    '/teacher/classes/create': '创建班级',
    '/teacher/experiments/': '实验模版管理',
    '/teacher/experiments': '实验模版管理',
    '/teacher/experiments/list': '实验列表',
    '/teacher/experiments/create': '创建实验',
    '/teacher/topics/': '题目管理',
    '/teacher/topics': '题目管理',
    '/teacher/topics/list': '题目列表',
    '/teacher/topics/create': '创建题目',
  }

  // 所有打开的标签页
  const tabs = ref<TabInfo[]>([])

  // 当前激活的标签页 key
  const activeTab = ref<string>('')

  // 从 localStorage 恢复标签页状态
  const loadTabs = () => {
    const saved = localStorage.getItem('teacher-tabs')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const savedTabs = parsed.tabs || []

        // 检查是否有不可关闭的标签页（旧数据）
        const hasUnclosableTabs = savedTabs.some((tab: TabInfo) => !tab.closable)

        if (hasUnclosableTabs) {
          // 清除旧数据，重新开始
          console.log('检测到旧的固定标签页数据，已清除')
          localStorage.removeItem('teacher-tabs')
          initMainTabs()
          return
        }

        // 恢复标签页，确保所有标签页都可关闭
        tabs.value = savedTabs.map((tab: TabInfo) => ({
          ...tab,
          closable: true,
        }))
        activeTab.value = parsed.activeTab || ''
      } catch {
        // 解析失败，初始化空标签页
        initMainTabs()
      }
    } else {
      // 无保存数据，初始化空标签页
      initMainTabs()
    }
  }

  // 保存标签页状态到 localStorage
  const saveTabs = () => {
    localStorage.setItem(
      'teacher-tabs',
      JSON.stringify({
        tabs: tabs.value,
        activeTab: activeTab.value,
      })
    )
  }

  // 监听标签页变化并自动保���
  watch([tabs, activeTab], () => {
    saveTabs()
  }, { deep: true })

  /**
   * 初始化主标签页（不预先添加任何标签页）
   */
  const initMainTabs = () => {
    tabs.value = []
    activeTab.value = ''
    saveTabs()
  }

  /**
   * 打开新标签页
   * @param title 标签页标题
   * @param closable 是否可关闭
   * @param path 路由路径（可选，默认使用当前路由）
   */
  const openTab = (title: string, closable: boolean, path?: string) => {
    const currentPath = path || router.currentRoute.value.fullPath
    const key = currentPath

    // 检查标签页是否已存在
    const existingTab = tabs.value.find((tab) => tab.key === key)
    if (existingTab) {
      // 标签页已存在，切换到该标签页
      switchTab(key)
      return
    }

    // 添加新标签页
    tabs.value.push({
      key,
      title,
      path: currentPath,
      closable,
    })

    // 切换到新标签页
    switchTab(key)
  }

  /**
   * 关闭标签页
   * @param key 标签页 key
   */
  const closeTab = (key: string) => {
    const index = tabs.value.findIndex((tab) => tab.key === key)
    if (index === -1) return

    const tab = tabs.value[index]
    if (tab && !tab.closable) return // 不可关闭的标签页

    // 移除标签页
    tabs.value.splice(index, 1)

    // 如果关闭的是当前激活的标签页，切换到相邻标签页
    if (activeTab.value === key) {
      if (tabs.value.length > 0) {
        // 优先切换到右侧标签页，如果没有则切换到左侧
        const newIndex = index >= tabs.value.length ? tabs.value.length - 1 : index
        const nextTab = tabs.value[newIndex]
        if (nextTab) {
          switchTab(nextTab.key)
        }
      }
    }
  }

  /**
   * 切换标签页
   * @param key 标签页 key
   */
  const switchTab = (key: string) => {
    const tab = tabs.value.find((t) => t.key === key)
    if (!tab) return

    activeTab.value = key

    // 如果当前路由不是目标路由，则导航
    if (router.currentRoute.value.fullPath !== tab.path) {
      router.push(tab.path)
    }
  }

  // 初始化
  loadTabs()

  // 监听路由变化，自动添加标签页
  watch(
    () => route.fullPath,
    (newPath) => {
      // 检查标签页是否已存在
      const existingTab = tabs.value.find((tab) => tab.key === newPath)
      if (existingTab) {
        // 标签页已存在，切换到该标签页
        if (activeTab.value !== newPath) {
          activeTab.value = newPath
        }
        return
      }

      // 根据路由路径确定标题
      let title = '页面'

      // 检查是否是一级菜单路由
      const matchedRoute = Object.keys(routeTitles).find((key) =>
        newPath === key || newPath.startsWith(key + '/')
      )

      if (matchedRoute) {
        title = routeTitles[matchedRoute] || '页面'
      } else {
        // 尝试从 query 参数获取 title（用于详情页）
        const queryTitle = route.query.title as string
        if (queryTitle) {
          title = decodeURIComponent(queryTitle)
        } else if (newPath.includes('/videos/')) {
          if (newPath.includes('/upload')) {
            title = '上传视频'
          } else if (newPath.includes('/list')) {
            title = '视频列表'
          } else if (newPath.includes('/detail')) {
            title = '视频详情'
          }
        }
      }

      // 添加新标签页（所有标签页都可关闭）
      tabs.value.push({
        key: newPath,
        title,
        path: newPath,
        closable: true,
      })

      // 切换到新标签页
      activeTab.value = newPath
    },
    { immediate: true }
  )

  return {
    tabs,
    activeTab,
    openTab,
    closeTab,
    switchTab,
    initMainTabs,
  }
}

// 全局单例
let globalInstance: ReturnType<typeof useTabManager> | null = null

/**
 * 获取全局标签页管理器实例
 */
export function useGlobalTabManager() {
  if (!globalInstance) {
    globalInstance = useTabManager()
  }
  return globalInstance
}
