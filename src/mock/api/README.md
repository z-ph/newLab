# Mock API Client

基于 OpenAPI 规范的 Mock API 客户端，返回固定的成功数据。

## 文件结构

```
src/mock/api/
├── index.ts       # MockApiClient 类和单例实例
├── types.ts       # TypeScript 类型定义
├── mockData.ts    # Mock 数据
└── README.md      # 本文档
```

## 功能模块

### 1. 认证相关
- `login(username, password)` - 用户登录
- `resetPassword(username)` - 重置密码
- `setPassword(password, confirmPassword)` - 设置密码
- `checkUserStatus(username)` - 检查用户状态
- `loginByOpenid(openid)` - 微信登录
- `loginByCode(username, code)` - 验证码登录

### 2. 二维码相关
- `getTeacherQr(classExperimentId?)` - 获取签到二维码（教师）
- `getTeacherQrByClassExperiment(classCode, experimentId)` - 根据班级和实验获取二维码
- `studentScanQr(key)` - 学生扫描二维码签到

### 3. 签到相关
- `getAttendanceList(params?)` - 获取签到列表
- `updateAttendance(attendanceId, status)` - 更新签到状态

### 4. 教师班级管理
- `getTeacherClassList()` - 查询教师班级列表
- `getClassByCode(classCode)` - 根据班级代码查询班级
- `createClass(classData)` - 创建班级
- `batchCreateClasses(classes)` - 批量创建班级
- `getClassStudents(classCode)` - 获取班级学生列表
- `bindStudentsToClass(classCode, studentUsernames)` - 绑定学生到班级
- `unbindStudentsFromClass(classCode, studentUsernames)` - 解绑班级学生
- `bindExperimentToClass(classCode, experimentId)` - 绑定实验到班级
- `unbindExperimentFromClass(experimentId)` - 解绑班级实验

### 5. 教师签到管理
- `getTeacherAttendanceRecords(params?)` - 获取教师签到记录
- `updateTeacherAttendance(attendanceId, status)` - 教师更新签到记录
- `getAttendanceCount(params?)` - 获取签到统计

### 6. 学生签到相关
- `getStudentAttendanceRecords()` - 获取学生签到记录
- `getStudentAttendanceStats()` - 获取学生签到统计

### 7. 微信相关
- `getWeChatBindStatus()` - 获取微信绑定状态
- `bindWeChat(code)` - 绑定微信
- `unbindWeChat()` - 解绑微信

### 8. 成绩管理
- `getCourseGrades(courseId)` - 获取课程成绩列表（教师）
- `getGradeDetail(gradeId)` - 获取成绩详情
- `uploadGrades(grades)` - 批量上传成绩
- `approveGrade(gradeId, approved)` - 审核成绩
- `getStudentGrades()` - 获取学生成绩

### 9. 实验报告提交
- `getCourseSubmissions(courseId)` - 获取课程实验报告提交（教师）
- `getSubmissionDetail(submissionId)` - 获取实验报告详情
- `gradeSubmission(submissionId, score, comment?)` - 教师批改实验报告
- `uploadSubmission(courseId, experimentId, fileKey, fileName)` - 学生上传实验报告
- `submitSubmission(submissionId)` - 学生提交实验报告
- `getStudentSubmissions()` - 获取学生实验报告
- `getStudentCourseSubmissions(courseId)` - 获取学生课程实验报告

## 使用示例

### 方式一：使用单例实例（推荐）

```typescript
import { apiClient } from '@/mock/api'

// 登录
const response = await apiClient.login('001', 'password')
console.log(response.data) // LoginResponse

// 获取班级列表
const classes = await apiClient.getTeacherClassList()
console.log(classes.data) // ClassInfo[]

// 获取签到记录
const records = await apiClient.getAttendanceList({ classCode: 'CS101' })
console.log(records.data) // PageResponse<AttendanceRecord>
```

### 方式二：创建新实例

```typescript
import MockApiClient from '@/mock/api'

const client = new MockApiClient()
const response = await client.login('001', 'password')
```

## 响应格式

所有 API 方法返回统一的响应格式：

```typescript
interface ApiResponse<T> {
  code: number      // 0 表示成功
  message: string   // 响应消息
  data: T          // 响应数据
}
```

## 网络延迟

Mock API 默认模拟 300ms 的网络延迟，可通过修改 `delay()` 方法调整。

## 日志输出

所有 API 调用都会在控制台输出日志，方便调试：

```
[Mock API] 登录: username=001, password=***
[Mock API] 获取班级列表
```

## 类型安全

所有 API 方法都有完整的 TypeScript 类型定义，享受完整的类型提示。

## 替换为真实 API

当需要替换为真实 API 时，只需保持相同的方法签名和返回类型，将实现替换为真实的 HTTP 请求即可。
