---
title: Cloudflare tunnel 内网穿透
date: 2025-02-02 15:40:21
tags:
---

- https://cloudflared.cn/get-started/create-local-tunnel/

Cloudflare 实现内网穿透主要通过其 **Cloudflare Tunnel**（也叫 Argo Tunnel）功能来实现。它允许你在不暴露公共 IP 的情况下，将本地服务器或应用暴露到互联网上，从而实现内网穿透。以下是 Cloudflare Tunnel 的基本工作原理和步骤：

### 工作原理：
1. **Cloudflare Tunnel** 创建了一个从本地服务器到 Cloudflare 的加密隧道。你的应用或服务运行在内网中，但它通过这个隧道连接到 Cloudflare 的网络。
2. **Cloudflare 网络** 接收到来自用户请求的流量，然后转发到本地服务器。
3. 用户与本地服务进行交互时，数据流经过加密隧道传输，从而避免了暴露内网 IP 地址和端口。

### 实现步骤：
1. **注册 Cloudflare 账户并添加域名：**
   - 如果还没有 Cloudflare 账户，首先去 [Cloudflare 官网](https://www.cloudflare.com) 注册一个。
   - 将你的域名添加到 Cloudflare，并修改 DNS 设置（如果是现有域名）。

2. **安装 Cloudflare Tunnel 客户端：**
   - 在你的本地服务器上安装 `cloudflared` 客户端。你可以通过 [Cloudflare 的官方文档](https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/installation) 了解详细的安装过程。大致步骤：
     - 在 Linux 上，你可以使用以下命令：
       ```bash
       wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
       sudo dpkg -i cloudflared-linux-amd64.deb
       ```
       对于没有sudo权限的普通用户
       ```bash
       wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
       ```
     - 也可以在 macOS、Windows 等其他平台上进行类似安装。
     

3. **认证 Cloudflare Tunnel：**
   - 在服务器上运行以下命令，进行认证：
     ```bash
     cloudflared tunnel login
     ```
   - 该命令会打开一个浏览器窗口，要求你登录到 Cloudflare 账户并授权。

4. **创建 Tunnel：**
   - 创建一个新的 Tunnel：
     ```bash
     cloudflared tunnel create <tunnel-name>
     ```
   - 这会生成一个隧道 ID 和证书文件。

5. **配置 Tunnel 代理：**
   - 设置隧道代理，通常是在本地应用监听的端口上。例如，如果你的服务在 `localhost:8080` 上运行，可以使用以下命令将流量通过隧道转发：
     ```bash
     cloudflared tunnel --url http://localhost:8080
     ```
   - 或者也可以直接更改配置文件"~/.cloudflared/config.yml"
    ```
    tunnel: 6bc4c976-1c0c-45a4-bab0-93b7eed4e1d1 # 你的 Tunnel ID
    credentials-file: /home/yujq2/.cloudflared/6bc4c976-1c0c-45a4-bab0-93b7eed4e1d1.json

    ingress:
    - hostname: rentereview.cn
        service: http://localhost:8080  # 你的 Web 服务监听端口
    - service: http_status:404
    ```
   - 然后运行
    ```bash
    cloudflared tunnel run <tunnel-name>
    ```
6. **配置 DNS 和路由：**
   - 在 Cloudflare 控制面板中，配置你的 DNS 设置，将域名指向 `cloudflare-tunnel`。
   - 在 Cloudflare 的 DNS 配置中，添加一条 CNAME 记录，将子域（例如 `tunnel.yourdomain.com`）指向 `tunnel.cloudflare.com`。
   - 总结一下
   - 在 Cloudflare 控制面板中，通过 DNS 设置，手动添加一个 CNAME 记录，将子域（如 tunnel.retereview.cn）指向 your-tunnel-id.cfargotunnel.com。
   - 确保你的 Cloudflare Tunnel 在本地启动并运行。
   - 等待 DNS 记录生效后，你应该就可以通过访问 tunnel.retereview.cn 来访问你本地的服务了。

   - 或者通过cloudflared程序进行路由
   ```bash
   cloudflared tunnel route dns jayzquaz rentereview.cn
   ```
   - 这将把域名 retereview.cn 路由到名为 jayzquaz 的 Tunnel。
7. **启动和验证：**
   - 运行 Cloudflare Tunnel 服务：
     ```bash
     cloudflared tunnel run <tunnel-name>
     ```
   - 此时，你的本地服务就已经通过 Cloudflare Tunnel 暴露到互联网上了。

8. **启用 "Always Use HTTPS" 设置**
   - Cloudflare 提供了一个非常简单的方法来自动将所有 HTTP 流量重定向到 HTTPS：通过 "Always Use HTTPS" 选项。这是最直接的方式，适用于大多数场景。

   - 操作步骤：
   - 登录到你的 Cloudflare 控制面板。
   - 选择你要配置的域名。
   - 进入 "SSL/TLS" 设置页面。
   - 在页面顶部，点击 "Edge Certificates" 选项卡。
   - 向下滚动，找到 "Always Use HTTPS" 设置。
   - 开启这个选项，将所有的 HTTP 请求自动重定向到 HTTPS。

### 优点：
- **安全性高**：内网不需要暴露在公网，只通过加密隧道进行通信。
- **无公网 IP**：适用于没有固定公网 IP 的环境。
- **简化配置**：不需要复杂的端口映射或 NAT 配置。

### 注意：
- Cloudflare Tunnel 是一种基于 Cloudflare 的服务，因此需要有一个 Cloudflare 账户，并且 DNS 需要指向 Cloudflare 才能使用。
- 可能会有流量限制或费用问题，特别是在高流量场景下。

这种方式的好处是可以轻松实现内网穿透，并且利用 Cloudflare 的全球加速和安全防护功能，使你的应用更加可靠和安全。如果有其他问题，或对某些配置有疑问，欢迎继续提问！
