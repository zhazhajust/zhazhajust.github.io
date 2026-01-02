---
title: '偏微分方程求解'
date: '2022-08-17'
---

# 偏微分方程求解

对于波动方程等偏微分方程，难以直接求解析解，一般采用数值方法求解。目前电磁学主要通过有限元法（FEM）（通过Galerkin法基函数分解）、有限时域差分法（FDTD）、矩量法（MoM）等进行数值模拟。对于更一般的偏微分方程求解方法，这里介绍Method of Lines方法求解。

## Method of Lines

Method of Lines是求解偏微分方程的一种通用计算方法。Method of Lines方法通过空间离散，将偏微分方程转化为常微分方程组ODEs，后续通过Eular法，隐式欧拉法（牛顿迭代、不动点法）等求解。

## 基本案例

例：求解扩散方程

$$
\frac{\partial u}{\partial t} = D\frac{\partial^2 u}{\partial x^2}
$$

将$D\frac{\partial^2}{\partial x^2}$离散化为矩阵$A$，将$\frac{d}{dt}U$写为$\dot U$，使用矩阵形式表示为$\dot U = AU$。


例如$\frac{du_i}{dt} = -v\frac{du}{dx}$
方程转化为$\frac{du_i}{dt} = -v\frac{(u_i - u_{i-1})}{\delta x}, 1 \leq i \leq M$，再转化为矩阵形式。

## forward eular

讲矩阵乘积写为函数形式
$$
\dot U = F(U)
$$
则可使用前向欧拉法进行求解
$$
U_{k+1} = U_k + \delta tF(U_k)
$$

## RK方法

龙格库塔方法显式求解Method of Lines得到的ODEs，可以得到更高精度的解。

积分中值定理可以得出
$$
U(t + \delta t) = U(t) + \delta tF(U(t + \frac{1}{2}\delta t)) + O(\delta t^3)
$$

龙格库塔法通过预测$U(t + \frac{1}{2}\delta t)$来使用前向欧拉法
$$
\widetilde U_{k+\frac{1}{2}} = U_k + \frac{\delta t}{2}F(U_k)
$$

$$
U_{k+1} = U_k + \delta tF(\widetilde U_{k+\frac{1}{2}})
$$

这是一种两阶段方法。第一阶段预测中点值，第二阶段，即校正阶段，使用预测的中点值进行时间步进。