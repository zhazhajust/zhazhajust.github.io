---
title: Subtree仓库添加
date: 2025-02-02 11:26:21
tags:
---

## Step 1
初始化git仓库
git init
添加README.md文件
git add .
git commit -m "Init"

## Step 2
添加git subtree仓库
git remote add label <git-url>
git fetch label
git add subtree --prefix=<path> label/<branch>
