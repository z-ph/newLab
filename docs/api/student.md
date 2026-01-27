# 学生模块

## 基础路径

`/api/student`

## 模块索引

- [班级管理](#班级管理)
- [实验管理](#实验管理)
- [步骤提交](#步骤提交)
- [成绩查询](#成绩查询)
- [签到记录](#签到记录)

---

## 班级管理

### 1. 绑定班级

**接口地址**: `POST /api/student/bind-class`

**权限要求**: STUDENT

**请求参数**:
```json
{
  "verificationCode": "ABC123"  // 班级验证码
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "绑定班级成功",
  "data": {
    "id": 1,
    "classCode": "CS101",
    "className": "计算机科学101班",
    "creator": "T001",
    "studentCount": 30
  }
}
```

---

### 2. 查询班级列表

**接口地址**: `GET /api/student/classes`

**权限要求**: STUDENT

**响应示例**:
```json
{
  "code": 200,
  "message": "获取班级列表成功",
  "data": [
    {
      "classCode": "CS101",
      "className": "计算机科学101班",
      "creator": "T001",
      "studentCount": 30
    }
  ]
}
```

---

## 实验管理

### 1. 查询实验详情

**接口地址**: `GET /api/student/experiments/{experimentId}`

**权限要求**: STUDENT

**路径参数**:
- `experimentId`: 实验 ID

**请求参数**:
```
classCode: string  // 班级编号
```

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "experimentId": 1001,
    "experimentName": "数据结构实验",
    "courseId": "COURSE001",
    "courseName": "数据结构",
    "description": "实验描述...",
    "scorePercentage": 20.5,
    "procedures": [
      {
        "procedureId": 1,
        "procedureName": "观看视频",
        "type": 1,
        "typeName": "观看视频",
        "orderIndex": 1,
        "canDo": true,
        "isCompleted": false
      },
      {
        "procedureId": 2,
        "procedureName": "数据收集",
        "type": 2,
        "typeName": "数据收集",
        "orderIndex": 2,
        "canDo": false,
        "isCompleted": false
      }
    ]
  }
}
```

**说明**:
- `canDo`: 是否可以进行该步骤（前置步骤完成才可进行）
- `isCompleted`: 是否已完成该步骤

---

## 步骤提交

### 1. 查询步骤提交列表

**接口地址**: `GET /api/student/procedure-submissions`

**权限要求**: STUDENT

**请求参数**:
```
courseId: string (可选)    // 课程 ID
experimentId: string (可选) // 实验 ID
```

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "submissionId": 1,
      "procedureId": 1,
      "procedureName": "观看视频",
      "type": 1,
      "status": "COMPLETED",
      "submitTime": "2025-01-27T10:00:00",
      "score": 100.0
    }
  ]
}
```

---

### 2. 根据课程查询步骤提交

**接口地址**: `GET /api/student/procedure-submissions/course/{courseId}`

**权限要求**: STUDENT

**路径参数**:
- `courseId`: 课程 ID

---

### 3. 查询步骤详情

**接口地址**: `GET /api/student/procedure-submissions/{submissionId}`

**权限要求**: STUDENT

**路径参数**:
- `submissionId`: 步骤提交 ID

---

### 4. 标记视频已观看

**接口地址**: `POST /api/student/procedure-submissions/video/{procedureId}/viewed`

**权限要求**: STUDENT

**路径参数**:
- `procedureId`: 步骤 ID

**请求参数**:
```
classCode: string  // 班级编号
```

**响应示例**:
```json
{
  "code": 200,
  "message": "标记成功",
  "data": null
}
```

**说明**: 用于 type=1（观看视频）类型的步骤

---

### 5. 完成题库练习步骤

**接口地址**: `POST /api/student/procedure-submissions/topic/complete`

**权限要求**: STUDENT

**请求参数**:
```json
{
  "classCode": "CS101",
  "procedureId": 3,
  "answers": {
    "1": "A",
    "2": "B",
    "3": "C"
  }
}
```

**说明**: 用于 type=3（题库答题）类型的步骤

---

### 6. 完成数据收集步骤

**接口地址**: `POST /api/student/procedure-submissions/data-collection/complete`

**权限要求**: STUDENT

**请求参数**:
```
procedureId: Long              // 步骤 ID
classCode: string              // 班级编号
dataAnswer: string (可选)       // 数据答案
photos: List<MultipartFile>    // 照片文件列表
documents: List<MultipartFile> // 文档文件列表
```

**说明**:
- 用于 type=2（数据收集）类型的步骤
- 支持上传照片和文档
- 单个文件最大 10MB

---

## 成绩查询

### 1. 查询课程成绩列表

**接口地址**: `GET /api/student/grades`

**权限要求**: STUDENT

**请求参数**:
```
semester: string (可选)  // 学期
```

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "gradeId": 1,
      "courseId": "COURSE001",
      "courseName": "数据结构",
      "studentUsername": "2021001",
      "studentName": "张三",
      "grade": "90",
      "gradeNumeric": 90.0,
      "gradeType": "期末成绩",
      "semester": "2024-2025-1",
      "teacherComment": "表现优秀"
    }
  ]
}
```

---

### 2. 查询成绩详情

**接口地址**: `GET /api/student/grades/{gradeId}`

**权限要求**: STUDENT

**路径参数**:
- `gradeId`: 成绩 ID

---

## 签到记录

### 1. 查询签到记录列表

**接口地址**: `GET /api/student/attendance/records`

**权限要求**: STUDENT

**响应示例**:
```json
{
  "code": 200,
  "message": "查询签到记录成功",
  "data": [
    {
      "attendanceId": 1,
      "studentUsername": "2021001",
      "studentName": "张三",
      "classCode": "CS101",
      "courseId": "COURSE001",
      "experimentId": "1001",
      "attendanceStatus": "NORMAL",
      "attendanceTime": "2025-01-27T10:30:00",
      "ipAddress": "192.168.1.100"
    }
  ]
}
```

---

### 2. 查询签到统计

**接口地址**: `GET /api/student/attendance/stats`

**权限要求**: STUDENT

**响应示例**:
```json
{
  "code": 200,
  "message": "查询签到统计成功",
  "data": {
    "totalAttendances": 10,
    "normalAttendances": 8,
    "crossClassAttendances": 2,
    "attendanceRate": 100.0
  }
}
```

---

### 3. 查询最近签到记录

**接口地址**: `GET /api/student/attendance/my-records`

**权限要求**: STUDENT

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "attendanceId": 1,
    "studentUsername": "2021001",
    "classCode": "CS101",
    "attendanceStatus": "NORMAL",
    "attendanceTime": "2025-01-27T10:30:00"
  }
}
```

## 实验步骤类型说明

| 类型值 | 类型名称 | 说明 |
|--------|----------|------|
| 1 | 观看视频 | 观看指定视频后标记为完成 |
| 2 | 数据收集 | 填写表单并上传照片/文档 |
| 3 | 题库答题 | 完成题库练习并提交答案 |
| 4 | 提交实验报告 | 上传实验报告文档 |

## 步骤依赖关系

实验步骤可能存在依赖关系，只有完成前置步骤才能进行后续步骤。

例如：
- 步骤 1: 观看视频（无依赖）
- 步骤 2: 数据收集（依赖步骤 1）
- 步骤 3: 题库答题（依赖步骤 2）

只有完成步骤 1，步骤 2 的 `canDo` 才会为 `true`。
