# 教师模块 - 班级管理

## 基础路径

`/api/teacher/class`

## 接口列表

### 1. 查询班级列表（分页）

**接口地址**: `POST /api/teacher/class/query`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "classCode": "CS101",     // 班级代码（可选，模糊查询）
  "className": "计算机",     // 班级名称（可选，模糊查询）
  "creator": "T001",        // 创建者（可选）
  "pageNum": 1,             // 页码
  "pageSize": 10            // 每页数量
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 100,
    "pageNum": 1,
    "pageSize": 10,
    "list": [
      {
        "id": 1,
        "classCode": "CS101",
        "className": "计算机科学101班",
        "studentCount": 30,
        "creator": "T001",
        "createTime": "2025-01-01T00:00:00"
      }
    ]
  }
}
```

---

### 2. 根据 ID 查询班级（包含实验信息）

**接口地址**: `GET /api/teacher/class/{id}`

**权限要求**: TEACHER

**路径参数**:
- `id`: 班级 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "classCode": "CS101",
    "className": "计算机科学101班",
    "studentCount": 30,
    "creator": "T001",
    "experiments": [
      {
        "classExperimentId": 1,
        "courseId": "COURSE001",
        "courseName": "数据结构",
        "experimentId": "1001",
        "experimentName": "链表操作实验"
      }
    ]
  }
}
```

---

### 3. 根据班级代码查询班级

**接口地址**: `GET /api/teacher/class/code/{classCode}`

**权限要求**: TEACHER

**路径参数**:
- `classCode`: 班级代码

**响应示例**: 同上

---

### 4. 创建班级（单个）

**接口地址**: `POST /api/teacher/class`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "classCode": "CS101",
  "className": "计算机科学101班"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "班级创建成功",
  "data": {
    "id": 1,
    "classCode": "CS101",
    "className": "计算机科学101班",
    "studentCount": 0,
    "creator": "T001"
  }
}
```

---

### 5. 批量添加班级

**接口地址**: `POST /api/teacher/class/batch`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "classes": [
    {
      "classCode": "CS101",
      "className": "计算机科学101班"
    },
    {
      "classCode": "CS102",
      "className": "计算机科学102班"
    }
  ]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "批量添加完成",
  "data": {
    "totalCount": 2,
    "successCount": 2,
    "failedCount": 0,
    "failedClasses": []
  }
}
```

---

### 6. 更新班级信息

**接口地址**: `PUT /api/teacher/class/{id}`

**权限要求**: TEACHER

**路径参数**:
- `id`: 班级 ID

**请求参数**:
```json
{
  "className": "计算机科学101班（更新）"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "班级更新成功",
  "data": null
}
```

---

### 7. 删除班级

**接口地址**: `DELETE /api/teacher/class/{id}`

**权限要求**: TEACHER

**路径参数**:
- `id`: 班级 ID

**响应示例**:
```json
{
  "code": 200,
  "message": "班级删除成功",
  "data": null
}
```

---

### 8. 查询班级的所有学生

**接口地址**: `GET /api/teacher/class/{classCode}/students`

**权限要求**: TEACHER

**路径参数**:
- `classCode`: 班级代码

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "studentUsername": "2021001",
      "studentName": "张三",
      "classCode": "CS101",
      "bindTime": "2025-01-01T00:00:00"
    }
  ]
}
```

---

### 9. 批量绑定学生到班级

**接口地址**: `POST /api/teacher/class/{classCode}/bind-students`

**权限要求**: TEACHER

**路径参数**:
- `classCode`: 班级代码

**请求参数**:
```json
{
  "studentUsernames": ["2021001", "2021002", "2021003"]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "批量绑定完成",
  "data": {
    "totalCount": 3,
    "successCount": 3,
    "failedCount": 0,
    "failedStudents": []
  }
}
```

---

### 10. 批量解绑学生

**接口地址**: `POST /api/teacher/class/{classCode}/unbind-students`

**权限要求**: TEACHER

**路径参数**:
- `classCode`: 班级代码

**请求参数**:
```json
["2021001", "2021002"]
```

**响应示例**:
```json
{
  "code": 200,
  "message": "解绑成功，共解绑 2 名学生",
  "data": 2
}
```

---

### 11. 批量绑定班级到实验

**接口地址**: `POST /api/teacher/class/bind-experiment`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "courseId": "COURSE001",
  "experimentId": "1001",
  "classCodes": ["CS101", "CS102", "CS103"]
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "批量绑定完成",
  "data": {
    "totalCount": 3,
    "successCount": 3,
    "failedCount": 0,
    "failedClasses": []
  }
}
```

---

### 12. 批量解绑班级

**接口地址**: `POST /api/teacher/class/unbind-experiment/{experimentId}`

**权限要求**: TEACHER

**路径参数**:
- `experimentId`: 实验 ID

**请求参数**:
```json
["CS101", "CS102"]
```

**响应示例**:
```json
{
  "code": 200,
  "message": "解绑成功，共解绑 2 个班级",
  "data": 2
}
```

## 业务说明

### 班级验证码

每个班级都有一个唯一的验证码，学生可以通过验证码绑定到班级。

### 班级-实验关系

一个班级可以绑定多个实验，一个实验也可以绑定到多个班级，形成多对多关系。

### 学生绑定方式

1. **主动绑定**: 学生通过班级验证码主动绑定
2. **批量绑定**: 教师通过学生用户名批量绑定

## 常见问题

### 1. 班级代码重复怎么办？

系统会检查班级代码唯一性，创建时如果重复会返回错误。

### 2. 删除班级会影响学生吗？

删除班级会自动解除班级与学生的绑定关系，但不会删除学生账号。

### 3. 如何批量导入班级？

使用批量添加接口，一次性创建多个班级。

### 4. 班级绑定的实验有什么用？

班级绑定实验后，该班级的学生才能看到并完成该实验。
