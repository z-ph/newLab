# 微信模块

## 基础路径

`/api/wechat`

## 接口列表

### 1. 获取微信绑定状态

**接口地址**: `GET /api/wechat/bind-status`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isBound": true,
    "nickname": "张三",
    "headimgurl": "https://wx.qlogo.cn/...",
    "bindTime": "2025-01-27T10:30:00"
  }
}
```

---

### 2. 绑定微信账号

**接口地址**: `POST /api/wechat/bind`

**权限要求**: 需要登录

**请求参数**:
```
code: string  // 微信授权 code（通过 URL 参数传递）
```

**响应示例**:
```json
{
  "code": 200,
  "message": "绑定成功",
  "data": {
    "isBound": true,
    "nickname": "张三",
    "headimgurl": "https://wx.qlogo.cn/..."
  }
}
```

**说明**:
- 需要先通过微信 OAuth2 获取授权 code
- 绑定后可以使用微信快速登录

---

### 3. 解绑微信账号

**接口地址**: `POST /api/wechat/unbind`

**权限要求**: 需要登录

**请求参数**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "解绑成功",
  "data": null
}
```

**说明**: 解绑后无法使用微信登录

---

### 4. 微信授权登录

**接口地址**: `POST /api/wechat/login`

**权限要求**: 无

**请求参数**:
```
code: string  // 微信授权 code（通过 URL 参数传递）
```

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "2021001",
    "name": "张三",
    "role": "STUDENT"
  }
}
```

**说明**:
- 通过微信授权 code 实现快速登录
- 要求用户已绑定微信账号
- 如果未绑定，返回 404 错误

## 微信授权流程

### 步骤 1: 获取微信授权 code

引导用户访问微信授权 URL：
```
https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect
```

### 步骤 2: 获取授权 code

用户授权后，微信会重定向到指定的 redirect_uri，并携带 code 参数：
```
redirect_uri?code=AUTH_CODE&state=STATE
```

### 步骤 3: 调用登录接口

使用获取到的 code 调用登录接口。

## 微信配置

系统使用的微信公众号配置（见 `local-config.env`）：

```
WECHAT_APPID=wx64e54eb19f699276
WECHAT_SECRET=7da784373dea18a886cbc51ac449544a
WECHAT_TEMPLATE_ID=ftIEjMCmVCANzMOekfOze72TTOJftKkQkARliigDLug
WECHAT_TOKEN=signlab2025token
```

## 常见问题

### 1. 如何获取微信授权 code？

需要引导用户访问微信 OAuth2 授权页面，用户授权后会重定向并携带 code 参数。

### 2. code 有有效期吗？

是的，微信授权 code 有效期为 10 分钟，且只能使用一次。

### 3. 如何处理未绑定微信的用户？

如果用户未绑定微信，会返回 404 错误。此时应该引导用户先使用用户名密码登录，然后绑定微信。
