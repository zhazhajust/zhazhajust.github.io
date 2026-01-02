---
title: Linux cgroup 实现 SSH 用户资源限制指南
date: 2025-12-21 08:00:00
tags: [Linux, cgroup, 资源管理]
---

# Linux cgroup 实现 SSH 用户资源限制指南

## 概述

Linux 控制组（cgroup）是内核提供的资源管理机制，可用于限制、隔离和监控进程组（如用户会话）的资源使用。通过 systemd 与 cgroup 结合，我们可以为 SSH 登录用户设置公平的资源配额，避免单个用户过度占用 CPU、内存等系统资源，提升多用户环境的稳定性。本指南以实际脚本为例，逐步讲解配置方法。

## 环境准备

- **系统要求**：Linux 内核 ≥ 4.15（支持 cgroup v2），使用 systemd 作为初始化系统。
- **权限需求**：所有操作需 `sudo` 权限。

---

## 配置步骤

### 1. 清理现有配置

为避免残留配置干扰，首先清理旧配置：

```bash
#!/bin/bash
# 清理现有配置
sudo rm -rf /etc/systemd/system/user.slice.d/
sudo rm -rf /etc/systemd/system/user-*.slice.d/
```

**作用**：删除可能存在的旧切片配置目录，确保配置纯净。

### 2. 设置全局资源限制

创建全局切片配置，限制所有用户会话的总资源上限：

```bash
# 使用正确的配置文件方式
sudo mkdir -p /etc/systemd/system/user.slice.d/
sudo tee /etc/systemd/system/user.slice.d/global.conf << 'EOF'
[Slice]
CPUQuota=400%     # 限制所有用户会话合计最多使用 400% CPU（即 4 核）
MemoryMax=16G     # 限制所有用户会话合计最多使用 16GB 内存
EOF
```

**参数说明**：
- `CPUQuota=400%`：表示所有用户进程共享的 CPU 时间上限为 4 个核心的 100% 占用。
- `MemoryMax=16G`：全局内存使用硬限制。

### 3. 设置单用户默认限制

创建用户级模板，为每个登录用户分配独立配额：

```bash
# 创建用户默认模板（用户登录时自动应用）
sudo mkdir -p /etc/systemd/system/user@.service.d/
sudo tee /etc/systemd/system/user@.service.d/limit.conf << 'EOF'
[Service]
CPUWeight=100     # CPU 相对权重（默认 100，值越高优先级越高）
MemoryMax=4G      # 单用户内存使用上限为 4GB
EOF
```

**参数说明**：
- `CPUWeight=100`：基于 CPU 时间分配的权重（范围 1–10000），值越大获得的 CPU 时间越多。
- `MemoryMax=4G`：单用户内存硬限制，超限时进程会被终止。

### 4. 重载并生效配置

使新配置生效：

```bash
# 重载配置
sudo systemctl daemon-reload

# 可选：重启用户切片（或重启系统）
# sudo systemctl restart user.slice
```

**注意**：配置立即生效，但已登录用户需重新登录才能应用新限制。

---

## 验证资源配置

使用以下脚本检查当前 cgroup 设置：

```bash
#!/bin/bash
find /sys/fs/cgroup/user.slice -name "cpu.max" -type f -print0 |
while IFS= read -r -d '' file; do
  user_dir=$(dirname "$file")
  cpu_limit=$(cat "$file")
  mem_file="$user_dir/memory.max"
  
  if [ -f "$mem_file" ]; then
    mem_limit=$(cat "$mem_file")
  else
    mem_limit="未设置"
  fi
  
  echo "$user_dir: CPU=$cpu_limit, Memory=$mem_limit"
done
```

**输出示例**：
```
/user.slice/user-1000.slice: CPU=max 100000, Memory=4294967296
```
- `CPU=max 100000`：表示 CPU 时间限制为 100000 微秒/周期（即 100% 核心）。
- `Memory=4294967296`：内存限制字节数（此处 4GB）。

---

## 注意事项

1. **资源分配公平性**：`CPUWeight` 适用于 CPU 竞争场景，确保高权重用户获得更多资源。
2. **内存限制**：`MemoryMax` 为硬限制，超限时进程会触发 OOM Killer。
3. **持久化配置**：通过 systemd 配置可持久化，重启后依旧有效。
4. **调试建议**：若配置未生效，检查 `systemd-cgls` 或 `cat /sys/fs/cgroup/user.slice/*/cpu.max` 验证。

## 总结

通过 cgroup 和 systemd 的集成，我们可以高效管理多用户环境下的资源分配。本指南提供的脚本可直接用于生产环境，但需根据实际硬件资源调整参数值。合理配置资源限制能显著提升系统稳定性，避免资源争夺导致的性能下降。


```bash
#!/bin/bash
# 1. 清理现有配置
sudo rm -rf /etc/systemd/system/user.slice.d/
sudo rm -rf /etc/systemd/system/user-*.slice.d/
sudo rm -rf /etc/systemd/system/user@.service.d/

# 2. 使用正确的配置文件方式
sudo mkdir -p /etc/systemd/system/user.slice.d/
sudo tee /etc/systemd/system/user.slice.d/global.conf << 'EOF'
[Slice]
# CPUQuota=400%
# MemoryMax=16G
CPUQuota=
MemoryMax=
EOF

# 3. 创建用户默认模板（这会在用户登录时自动应用）
sudo mkdir -p /etc/systemd/system/user@.service.d/
sudo tee /etc/systemd/system/user@.service.d/limit.conf << 'EOF'
[Service]
# CPUWeight=100
CPUQuota=100%
MemoryMax=4G
EOF

# 给 root 的 slice 覆盖掉限制
sudo mkdir -p /etc/systemd/system/user-0.slice.d/

sudo tee /etc/systemd/system/user-0.slice.d/override.conf <<'EOF'
[Slice]
CPUQuota=
MemoryMax=
EOF

# 给特定用户 ID（例如 990）的 slice 覆盖掉限制
slurm_id=$(id -u slurm)
sudo mkdir -p /etc/systemd/system/user-$slurm_id.slice.d/

sudo tee /etc/systemd/system/user-$slurm_id.slice.d/override.conf <<'EOF'
[Slice]
CPUQuota=
MemoryMax=
CPUWeight=
EOF

# 4. 重载配置
sudo systemctl daemon-reload

# # 5. 重启用户切片（或重启系统）
# sudo systemctl restart user.slice
sudo systemctl restart systemd-logind
```
---

> 本文仅用于教育目的，操作前请备份重要数据。建议在测试环境验证后再部署到生产系统。