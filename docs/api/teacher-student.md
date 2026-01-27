# 教师模块 - 学生管理

## 基础路径

`/api/teacher/students`

## 接口列表

### 1. 查询学生列表（支持过滤）

**接口地址**: `GET /api/teacher/students`

**权限要求**: TEACHER

**请求参数**:
```
classCode: string (可选)         // 班级代码
studentType: string (可选)       // 学生类型：CLASS_STUDENT / CROSS_CLASS_ATTENDEE
classExperimentId: Long (可选)   // 班级实验 ID（用于查询签到统计）
```

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "data": [
      {
        "studentCode": "2021001",
        "studentName": "张三",
        "classCode": "CS101",
        "className": "计算机科学101班",
        "studentType": "CLASS_STUDENT",
        "attendanceStatus": "NORMAL",
        "attendanceTime": "2025-01-27T10:30:00"
      }
    ],
    "stats": {
      "totalStudents": 30,
      "classStudentCount": 28,
      "crossClassAttendeeCount": 2,
      "attendedCount": 30,
      "attendanceRate": 100.0
    }
  }
}
```

**说明**:
- `studentType`: 学生类型
  - `CLASS_STUDENT`: 班级学生
  - `CROSS_CLASS_ATTENDEE`: 跨班听课学生
- 如果指定了 `classExperimentId`，会返回签到统计信息

---

### 2. 查询学生的步骤完成情况

**接口地址**: `GET /api/teacher/students/{studentUsername}/experiments/{experimentId}/procedures`

**权限要求**: TEACHER

**路径参数**:
- `studentUsername`: 学生用户名
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
    "studentUsername": "2021001",
    "studentName": "张三",
    "experimentId": 1001,
    "experimentName": "链表操作实验",
    "totalProcedures": 3,
    "completedProcedures": 2,
    "completionRate": 66.67,
    "procedures": [
      {
        "procedureId": 1,
        "procedureName": "观看视频",
        "isCompleted": true,
        "completeTime": "2025-01-27T09:00:00",
        "score": 100.0
      },
      {
        "procedureId": 2,
        "procedureName": "数据收集",
        "isCompleted": true,
        "completeTime": "2025-01-27T10:00:00",
        "score": 95.5
      },
      {
        "procedureId": 3,
        "procedureName": "题库答题",
        "isCompleted": false,
        "completeTime": null,
        "score": null
      }
    ]
  }
}
```

**说明**: 查看某个学生在某个实验中的步骤完成情况

---

### 3. 查询学生的步骤完成详情

**接口地址**: `GET /api/teacher/students/{studentUsername}/procedures/{procedureId}`

**权限要求**: TEACHER

**路径参数**:
- `studentUsername`: 学生用户名
- `procedureId`: 步骤 ID

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
    "procedureId": 2,
    "procedureName": "数据收集",
    "isCompleted": true,
    "completeTime": "2025-01-27T10:00:00",
    "submission": {
      "submissionId": 1,
      "dataAnswer": "实验数据：温度25°C，湿度60%",
      "photos": [
        {
          "fileName": "实验现场.jpg",
          "fileUrl": "/uploads/photos/实验现场.jpg"
        }
      ],
      "documents": [
        {
          "fileName": "实验报告.docx",
          "fileUrl": "/uploads/documents/实验报告.docx"
        }
      ],
      "teacherComment": "实验数据记录完整",
      "score": 95.5
    }
  }
}
```

**说明**: 查看某个学生在某个步骤的详细完成情况，包括提交的内容和批改结果

---

### 4. 查询班级实验完成统计

**接口地址**: `GET /api/teacher/students/classes/{classCode}/experiments/{experimentId}/statistics`

**权限要求**: TEACHER

**路径参数**:
- `classCode`: 班级编号
- `experimentId`: 实验 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "classCode": "CS101",
    "className": "计算机科学101班",
    "experimentId": 1001,
    "experimentName": "链表操作实验",
    "totalStudents": 30,
    "completedStudents": 20,
    "inProgressStudents": 8,
    "notStartedStudents": 2,
    "completionRate": 66.67,
    "averageScore": 88.5,
    "procedureStatistics": [
      {
        "procedureId": 1,
        "procedureName": "观看视频",
        "totalStudents": 30,
        "completedCount": 30,
        "completionRate": 100.0,
        "averageScore": 98.5
      },
      {
        "procedureId": 2,
        "procedureName": "数据收集",
        "totalStudents": 30,
        "completedCount": 25,
        "completionRate": 83.33,
        "averageScore": 92.0
      },
      {
        "procedureId": 3,
        "procedureName": "题库答题",
        "totalStudents": 30,
        "completedCount": 20,
        "completionRate": 66.67,
        "averageScore": 85.0
      }
    ]
  }
}
```

**说明**:
- `completedStudents`: 完成所有步骤的学生数
- `inProgressStudents`: 进行中的学生数
- `notStartedStudents`: 未开始的学生数
- `averageScore`: 平均分

---

## 学生管理功能

### 查询学生

1. **按班级查询**: 使用 `classCode` 参数
2. **按学生类型过滤**: 使用 `studentType` 参数
3. **查看签到统计**: 使用 `classExperimentId` 参数

### 监控学生进度

1. 查询学生的步骤完成情况
2. 查看具体的提交内容
3. 了解班级整体进度

### 统计分析

1. 班级完成率统计
2. 各步骤完成率统计
3. 平均分统计
4. 学生分类统计

---

## 学生类型说明

| 类型 | 说明 | 示例 |
|------|------|------|
| CLASS_STUDENT | 班级学生 | 正常在该班级上课的学生 |
| CROSS_CLASS_ATTENDEE | 跨班听课学生 | 其他班级来听课的学生 |

---

## 使用场景

### 场景 1: 查看班级学生列表

```
GET /api/teacher/students?classCode=CS101
```

### 场景 2: 查看某个实验的签到情况

```
GET /api/teacher/students?classExperimentId=1
```

返回包含签到统计的学生列表。

### 场景 3: 查看某个学生的实验进度

```
GET /api/teacher/students/2021001/experiments/1001/procedures?classCode=CS101
```

### 场景 4: 查看班级实验统计

```
GET /api/teacher/students/classes/CS101/experiments/1001/statistics
```

---

## 常见问题

### 1. 如何找出未完成实验的学生？

查看班级实验统计，`notStartedStudents` 和 `inProgressStudents` 字段包含未完成的学生数。然后可以查询每个学生的具体情况。

### 2. 学生类型有什么用？

区分班级学生和跨班听课学生，便于管理和统计。

### 3. 如何查看学生的提交内容？

使用查询学生步骤完成详情接口，会返回学生提交的所有内容（文本、照片、文档等）。

### 4. 如何导出学生数据？

目前没有直接的导出接口，但可以通过查询接口获取数据后自行处理。

---

## 相关接口

- 班级管理: [教师模块 - 班级管理](./teacher-class.md)
- 实验步骤管理: [教师模块 - 实验步骤](./teacher-procedure.md)
- 签到管理: [教师模块 - 签到管理](./teacher-attendance.md)
