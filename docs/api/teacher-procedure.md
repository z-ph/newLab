# 教师模块 - 实验步骤管理

## 基础路径

创建：`/api/teacher/procedures`
查询：`/api/teacher/procedures`
批改：`/api/teacher/procedure-submissions`

---

## 创建实验步骤

### 1. 创建视频观看步骤

**接口地址**: `POST /api/teacher/procedures/video`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "experimentId": 1001,
  "procedureName": "观看实验指导视频",
  "orderIndex": 1,
  "dependencies": [],
  "videoFileId": 10
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": 1  // 步骤 ID
}
```

**说明**:
- `type`: 固定为 1（观看视频）
- `videoFileId`: 视频文件 ID
- `dependencies`: 前置步骤 ID 列表（空数组表示无依赖）

---

### 2. 创建数据收集步骤

**接口地址**: `POST /api/teacher/procedures/data-collection`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "experimentId": 1001,
  "procedureName": "收集实验数据",
  "orderIndex": 2,
  "dependencies": [1],
  "dataCollectionId": 5
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": 2
}
```

**说明**:
- `type`: 固定为 2（数据收集）
- `dataCollectionId`: 数据收集表单 ID
- `dependencies`: 必须先完成步骤 1（观看视频）

---

### 3. 创建题库练习步骤

**接口地址**: `POST /api/teacher/procedures/topic`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "experimentId": 1001,
  "procedureName": "完成练习题",
  "orderIndex": 3,
  "dependencies": [2],
  "topicIds": [101, 102, 103],
  "requiredCount": 3
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "创建成功",
  "data": 3
}
```

**说明**:
- `type`: 固定为 3（题库答题）
- `topicIds`: 题目 ID 列表
- `requiredCount`: 需要完成的题目数量

---

## 查询实验步骤

### 1. 查询单个步骤详情

**接口地址**: `GET /api/teacher/procedures/{procedureId}`

**权限要求**: TEACHER

**路径参数**:
- `procedureId`: 步骤 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": {
    "procedureId": 1,
    "experimentId": 1001,
    "procedureName": "观看实验指导视频",
    "type": 1,
    "typeName": "观看视频",
    "orderIndex": 1,
    "dependencies": [],
    "content": {
      "videoFileId": 10,
      "videoFileName": "实验指导.mp4",
      "videoUrl": "/uploads/videos/实验指导.mp4"
    }
  }
}
```

---

### 2. 查询实验的所有步骤

**接口地址**: `GET /api/teacher/procedures/experiment/{experimentId}`

**权限要求**: TEACHER

**路径参数**:
- `experimentId`: 实验 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "procedureId": 1,
      "procedureName": "观看实验指导视频",
      "type": 1,
      "orderIndex": 1
    },
    {
      "procedureId": 2,
      "procedureName": "收集实验数据",
      "type": 2,
      "orderIndex": 2
    }
  ]
}
```

---

## 批改学生提交

### 1. 查询课程的步骤提交列表

**接口地址**: `GET /api/teacher/procedure-submissions/course/{courseId}`

**权限要求**: TEACHER

**路径参数**:
- `courseId`: 课程 ID

**请求参数**:
```
experimentId: string (可选)       // 实验 ID
submissionStatus: string (可选)   // 提交状态（PENDING/GRADED）
```

**响应示例**:
```json
{
  "code": 200,
  "message": "查询成功",
  "data": [
    {
      "submissionId": 1,
      "procedureId": 2,
      "procedureName": "收集实验数据",
      "studentUsername": "2021001",
      "studentName": "张三",
      "classCode": "CS101",
      "status": "PENDING",
      "submitTime": "2025-01-27T10:00:00",
      "attachments": [
        {
          "fileName": "数据.png",
          "fileUrl": "/uploads/attachments/data.png"
        }
      ]
    }
  ]
}
```

---

### 2. 查看步骤提交详情

**接口地址**: `GET /api/teacher/procedure-submissions/{submissionId}`

**权限要求**: TEACHER

**路径参数**:
- `submissionId`: 提交 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "submissionId": 1,
    "procedureId": 2,
    "procedureName": "收集实验数据",
    "studentUsername": "2021001",
    "studentName": "张三",
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
    "status": "PENDING",
    "submitTime": "2025-01-27T10:00:00",
    "teacherComment": null,
    "score": null
  }
}
```

---

### 3. 批改步骤提交

**接口地址**: `POST /api/teacher/procedure-submissions/{submissionId}/grade`

**权限要求**: TEACHER

**路径参数**:
- `submissionId`: 提交 ID

**请求参数**:
```json
{
  "teacherComment": "实验数据记录完整，照片清晰",
  "score": 95.5
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "批改成功",
  "data": null
}
```

---

## 查询学生步骤完成情况

### 1. 查询学生的步骤完成情况

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
        "completeTime": "2025-01-27T09:00:00"
      },
      {
        "procedureId": 2,
        "procedureName": "数据收集",
        "isCompleted": true,
        "completeTime": "2025-01-27T10:00:00"
      },
      {
        "procedureId": 3,
        "procedureName": "题库答题",
        "isCompleted": false,
        "completeTime": null
      }
    ]
  }
}
```

---

### 2. 查询学生的步骤完成详情

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
      "dataAnswer": "实验数据...",
      "photos": [...],
      "documents": [...],
      "teacherComment": "完成优秀",
      "score": 95.5
    }
  }
}
```

---

### 3. 查询班级实验完成统计

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
    "completionRate": 66.67,
    "procedureStatistics": [
      {
        "procedureId": 1,
        "procedureName": "观看视频",
        "completedCount": 30,
        "completionRate": 100.0
      },
      {
        "procedureId": 2,
        "procedureName": "数据收集",
        "completedCount": 25,
        "completionRate": 83.33
      },
      {
        "procedureId": 3,
        "procedureName": "题库答题",
        "completedCount": 20,
        "completionRate": 66.67
      }
    ]
  }
}
```

---

## 步骤类型说明

| 类型 ID | 类型名称 | 创建接口 | 完成方式 |
|---------|----------|----------|----------|
| 1 | 观看视频 | `/video` | 学生标记为已观看 |
| 2 | 数据收集 | `/data-collection` | 学生提交数据和文件 |
| 3 | 题库答题 | `/topic` | 学生提交答案 |
| 4 | 提交报告 | （未实现） | 学生上传报告 |

## 步骤依赖关系

通过 `dependencies` 字段设置步骤依赖关系：

```json
{
  "dependencies": [1, 2]  // 必须先完成步骤 1 和 2
}
```

只有前置步骤完成，学生才能进行当前步骤。

## 批改流程

1. 教师查询待批改的提交列表
2. 查看提交详情（包含学生上传的文件）
3. 给出评语和分数
4. 提交批改结果

批改后，学生可以查看教师的评语和分数。
