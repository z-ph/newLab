# 二维码/签到模块

## 基础路径

`/api/qr`

## 接口列表

### 1. 获取签到二维码（教师）

**接口地址**: `GET /api/qr/teacher`

**权限要求**: TEACHER

**请求参数**:
```
classExperimentId: Long  // 班级实验 ID
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?data=...",
    "encryptedData": "encrypted_string_here",
    "classCode": "CS101",
    "experimentId": "1001",
    "courseId": "COURSE001",
    "expireTime": "2025-01-27T12:00:00"
  }
}
```

**说明**:
- 返回加密的二维码数据
- 学生扫码时会验证二维码有效性
- 二维码有有效期限制

---

### 2. 根据班级代码和实验 ID 获取签到二维码（教师）

**接口地址**: `GET /api/qr/teacher/by-class-experiment`

**权限要求**: TEACHER

**请求参数**:
```
classCode: string     // 班级代码
experimentId: string  // 实验 ID
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "qrCodeUrl": "https://api.qrserver.com/v1/create-qr-code/?data=...",
    "encryptedData": "encrypted_string_here",
    "classCode": "CS101",
    "experimentId": "1001",
    "courseId": "COURSE001",
    "expireTime": "2025-01-27T12:00:00"
  }
}
```

**说明**: 同上，但使用班级代码和实验 ID 查询

---

### 3. 学生扫码签到

**接口地址**: `GET /api/qr/student/scan/{key}`

**权限要求**: STUDENT

**路径参数**:
- `key`: 加密的二维码数据

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "code": 200,
  "message": "签到成功",
  "data": {
    "attendanceId": 12345,
    "studentUsername": "2021001",
    "studentName": "张三",
    "classCode": "CS101",
    "experimentId": "1001",
    "courseId": "COURSE001",
    "attendanceStatus": "NORMAL",
    "attendanceTime": "2025-01-27T10:30:00",
    "ipAddress": "192.168.1.100"
  }
}
```

**说明**:
- 系统会自动获取客户端 IP 地址
- 签到状态分为：
  - `NORMAL`: 正常签到（班级学生）
  - `CROSS_CLASS`: 跨班签到（非班级学生）
- 一个学生同一实验只能签到一次

## 签到流程

### 教师端流程

1. 教师调用 `GET /api/qr/teacher` 生成签到二维码
2. 将二维码展示给学生
3. 可随时查询签到情况（见教师签到管理模块）

### 学生端流程

1. 学生使用微信扫描二维码
2. 系统自动识别并跳转到签到接口
3. 如果已登录，自动完成签到
4. 显示签到结果

## 二维码数据格式

二维码中包含加密数据，包括：

```
{
  "classCode": "CS101",
  "experimentId": "1001",
  "courseId": "COURSE001",
  "timestamp": 1706345800000,
  "expireTime": 1800000  // 30 分钟有效期
}
```

数据经过加密处理，防止伪造。

## 常见问题

### 1. 二维码有效期是多久？

默认 30 分钟，过期后需要重新生成。

### 2. 跨班签到是什么？

当非本班学生扫码签到时，会被标记为"跨班签到"，便于教师区分。

### 3. 如何防止重复签到？

系统会检查学生是否已经签到过该实验，已签到则返回错误。

### 4. 签到失败怎么办？

常见原因：
- 二维码已过期
- 未登录或 Token 无效
- 已经签到过
- 网络问题

## 相关接口

- 教师查询签到列表: `GET /api/teacher/attendance/list`
- 教师修改签到状态: `POST /api/teacher/attendance/update`
- 学生查询签到记录: `GET /api/student/attendance/records`
