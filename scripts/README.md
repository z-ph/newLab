# Scripts 工具集

## detect-invisible-chars.py - 不可见字符检测工具

检测源代码文件中的不可见字符（零宽字符、BOM 等），防止意外的格式问题。

### 为什么需要这个工具？

不可见字符（如零宽字符）可能导致：
- ❌ 代码编辑器显示异常
- ❌ Git diff 出现奇怪的字符
- ❌ 字符串比较失败
- ❌ 正则表达式匹配失败
- ❌ 代码审查时的困惑

### 使用方法

#### 1. 通过 npm script（推荐）

```bash
# 扫描整个 src 目录
pnpm check:invisible src/

# 只扫描 .vue 文件
pnpm check:invisible --ext vue src/

# 扫描多种文件类型
pnpm check:invisible --ext vue --ext ts --ext js src/

# 扫描单个文件
pnpm check:invisible path/to/file.vue
```

#### 2. 直接运行 Python 脚本

```bash
# 扫描整个目录
python3 scripts/detect-invisible-chars.py src/

# 只扫描 .vue 文件
python3 scripts/detect-invisible-chars.py --ext vue src/

# 扫描多种文件类型（多次使用 --ext）
python3 scripts/detect-invisible-chars.py --ext vue --ext ts --ext js src/

# 扫描多个目录
python3 scripts/detect-invisible-chars.py src/ features/

# 禁用彩色输出
python3 scripts/detect-invisible-chars.py --no-color src/
```

### 检测的不可见字符类型

| 字符 | Unicode | 名称 |
|------|---------|------|
| Zero Width Space | U+200B | 零宽空格 |
| Zero Width Non-Joiner | U+200C | 零宽不连字 |
| Zero Width Joiner | U+200D | 零宽连字 |
| Word Joiner | U+2060 | 词连接符 |
| BOM | U+FEFF | 零宽不换行空格 |
| Soft Hyphen | U+00AD | 软连字符 |
| LRM/RLM | U+200E/U+200F | 左/右标记 |
| 其他 | 各种 | 方向控制字符 |

### 输出示例

#### ✅ 无不可见字符

```
============================================================
🔍 不可见字符检测工具
============================================================

============================================================
📊 检测总结
============================================================

总文件数: 45
发现问题的文件: 0

🎉 所有文件都是干净的！
```

#### ❌ 发现不可见字符

```
============================================================
🔍 不可见字符检测工具
============================================================

❌ src/components/Example.vue: 发现 2 个不可见字符
  → 第 10 行, 第 5 列
    字符: Zero Width Space (U+200B)
  → 第 15 行, 第 20 列
    字符: Zero Width Non-Joiner (U+200C)

============================================================
📊 检测总结
============================================================

总文件数: 1
发现问题的文件: 1

💡 建议: 手动检查并删除这些不可见字符
```

### 如何清理不可见字符？

发现不可见字符后，可以使用以下方法清理：

1. **VS Code**:
   - 打开文件
   - 使用正则表达式搜索：`\u200b|\u200c|\u200d|\ufeff`
   - 替换为空

2. **Vim**:
   ```vim
   :s/\%u200b//g
   ```

3. **自动清理**（需要自己实现）:
   ```python
   import re
   with open('file.vue', 'r', encoding='utf-8') as f:
       content = f.read()
   clean = re.sub(r'[\u200B-\u200D\uFEFF]', '', content)
   with open('file.vue', 'w', encoding='utf-8') as f:
       f.write(clean)
   ```

### 集成到 CI/CD

可以在 CI 流程中添加检测步骤：

```yaml
# .github/workflows/code-quality.yml
- name: Check for invisible characters
  run: |
    python3 scripts/detect-invisible-chars.py src/
```

### 最佳实践

1. **提交前检查**：每次提交代码前运行检测
2. **作为 Pre-commit Hook**：配置 git pre-commit hook 自动检测
3. **定期扫描**：定期扫描整个代码库
4. **团队规范**：将检测工具集成到团队工作流中

### Troubleshooting

**Q: 为什么 argparse 报错 "paths" 参数缺失？**

A: 如果使用 `--ext` 参数，建议将路径放在最后，或者多次使用 `--ext`：
```bash
# ✅ 正确
pnpm check:invisible --ext vue src/

# ✅ 正确（路径在前）
pnpm check:invisible src/ --ext vue

# ❌ 错误（多个扩展名但只用一次 --ext）
pnpm check:invisible --ext vue ts js src/

# ✅ 正确（多次使用 --ext）
pnpm check:invisible --ext vue --ext ts --ext js src/
```

### 持久化记忆

✅ **已记录到 CLAUDE.md**：每次检查代码时会自动检测不可见字符

检测命令：
```bash
python3 scripts/detect-invisible-chars.py src/features/teacher/
```
