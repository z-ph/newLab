# 教师模块 - 签到管理

## 基础路径

`/api/teacher/attendance`

## 接口列表

### 1. 查询签到列表（分类）

**接口地址**: `GET /api/teacher/attendance/list`

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
    "classExperimentId": 1,
    "classCode": "CS101",
    "experimentId": "1001",
    "courseId": "COURSE001",
    "nonCrossClassAttendees": [
      {
        "attendanceId": 1,
        "studentUsername": "2021001",
        "studentName": "张三",
        "attendanceStatus": "NORMAL",
        "attendanceTime": "2025-01-27T10:30:00",
        "ipAddress": "192.168.1.100"
      }
    ],
    "crossClassAttendees": [
      {
        "attendanceId": 2,
        "studentUsername": "2021002",
        "studentName": "李四",
        "attendanceStatus": "CROSS_CLASS",
        "attendanceTime": "2025-01-27T10:31:00",
        "ipAddress": "192.168.1.101"
      }
    ],
    "notAttendedStudents": [
      {
        "studentUsername": "2021003",
        "studentName": "王五"
      }
    ]
  }
}
```

**说明**:
- `nonCrossClassAttendees`: 正常签到学生（本班学生）
- `crossClassAttendees`: 跨班签到学生（非本班学生）
- `notAttendedStudents`: 未签到学生

---

### 2. 修改签到状态

**接口地址**: `POST /api/teacher/attendance/update`

**权限要求**: TEACHER

**请求参数**:
```json
{
  "attendanceId": 1,
  "studentUsername": "2021001",
  "classCode": "CS101",
  "courseId": "COURSE001",
  "experimentId": "1001",
  "attendanceStatus": "NORMAL"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "签到状态修改成功",
  "data": true
}
```

**说明**:
- 可以修改已签到学生的状态
- 可以为未签到学生添加签到记录
- 签到状态：
  - `NORMAL`: 正常签到
  - `CROSS_CLASS`: 跨班签到

---

### 3. 根据课程和实验查询签到记录

**接口地址**: `GET /api/teacher/attendance/records`

**权限要求**: TEACHER

**请求参数**:
```
courseId: string     // 课程 ID
experimentId: string // 实验 ID
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
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
      "ipAddress": "192.168.1.100",
      "createTime": "2025-01-27T10:30:00"
    }
  ]
}
```

---

### 4. 统计签到数量

**接口地址**: `GET /api/teacher/attendance/count`

**权限要求**: TEACHER

**请求参数**:
```
courseId: string     // 课程 ID
experimentId: string // 实验 ID
```

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": 25
}
```

**说明**: 返回指定课程和实验的已签到学生数量

---

### 5. 查询跨班签到学生

**接口地址**: `GET /api/teacher/attendance/cross-class-attendees`

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
  "data": [
    {
      "attendanceId": 2,
      "studentUsername": "2021002",
      "studentName": "李四",
      "originalClass": "CS102",
      "attendanceTime": "2025-01-27T10:31:00",
      "ipAddress": "192.168.1.101"
    }
  ]
}
```

**说明**: 查询在当前班级实验中跨班签到的学生列表

---

## 签到管理流程

### 生成二维码

1. 教师调用二维码生成接口
2. 展示二维码给学生
3. 学生扫码签到

### 查看签到情况

1. 调用查询签到列表接口
2. 查看已签到学生名单
3. 查看未签到学生名单

### 手动补签

1. 识别未签到学生
2. 调用修改签到状态接口
3. 为学生添加签到记录

### 查询跨班签到

1. 调用跨班签到学生查询接口
2. 查看哪些非本班学生进行了签到
3. 了解课堂开放程度

---

## 签到数据统计

### 签到率计算

```
签到率 = 已签到学生数 / 班级总人数 × 100%
```

### 分类统计

- **正常签到率**: 本班学生签到数 / 本班学生总数
- **跨班签到数**: 非本班学生签到人数
- **未签到人数**: 应到但未到的学生人数

---

## 签到状态说明

| 状态 | 说明 | 示例 |
|------|------|------|
| NORMAL | 正常签到 | 本班学生正常签到 |
| CROSS_CLASS | 跨班签到 | 非本班学生签到 |

---

## 常见问题

### 1. 学生忘记签到怎么办？

教师可以调用修改签到状态接口，为学生手动添加签到记录。

### 2. 跨班签到会影响原班级签到吗？

不会。跨班签到是额外的签到记录，不会影响学生在原班级的签到状态。

### 3. 如何导出签到数据？

可使用导出考勤记录接口导出 Excel 格式的签到数据。

### 4. 签到数据可以被修改吗？

可以。教师可以修改签到状态、签到时间等信息。

### 5. 签到记录会保留多久？

签到记录会永久保留，除非手动删除。

---

## 相关接口

- 生成签到二维码: [二维码/签到模块](./qr-attendance.md)
- 查询学生列表: [教师模块 - 学生管理](./teacher-student.md)
- 导出考勤记录: [数据导入/导出](./data-import-export.md)
