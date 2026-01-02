---
title: Podman Compose 容器无法访问外网：Rootless 网络原理与解决方案（pasta vs slirp4netns）
date: 2026-01-02 00:00:00
tags:
  - podman
  - docker
  - compose
  - linux
  - network
  - rootless
categories:
  - 运维
  - 容器
---

> 现象：同一份 `docker-compose.yml`，用 **Docker Compose** 启动后容器能访问外网；用 **Podman Compose** 启动后容器访问外网失败。  
> 结论：通常不是业务问题，而是 **Podman Rootless 网络实现与 Docker Rootful NAT Bridge 的差异**导致。

## 一、现象与定位

我这边首先用一条命令确认 Podman 的运行模式与网络后端：

```bash
podman info --format '{{.Host.Security.Rootless}} {{.Host.NetworkBackend}}'
````

输出：

```text
true netavark
```

含义：

* `true`：说明是 **rootless（非 root）** 模式在运行容器。
* `netavark`：Podman 的网络后端（负责创建网络等）。

**关键点**：Docker 常见是 rootful + bridge NAT，Podman rootless 则不能直接使用内核层面的 iptables/nftables NAT 规则，需要走 rootless 专用的网络方案（如 `pasta` / `slirp4netns`）。

---

## 二、为什么 Docker 能外网，Podman rootless 却不行？

### 1）NAT 出口是什么？

容器通常拿到的是私网地址（例如 `10.x` / `172.16-31.x` / `192.168.x`）。这些地址在公网是**不可路由**的：

* 容器发起公网请求时，源 IP 是私网地址；
* 公网服务器回包时不知道该把响应发回哪里（私网地址在公网不可达）。

因此需要一个“出口”把私网源地址**改写**成宿主机可路由的地址，并维护映射关系，让回包能正确回到容器。这种机制就是 **NAT（Network Address Translation）**，对应的位置就是 **NAT 出口**。

简化理解：

* 出去：`容器私网 IP:端口` → 改写成 `宿主机对外 IP:端口`
* 回来：根据映射表把回包还原 → 转发回容器

Docker 默认 bridge 网络会配合内核 NAT（iptables/nftables）实现这一点，所以“出公网”通常很稳。

### 2）rootless 的限制：没有特权做系统级 NAT

在 rootless 模式下，Podman 运行在普通用户权限，**不能随意修改系统的 iptables/nftables 规则**，于是需要使用 rootless 专用的网络方案来实现联网。

Podman rootless 常见两种网络实现：

* `pasta`：尽量让容器“像在宿主机网络上一样”，但在某些环境里（多网卡、VPN、策略路由、默认路由复杂等）可能出现出口选择/回程路径问题；并且其行为与 Docker 的经典 NAT bridge 不完全一致。
* `slirp4netns`：通过用户态方式提供一个更“传统”的 **NAT 出口模型**（更接近 Docker bridge + NAT 的体验），很多场景下对“访问外网（HTTP/HTTPS）”更稳定。

---

## 三、排查思路（快速判断是路由问题还是 DNS 问题）

进容器测试：

```bash
podman exec -it <容器名> sh -lc '
ip route;
cat /etc/resolv.conf;
curl -I https://1.1.1.1 || true;
curl -I https://example.com || true
'
```

解释：

* `curl https://1.1.1.1` 也失败：多半是 **路由/NAT/出口**问题。
* `1.1.1.1` 通但 `example.com` 不通：多半是 **DNS** 问题（可考虑在 compose 显式配置 `dns:` 或检查 base 配置是否在 Podman 下合并生效）。

---

## 四、最终解决方案：切换 rootless 默认网络为 slirp4netns

编辑配置文件：

`~/.config/containers/containers.conf`

加入：

```ini
[network]
default_rootless_network_cmd = "slirp4netns"
```

重建容器：

```bash
podman compose down
podman compose up -d
```

**结果**：容器恢复可访问外网。

### 为什么这个改动有效？

因为它把 rootless 容器的出网方式切换成 `slirp4netns` 的用户态 NAT 模型，提供更明确的“虚拟网关 + NAT 出口”，从而让私网地址的容器流量能稳定转换并访问公网（更接近 Docker 默认 bridge 的行为）。

---

## 五、备选方案

### 方案 A：直接用 rootful 运行（更接近 Docker）

如果环境允许（并且你希望网络行为尽量和 Docker 一致）：

```bash
sudo podman compose up -d
```

rootful 下可以使用更标准的内核桥接与 NAT 能力。

### 方案 B：保持 pasta，但指定出口接口（适合复杂路由）

如果你必须使用 `pasta`（例如你更在意性能、或需要某些 pasta 特性），可以考虑指定正确的出公网接口，避免出口选择错误（多网卡/VPN/策略路由环境尤其重要）。

---

## 六、总结

* **Docker Compose 能外网**：典型是 rootful + bridge + 内核 NAT，出网路径明确。
* **Podman Compose 外网失败（常见）**：rootless 模式下网络实现不同，默认方案在某些环境里不稳定或行为不等价。
* **最快/最稳的修复**：rootless 切换默认网络为 `slirp4netns`：

```ini
[network]
default_rootless_network_cmd = "slirp4netns"
```

如果你也遇到“Docker 能联网但 Podman 不行”的情况，优先检查是不是 rootless，并用以上方式切换网络实现，通常能立刻解决。

```
::contentReference[oaicite:0]{index=0}
```
