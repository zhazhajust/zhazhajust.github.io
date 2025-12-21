---
title: CentOS Stream 9 单节点 Slurm 集群部署指南
date: 2025-02-02 15:40:21
tags: [Slurm, HPC, 集群管理]
---

本文提供 CentOS Stream 9 单节点环境下安装配置 Slurm（含 slurmctld + slurmd）的标准流程，适用于开发、测试及单机调度场景。

## 一、环境假设与目标架构

### 1. 环境假设
- 操作系统：CentOS Stream 9（最小化或标准安装）
- 主机名：node1
- IP：192.168.1.10（示例）
- 角色：
  - 控制节点（Controller）：node1
  - 计算节点（Compute）：node1

### 2. Slurm 组件
- slurmctld：控制守护进程
- slurmd：计算节点守护进程
- slurmdbd：单机测试通常不需要

## 二、系统基础准备

### 1. 设置主机名与 hosts
```bash
hostnamectl set-hostname node1
cat >> /etc/hosts <<EOF
192.168.1.10   node1
EOF
```

### 2. 关闭防火墙（测试环境建议）
```bash
systemctl disable --now firewalld
```

### 3. 关闭 SELinux
```bash
sed -i 's/^SELINUX=.*/SELINUX=disabled/' /etc/selinux/config
setenforce 0
```

## 三、安装 Slurm 及依赖
CentOS 9 官方仓库已包含 Slurm，无需自行编译。

### 1. 安装 EPEL
```bash
dnf install -y epel-release
```

### 2. 安装 Slurm
```bash
dnf install -y slurm slurm-slurmd slurm-slurmctld munge
```

## 四、配置 Munge（Slurm 认证核心）
Slurm 强依赖 munge 进行节点认证。

### 1. 创建 munge key
```bash
/usr/sbin/create-munge-key
```

### 2. 设置权限
```bash
chown -R munge:munge /etc/munge /var/lib/munge /var/log/munge
chmod 400 /etc/munge/munge.key
```

### 3. 启动 munge
```bash
systemctl enable --now munge
```

### 4. 验证 munge
```bash
munge -n | unmunge
```
正常应看到：
```
STATUS:          Success (0)
```

## 五、创建 Slurm 用户与目录

### 1. 创建 slurm 用户
```bash
useradd -r -s /sbin/nologin slurm
```

### 2. 创建必要目录
```bash
mkdir -p /var/spool/slurm/{ctld,d}
mkdir -p /var/log/slurm
chown -R slurm:slurm /var/spool/slurm /var/log/slurm
```

## 六、配置 slurm.conf（核心）

### 1. 生成基础模板
```bash
cp /etc/slurm/slurm.conf.example /etc/slurm/slurm.conf
```

### 2. 编辑 /etc/slurm/slurm.conf
最小可用单机配置示例：

slurm.conf 示例：
```conf
############################
# 基本集群信息
############################
ClusterName=single_cluster
SlurmctldHost=node1(127.0.0.1)
SlurmUser=slurm
SlurmdUser=root

############################
# 端口
############################
SlurmctldPort=6817
SlurmdPort=6818

############################
# 状态与日志
############################
StateSaveLocation=/var/spool/slurm/ctld
SlurmdSpoolDir=/var/spool/slurm/d
SlurmctldLogFile=/var/log/slurm/slurmctld.log
SlurmdLogFile=/var/log/slurm/slurmd.log

############################
# 认证
############################
AuthType=auth/munge
CryptoType=crypto/munge

############################
# 调度器
############################
SchedulerType=sched/backfill
SchedulerParameters=bf_continue,bf_interval=30

############################
# 资源选择（关键）
############################
SelectType=select/cons_res
SelectTypeParameters=CR_Core_Memory

############################
# cgroup（生产必开）
############################
ProctrackType=proctrack/cgroup
TaskPlugin=task/cgroup
# TaskPluginParam=Sched
JobAcctGatherType=jobacct_gather/cgroup

############################
# 进程跟踪 / 清理
############################
KillOnBadExit=1
ReturnToService=2

############################
# 超时
############################
SlurmctldTimeout=300
SlurmdTimeout=300

############################
# 节点定义（按真实资源）
############################
NodeName=node1 \
  CPUs=56 \
  RealMemory=128027 \
  Sockets=2 \
  CoresPerSocket=28 \
  ThreadsPerCore=1 \
  Gres=gpu:V100:8 \
  State=UNKNOWN

GresTypes=gpu

############################
# 分区定义
############################
PartitionName=debug \
  Nodes=node1 \
  Default=YES \
  MaxTime=1:00:00 \
  State=UP

PartitionName=normal \
  Nodes=node1 \
  MaxTime=7-00:00:00 \
  State=UP
```

cgroup.conf 示例：

```conf
###
#
# Slurm cgroup support configuration file
#
# See man slurm.conf and man cgroup.conf for further
# information on cgroup configuration parameters
#--
CgroupMountpoint=/sys/fs/cgroup
CgroupAutomount=yes

ConstrainCores=yes
ConstrainRAMSpace=yes
ConstrainSwapSpace=yes
ConstrainDevices=yes

AllowedRAMSpace=100
AllowedSwapSpace=0

MaxRAMPercent=98
MaxSwapPercent=0

MinRAMSpace=30
```

**注意**：
- `CPUs` 和 `RealMemory` 根据 `lscpu`、`free -m` 实际调整
- `NodeName` 必须与 hostname 完全一致

