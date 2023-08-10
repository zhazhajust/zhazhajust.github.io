---
title: '远程连接与唤醒'
date: '2023-08-10'
---

## 简介

首先准备好公网ipv4 or ipv6，使用ddns-go绑定动态ip地址到dns服务器（静态ip不需要），此时可。随后运行WolGoWeb服务，即可使用url进行远程唤醒。

## dynv6

使用 https://dynv6.com 进行动态域名解析，绑定ipv6于自定义域名 https://xxx.dynv6.net 。

## ddns-go

简单好用的DDNS。自动更新域名解析到公网IP(支持阿里云、腾讯云、Dnspod、Cloudflare、Callback、华为云、百度云、Porkbun、GoDaddy、Google Domain)

https://github.com/jeessy2/ddns-go.git

此时，ipv6已解析于ddns服务器，通过自定义url可以通过远程连接软件如rdp、moonlight、parsec等直接访问。

## WolGoWeb

基于Golang的Web服务器，使用url链接即可发起wake on lan局域网唤醒。

https://github.com/zhazhajust/WolGoWeb.git

然后测试url唤醒，在浏览器输入 http://xxx:9090/wol?mac=00-00-00-00-00-00 （网卡MAC地址）。

### 参考文献

https://www.jianshu.com/p/6622c33f4cd3

https://zhouym.tech/2022/Wake-On-Lan/