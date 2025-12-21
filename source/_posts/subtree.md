---
title: Subtree仓库添加
date: 2025-02-02 11:26:21
tags:
---

## Step 1
初始化 git 仓库并提交初始文件

```bash
# 在当前目录初始化仓库
git init

# 创建或编辑 README.md（示例）
echo "# 项目" > README.md

# 将所有改动添加到暂存区
git add .

# 提交到本地仓库
git commit -m "Init"
```

解释：
- git init：在当前目录创建一个新的 Git 仓库（.git 目录）。
- git add .：把当前目录下的所有新文件和修改记录到暂存区，准备提交。
- git commit -m "Init"：把暂存区内容作为一次提交写入本地仓库，-m 后面是提交说明。

## Step 2
把另一个仓库作为子树（subtree）添加到本仓库的某个目录

```bash
# 添加远程仓库（label 为远程名，<git-url> 为远程仓库地址）
git remote add label <git-url>

# 抓取远程分支到本地（不合并，只获取引用和对象）
git fetch label

# 将远程仓库的某个分支以子树形式合并到当前仓库的指定目录
git subtree add --prefix=<path> label <branch>
# 可选：加上 --squash 将远程历史合并为单个提交
# git subtree add --prefix=<path> label <branch> --squash
```

解释：
- git remote add label <git-url>：为远程仓库起一个名字（这里用 label），便于后续引用。
- git fetch label：从名为 label 的远程抓取最新对象和引用，但不自动合并到当前分支。
- git subtree add --prefix=<path> label <branch>：
    - --prefix=<path>：把子仓库的内容导入到当前仓库的 <path> 目录下（该目录会被创建）。
    - label：上一步添加的远程名。
    - <branch>：远程仓库中要导入的分支名（如 master 或 main）。
    - 该命令会把远程分支的内容合并到本仓库的指定目录，并保留可追溯的合并提交；--squash 可把全部历史压缩为一个提交。

补充常用操作：
- 更新子树到远程最新：git subtree pull --prefix=<path> label <branch> [--squash]
- 将子树的变更推送回远程：git subtree push --prefix=<path> label <branch>

注意事项：
- git subtree 在现代 Git 中通常可用；若不可用，需安装 contrib 工具或使用其他方式（如 git submodule）。
- 在使用前确认 <path>、<git-url>、<branch> 填写正确，避免覆盖已有重要文件。
- 若希望保留完整历史，勿使用 --squash；若想保持主仓库历史简洁，可使用 --squash。
- 相关操作会在本地产生合并提交，合并策略与普通合并类似，请根据需要在分支上操作并做好备份。
