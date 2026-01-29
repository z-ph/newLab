/**
 * 微信 JS-SDK 配置和工具函数
 *
 * 用于微信扫码签到等功能
 */

// 微信 JS-SDK 配置状态
let wxConfigured = false

/**
 * 初始化微信 JS-SDK
 * @param appId - 微信公众号 AppID
 * @param timestamp - 生成签名的时间戳
 * @param nonceStr - 生成签名的随机字符串
 * @param signature - 签名
 * @param jsApiList - 需要使用的 JS 接口列表
 */
export function initWechatSDK(config: {
  appId: string
  timestamp: number
  nonceStr: string
  signature: string
  jsApiList: string[]
}): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否在微信环境中
    if (!isWechatBrowser()) {
      reject(new Error('不在微信浏览器中'))
      return
    }

    // 动态加载微信 JS-SDK
    const script = document.createElement('script')
    script.src = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'
    script.onload = () => {
      // @ts-ignore
      if (window.wx) {
        // @ts-ignore
        window.wx.config({
          debug: false,
          appId: config.appId,
          timestamp: config.timestamp,
          nonceStr: config.nonceStr,
          signature: config.signature,
          jsApiList: config.jsApiList,
        })

        // @ts-ignore
        window.wx.ready(() => {
          wxConfigured = true
          console.log('微信 JS-SDK 初始化成功')
          resolve()
        })

        // @ts-ignore
        window.wx.error((res: any) => {
          console.error('微信 JS-SDK 初始化失败', res)
          reject(new Error('微信 JS-SDK 初始化失败'))
        })
      } else {
        reject(new Error('微信 JS-SDK 加载失败'))
      }
    }
    script.onerror = () => {
      reject(new Error('微信 JS-SDK 脚本加载失败'))
    }
    document.head.appendChild(script)
  })
}

/**
 * 检查是否在微信浏览器中
 */
export function isWechatBrowser(): boolean {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/i.test(ua)
}

/**
 * 调用微信扫码接口
 * @returns Promise 返回扫码结果
 */
export function scanQRCode(): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!isWechatBrowser()) {
      reject(new Error('不在微信浏览器中'))
      return
    }

    if (!wxConfigured) {
      reject(new Error('微信 JS-SDK 未初始化'))
      return
    }

    // @ts-ignore
    if (!window.wx || !window.wx.scanQRCode) {
      reject(new Error('微信扫码接口不可用'))
      return
    }

    // @ts-ignore
    window.wx.scanQRCode({
      needResult: 1, // 1 表示需要返回结果
      scanType: ['qrCode', 'barCode'], // 可以指定扫二维码还是一维码
      success: (res: any) => {
        // res.resultStr 是扫码结果
        resolve(res.resultStr)
      },
      fail: (err: any) => {
        console.error('扫码失败', err)
        reject(new Error('扫码失败'))
      },
    })
  })
}

/**
 * 从后端获取微信 JS-SDK 配置
 */
export async function fetchWechatConfig(): Promise<{
  appId: string
  timestamp: number
  nonceStr: string
  signature: string
}> {
  try {
    // TODO: 调用后端接口获取配置
    // const url = window.location.href.split('#')[0]
    // const response = await fetch('/api/wechat/jsapi-signature?url=' + encodeURIComponent(url))
    // const data = await response.json()
    // return data

    // 模拟返回配置
    return {
      appId: '',
      timestamp: Date.now(),
      nonceStr: Math.random().toString(36).substring(2),
      signature: '',
    }
  } catch (error) {
    console.error('获取微信配置失败', error)
    throw error
  }
}

/**
 * 自动初始化微信 JS-SDK
 * 在需要使用微信功能的页面调用此函数
 */
export async function setupWechatSDK(): Promise<void> {
  if (!isWechatBrowser()) {
    console.log('不在微信浏览器中，跳过初始化')
    return
  }

  try {
    const config = await fetchWechatConfig()

    await initWechatSDK({
      ...config,
      jsApiList: ['scanQRCode'],
    })
  } catch (error) {
    console.error('微信 JS-SDK 自动初始化失败', error)
    throw error
  }
}

/**
 * 声明全局 wx 类型
 */
declare global {
  interface Window {
    wx?: {
      config: (config: any) => void
      ready: (callback: () => void) => void
      error: (callback: (error: any) => void) => void
      scanQRCode: (config: any) => void
    }
  }
}
