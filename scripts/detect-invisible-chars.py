#!/usr/bin/env python3
"""
检测文件中的不可见字符

用法:
  # 扫描单个文件
  python scripts/detect-invisible-chars.py path/to/file.vue

  # 扫描整个目录
  python scripts/detect-invisible-chars.py src/

  # 只扫描 .vue 文件
  python scripts/detect-invisible-chars.py --ext vue src/

  # 扫描多个目录
  python scripts/detect-invisible-chars.py src/ features/
"""

import argparse
import os
import re
import sys
from pathlib import Path
from typing import List, Tuple


# 不可见字符定义
INVISIBLE_CHARS = {
    '\u200B': 'Zero Width Space',
    '\u200C': 'Zero Width Non-Joiner',
    '\u200D': 'Zero Width Joiner',
    '\u2060': 'Word Joiner',
    '\uFEFF': 'Zero Width No-Break Space (BOM)',
    '\u00AD': 'Soft Hyphen',
    '\u034F': 'Combining Grapheme Joiner',
    '\u180B': 'Mongolian Free Variation Selector One',
    '\u180C': 'Mongolian Free Variation Selector Two',
    '\u180D': 'Mongolian Free Variation Selector Three',
    '\u200E': 'Left-to-Right Mark',
    '\u200F': 'Right-to-Left Mark',
    '\u202A': 'Left-to-Right Embedding',
    '\u202B': 'Right-to-Left Embedding',
    '\u202C': 'Pop Directional Formatting',
    '\u202D': 'Left-to-Right Override',
    '\u202E': 'Right-to-Left Override',
    '\uFFFD': 'Replacement Character',  # 添加：替换字符
}

# 编译正则表达式
INVISIBLE_PATTERN = re.compile('[' + ''.join(INVISIBLE_CHARS.keys()) + ']')


class Colors:
    """ANSI 颜色代码"""
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    MAGENTA = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    RESET = '\033[0m'
    BOLD = '\033[1m'


def print_error(msg: str):
    """打印错误信息"""
    print(f"{Colors.RED}❌ {msg}{Colors.RESET}")


def print_success(msg: str):
    """打印成功信息"""
    print(f"{Colors.GREEN}✅ {msg}{Colors.RESET}")


def print_warning(msg: str):
    """打印警告信息"""
    print(f"{Colors.YELLOW}⚠️  {msg}{Colors.RESET}")


def print_info(msg: str):
    """打印信息"""
    print(f"{Colors.BLUE}ℹ️  {msg}{Colors.RESET}")


def print_header(msg: str):
    """打印标题"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{msg}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.CYAN}{'='*60}{Colors.RESET}\n")


def detect_invisible_chars(file_path: Path) -> List[Tuple[int, int, str, str]]:
    """
    检测文件中的不可见字符

    返回: [(行号, 列号, 字符, 字符名称), ...]
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
    except Exception as e:
        print_error(f"无法读取文件 {file_path}: {e}")
        return []

    results = []

    for line_num, line in enumerate(lines, start=1):
        for match in INVISIBLE_PATTERN.finditer(line):
            char = match.group()
            char_name = INVISIBLE_CHARS.get(char, f'Unknown (U+{ord(char):04X})')
            col_num = match.start() + 1
            results.append((line_num, col_num, char, char_name))

    return results


def format_file_path(file_path: Path, base_path: Path = None) -> str:
    """格式化文件路径，显示相对路径"""
    if base_path:
        try:
            return str(file_path.relative_to(base_path))
        except ValueError:
            pass
    return str(file_path)


def scan_file(file_path: Path, base_path: Path = None) -> bool:
    """
    扫描单个文件

    返回: 是否发现不可见字符
    """
    results = detect_invisible_chars(file_path)

    if not results:
        return False

    # 发现不可见字符
    rel_path = format_file_path(file_path, base_path)
    print_error(f"{rel_path}: 发现 {len(results)} 个不可见字符")

    # 显示详细信息
    for line_num, col_num, char, char_name in results[:5]:  # 最多显示5个
        print(f"  {Colors.YELLOW}→ 第 {line_num} 行, 第 {col_num} 列{Colors.RESET}")
        print(f"    {Colors.CYAN}字符: {char_name} (U+{ord(char):04X}){Colors.RESET}")

    if len(results) > 5:
        print(f"  {Colors.YELLOW}... 还有 {len(results) - 5} 个{Colors.RESET}")

    return True


def scan_directory(
    directory: Path,
    extensions: List[str] = None,
    base_path: Path = None
) -> Tuple[int, int]:
    """
    扫描目录

    返回: (文件总数, 发现问题的文件数)
    """
    if base_path is None:
        base_path = directory

    total_files = 0
    error_files = 0

    for root, dirs, files in os.walk(directory):
        # 跳过隐藏目录和 node_modules
        dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']

        for filename in files:
            file_path = Path(root) / filename

            # 跳过隐藏文件
            if filename.startswith('.'):
                continue

            # 过滤文件扩展名
            if extensions:
                if not any(filename.endswith(f'.{ext}') for ext in extensions):
                    continue

            total_files += 1

            if scan_file(file_path, base_path):
                error_files += 1

    return total_files, error_files


def main():
    parser = argparse.ArgumentParser(
        description='检测文件中的不可见字符',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument(
        '--ext',
        action='append',
        help='只扫描指定扩展名的文件（可多次使用: --ext vue --ext ts）'
    )
    parser.add_argument(
        '--no-color',
        action='store_true',
        help='禁用彩色输出'
    )
    parser.add_argument(
        'paths',
        nargs='+',
        type=Path,
        help='要扫描的文件或目录路径'
    )

    args = parser.parse_args()

    # 处理扩展名列表
    extensions = None
    if args.ext:
        extensions = args.ext

    # 禁用颜色
    if args.no_color:
        for attr in dir(Colors):
            if not attr.startswith('_'):
                setattr(Colors, attr, '')

    print_header('🔍 不可见字符检测工具')

    total_files = 0
    error_files = 0

    for path in args.paths:
        if not path.exists():
            print_error(f"路径不存在: {path}")
            continue

        if path.is_file():
            total_files += 1
            if scan_file(path):
                error_files += 1
        elif path.is_dir():
            t, e = scan_directory(path, extensions)
            total_files += t
            error_files += e

    # 打印总结
    print_header('📊 检测总结')
    print(f"总文件数: {total_files}")
    print(f"发现问题的文件: {Colors.RED if error_files > 0 else Colors.GREEN}{error_files}{Colors.RESET}")

    if error_files > 0:
        print(f"\n{Colors.YELLOW}💡 建议: 手动检查并删除这些不可见字符{Colors.RESET}")
        sys.exit(1)
    else:
        print(f"\n{Colors.GREEN}🎉 所有文件都是干净的！{Colors.RESET}")
        sys.exit(0)


if __name__ == '__main__':
    main()
