# 认证模块

## 基础路径

`/api/auth`

## 接口列表

### 1. 用户登录

**接口地址**: `POST /api/auth/login`

**权限要求**: 无（公开接口）

**请求参数**:
```json
{
  "username": "string",   // 用户名（学号/工号）
  "password": "string",   // 密码
  "code": "string"        // 微信授权 code（可选）
}
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

---

### 2. 管理员重置密码

**接口地址**: `POST /api/auth/reset-password`

**权限要求**: ADMIN

**请求参数**:
```json
["2021001", "2021002"]  // 用户名列表
```

**响应示例**:
```json
{
  "code": 200,
  "message": "密码重置成功",
  "data": null
}
```

**说明**: 密码重置为 `syjx@学号后四位`

---

### 3. 用户设置密码

**接口地址**: `POST /api/auth/set-password`

**权限要求**: 无（但需要用户名）

**请求参数**:
```json
{
  "username": "string",      // 用户名
  "newPassword": "string",   // 新密码（6位数字）
  "confirmPassword": "string" // 确认密码
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "密码设置成功",
  "data": null
}
```

**说明**:
- 首次登录必须修改密码
- 密码必须为 6 位数字

---

### 4. 检查用户状态

**接口地址**: `GET /api/auth/check-user-status/{username}`

**权限要求**: 无

**路径参数**:
- `username`: 用户名

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "exists": true,
    "hasPassword": true,
    "role": "STUDENT"
  }
}
```

---

### 5. 检查微信绑定状态

**接口地址**: `GET /api/auth/wechat-status/{username}`

**权限要求**: 无

**路径参数**:
- `username`: 用户名

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isBound": true,
    "nickname": "张三",
    "headimgurl": "https://wx.qlogo.cn/..."
  }
}
```

---

### 6. 学生解绑微信

**接口地址**: `POST /api/auth/unbind-wechat`

**权限要求**: STUDENT

**请求参数**: 无（使用当前登录用户）

**响应示例**:
```json
{
  "code": 200,
  "message": "微信解绑成功",
  "data": null
}
```

---

### 7. 通过 OpenID 登录

**接口地址**: `POST /api/auth/login-by-openid`

**权限要求**: 无

**请求参数**:
```json
{
  "openid": "string"  // 微信 OpenID
}
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

**说明**: 适用于已绑定微信的用户快速登录

---

### 8. 通过微信授权码登录

**接口地址**: `POST /api/auth/login-by-code`

**权限要求**: 无

**请求参数**:
```json
{
  "code": "string"  // 微信授权 code
}
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

**说明**: 推荐方式，通过微信授权 code 获取 openid 后登录

---

### 9. 调试接口：查询用户详细信息

**接口地址**: `GET /api/auth/debug-user/{username}`

**权限要求**: 无

**路径参数**:
- `username`: 用户名

**响应示例**:
```json
{
  "code": 200,
  "message": "用户信息查询成功",
  "data": "User{username='2021001', name='张三', role=STUDENT...}"
}
```

**说明**: 用于开发调试

---

### 10. 数据库连接测试

**接口地址**: `GET /api/auth/test-db`

**权限要求**: 无

**响应示例**:
```json
{
  "code": 200,
  "message": "数据库连接测试成功",
  "data": "数据库连接正常，当前用户总数：100"
}
```

**说明**: 用于测试数据库连接是否正常
