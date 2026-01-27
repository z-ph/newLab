# 教师模块 - 成绩管理

## 基础路径

`/api/teacher/grades`

## 接口列表

### 1. 查询课程的所有学生成绩

**接口地址**: `GET /api/teacher/grades/course/{courseId}`

**权限要求**: TEACHER

**路径参数**:
- `courseId`: 课程 ID

**请求参数**:
```
semester: string (可选)  // 学期，例如：2024-2025-1
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
      "teacherComment": "表现优秀",
      "isApproved": true,
      "approvedBy": "T001",
      "approvedTime": "2025-01-27T10:00:00"
    },
    {
      "gradeId": 2,
      "courseId": "COURSE001",
      "courseName": "数据结构",
      "studentUsername": "2021002",
      "studentName": "李四",
      "grade": "85",
      "gradeNumeric": 85.0,
      "gradeType": "期末成绩",
      "semester": "2024-2025-1",
      "teacherComment": "良好",
      "isApproved": false,
      "approvedBy": null,
      "approvedTime": null
    }
  ]
}
```

**说明**:
- `isApproved`: 是否已审核
- `approvedBy`: 审核人
- `approvedTime`: 审核时间

---

### 2. 根据ID查询成绩详情

**接口地址**: `GET /api/teacher/grades/{gradeId}`

**权限要求**: TEACHER

**路径参数**:
- `gradeId`: 成绩 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "gradeId": 1,
    "courseId": "COURSE001",
    "courseName": "数据结构",
    "studentUsername": "2021001",
    "studentName": "张三",
    "grade": "90",
    "gradeNumeric": 90.0,
    "gradeType": "期末成绩",
    "semester": "2024-2025-1",
    "teacherComment": "表现优秀",
    "isApproved": true,
    "approvedBy": "T001",
    "approvedTime": "2025-01-27T10:00:00",
    "createTime": "2025-01-20T00:00:00",
    "updateTime": "2025-01-27T10:00:00"
  }
}
```

---

### 3. 创建或更新课程成绩

**接口地址**: `POST /api/teacher/grades`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "courseId": "COURSE001",
  "studentUsername": "2021001",
  "grade": "90",
  "gradeNumeric": 90.0,
  "gradeType": "期末成绩",
  "teacherComment": "表现优秀",
  "semester": "2024-2025-1"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "保存成功",
  "data": {
    "gradeId": 1,
    "courseId": "COURSE001",
    "studentName": "张三",
    "grade": "90",
    "gradeNumeric": 90.0,
    "gradeType": "期末成绩",
    "semester": "2024-2025-1",
    "teacherComment": "表现优秀"
  }
}
```

**说明**:
- 如果成绩已存在，则更新
- 如果成绩不存在，则创建

---

### 4. 审核成绩

**接口地址**: `POST /api/teacher/grades/{gradeId}/approve`

**权限要求**: TEACHER

**路径参数**:
- `gradeId`: 成绩 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "审核成功",
  "data": null
}
```

**说明**:
- 审核后的成绩学生可见
- 记录审核人和审核时间

---

### 5. 删除成绩

**接口地址**: `DELETE /api/teacher/grades/{gradeId}`

**权限要求**: TEACHER

**路径参数**:
- `gradeId`: 成绩 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

**说明**: 只能删除未审核的成绩

---

## 成绩类型说明

| 成绩类型 | 说明 |
|----------|------|
| 期末成绩 | 期末考试成绩 |
| 期中成绩 | 期中考试成绩 |
| 平时成绩 | 平时作业、课堂表现等 |
| 实验成绩 | 实验报告、实验操作等 |
| 综合成绩 | 综合评定成绩 |

## 成绩管理流程

### 创建成绩

1. 教师调用创建/更新接口
2. 填写成绩信息
3. 可选填写教师评语
4. 成绩初始状态为"未审核"

### 审核成绩

1. 教师或管理员审核成绩
2. 审核后成绩对学生可见
3. 记录审核人和审核时间

### 修改成绩

1. 调用创建/更新接口
2. 如果成绩已审核，需要先取消审核
3. 修改后需要重新审核

### 删除成绩

1. 只能删除未审核的成绩
2. 已审核的成绩无法删除（需要先取消审核）

## 导出成绩

相关接口：[数据导入/导出 - 导出课程成绩](./data-import-export.md#导出课程成绩)

## 常见问题

### 1. 成绩和分数有什么区别？

- `grade`: 字符串类型，如 "90"、"A"、"优秀"
- `gradeNumeric`: 数字类型，如 90.0，用于计算和分析

### 2. 为什么要审核成绩？

审核制度是为了确保成绩的准确性和公正性，避免误操作影响学生。

### 3. 如何批量导入成绩？

目前系统不支持批量导入成绩，需要逐个创建。后续可能会增加此功能。

### 4. 学生能看到未审核的成绩吗？

不能，学生只能看到已审核的成绩。

### 5. 如何修改已审核的成绩？

需要先删除（取消审核），然后重新创建并审核。