## 七、启动 Slurm 服务

### 1. 启动 slurmctld
```bash
systemctl enable --now slurmctld
```

### 2. 启动 slurmd
```bash
systemctl enable --now slurmd
```

## 八、验证 Slurm 状态

### 1. 查看节点状态
```bash
sinfo
```
期望输出：
```
PARTITION AVAIL  TIMELIMIT  NODES  STATE NODELIST
debug        up   infinite      1   idle node1
```

### 2. 查看节点详情
```bash
scontrol show node node1
```

## 九、提交测试任务

### 1. 交互式任务
```bash
srun -n 1 hostname
```

### 2. 批处理任务
```bash
cat > test.sh <<EOF
#!/bin/bash
#SBATCH -n 1
#SBATCH -o test.out

hostname
sleep 10
EOF

sbatch test.sh
```

查看任务：
```bash
squeue
```

## 十、常见问题排查

### 1. 节点状态为 DOWN
```bash
scontrol update NodeName=node1 State=RESUME
```

### 2. 查看日志
```bash
journalctl -u slurmctld -f
journalctl -u slurmd -f
```

### 3. Munge 错误
- 确认 munge 正在运行
- `/etc/munge/munge.key` 权限必须是 400

## 十一、slurmdbd 需求分析

| 场景             | 是否需要 |
|------------------|----------|
| 单机测试         | 否       |
| 作业计费/统计    | 是       |
| 多用户审计       | 是       |

如需以下扩展配置，请说明使用场景：
- CentOS 9 + slurmdbd + MariaDB 配置
- GPU（NVIDIA）节点配置
- cgroup 资源隔离详细配置
- 多节点集群扩展方案

## 十二、GPU 配置（V100 示例）

### 1. 确认 GPU 设备
```bash
ls -l /dev/nvidia*
```
输出示例：
```
/dev/nvidia0
/dev/nvidia1
/dev/nvidiactl
/dev/nvidia-uvm
```

### 2. 配置 gres.conf
```bash
vi /etc/slurm/gres.conf
```
示例（2 × V100）：
```conf
NodeName=node1 Name=gpu Type=V100 File=/dev/nvidia0
NodeName=node1 Name=gpu Type=V100 File=/dev/nvidia1
```

**要点**：
- `Type=V100` 是 `--gres=gpu:V100:x` 参数的关键
- `NodeName` 必须和 slurm.conf 完全一致

### 3. 修改 slurm.conf
在节点定义中添加 GPU 资源：
```conf
NodeName=node1 \
  CPUs=64 \
  RealMemory=125000 \
  Gres=gpu:V100:2 \
  State=UNKNOWN
```

### 4. 启用 GPU 隔离
确认 `/etc/slurm/cgroup.conf` 包含：
```conf
ConstrainDevices=yes
```
**重要**：未启用隔离会导致所有作业都能访问全部 GPU

### 5. 重启服务
```bash
systemctl restart slurmctld slurmd
```

## 十三、GPU 功能验证

### 1. 查看节点资源
```bash
scontrol show node node1
```
应包含：
```
Gres=gpu:V100:2
GresUsed=0
```

### 2. 查看 GPU 视图
```bash
sinfo -o "%N %G"
```
输出示例：
```
node1 gpu:V100:2
```

## 十四、GPU 作业示例

### 1. 交互式任务（单 GPU）
```bash
srun --gres=gpu:V100:1 --pty bash
nvidia-smi  # 应只看到1张GPU
```

### 2. 批处理任务
```bash
cat > gpu_test.sh <<'EOF'
#!/bin/bash
#SBATCH -J gpu_test
#SBATCH --gres=gpu:V100:1
#SBATCH --cpus-per-task=4
#SBATCH --mem=16G
#SBATCH -o gpu_test.out

nvidia-smi
sleep 30
EOF

sbatch gpu_test.sh
```

### 3. 多 GPU 任务
```bash
srun --gres=gpu:V100:2 --pty bash
```

## 十五、常见 GPU 问题

### ❌ 作业内能看到所有 GPU
**原因**：
- `ConstrainDevices=no`
- 未使用 `task/cgroup`

**修复**：
```conf
ConstrainDevices=yes
TaskPlugin=task/cgroup
```

### ❌ 提交 GPU 作业一直排队
```bash
squeue
scontrol show job <jobid>
```
**常见原因**：
- GPU 已被占用
- 请求的 GPU 类型错误（如写成 A100）

### ❌ GPU 规格指定差异
| 写法                | 行为         |
|---------------------|--------------|
| `--gres=gpu:1`      | 使用任意 GPU |
| `--gres=gpu:V100:1` | 仅使用 V100  |

生产环境建议始终指定 GPU 类型

## 十六、生产环境建议

### 1. 资源限制
在分区配置中添加：
```conf
DefMemPerGPU=32000  # 每GPU分配32GB内存
```
避免 GPU 作业抢占全部内存

### 2. 节点隔离
未来扩展多节点时，使用独立分区区分 GPU/CPU 节点

## 总结
V100 GPU 的配置需要同时满足：
1. 正确的 `gres.conf` 定义
2. `slurm.conf` 中的资源声明
3. `cgroup.conf` 的设备隔离

根据需求可进一步配置：
- MIG / 多 GPU 混合调度
- GPU + CPU 绑核（NUMA 亲和）
- GPU 分区 / QOS
- 多用户 GPU 计费