---
title: 'Frequency moved undulator'
date: '2022-09-15'
---

## Smilei or EPOCH

Mark the oscillate electrons, and save the field produced by them. Then sparated them from the total electric field and save to a new file.

## 光波荡器推导

假设平面波激光方向为$\hat k = \textbf{k}/k_L$，则 $B = (\hat k \times E)/c$,电子在激光场中运动方程写为：

$\frac{d}{dt}(\gamma mc \beta) = -e(E + v \times B)$

$\frac{d}{dt}(\gamma mc \beta) = -e[E + \beta \times (\hat k \times E)] = -e[E + (\beta \cdot E)\hat k - (\beta \cdot \hat k)E]$

我们假设激光沿着x方向偏振，$E = E_0 sin(\omega_Lt − k \cdot x)\hat x$，沿着z方向传播，与z轴呈夹角$\varphi$，波矢$k = k_L(0, -sin \varphi, +cos \varphi)$，并且 $\omega_L = ck_L$。运动方程写为：

$\frac{d}{dt}(\gamma mc \beta) = -eE_0sin(ck_Lt - \textbf{k} \cdot x)[1 - (\hat k \cdot \beta)] = \frac{eE_0}{ck_L}\frac{d}{dt}cos(ck_Lt - \textbf{k} \cdot x)$

方程表明水平方向动量守恒，通过积分可以很容易得出，

$\beta_x = \frac{eE_0}{\gamma mc^2k_L}cos(ck_Lt - \textbf{k}\cdot x)$

波荡器参数为$K = \frac{eE_0}{mc^2k_L}$，对于Undulator， $K<<1$，$t \approx c/\beta_z$，横向振动速度为$cos(k_L(1/\overline{\beta}_z - cos\varphi)z + k_Lysin\varphi)$，则波荡器周期为：

$\lambda_u \rightarrow \frac{\overline{\beta}_z\lambda_L}{1 - \overline{\beta}_zcos\varphi}$

将波荡器周期和参数K带入波荡器辐射公式,

$\frac{\lambda_1(\phi)}{c} = \frac{\lambda_u}{c}[\frac{1 + K^2/(4\gamma^2)}{\beta} - (1 - \frac{\phi^2}{2})] \approx \frac{\lambda_u}{c}\frac{1 + K^2/2 + \gamma^2\phi^2}{2\gamma^2}$

同步辐射共振波长为

$\lambda = \frac{1 + K^2/2}{2\gamma^2}\frac{\lambda_L}{1 - \overline{\beta}_zcos\varphi}$

当满足$\varphi \rightarrow 0, K << 1(undulator的假设)$时

$\lambda \rightarrow \lambda_L$

## 时间收缩效应

假设$t^{'}$为粒子静止坐标系，则 $1 - \beta(t^{'})cos\phi(t^{'})$ 为时间收缩因子，对于相对论电子，

$\beta = \sqrt{1 - \frac{1}{\gamma^2}} \approx 1 - \frac{1}{1\gamma^2}$

对于gamma >> 1，$\phi << 1$

$1 - \beta cos\phi \approx \frac{1}{2}(\frac{1}{\gamma^2} + \phi^2)$