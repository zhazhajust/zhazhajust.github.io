---
title: '牛顿迭代法隐式欧拉法求解微分方程'
date: '2022-08-16'
---

# 牛顿迭代法求解ODE

首先根据 dy/dx = f(x, y) 构建 F(x, y) = 0，然后求解F(x, y)对y的导数，然后迭代求解零点误差 abs(F(x, y) - F(x, next_y)) 最小处的y，将next_y作为y带入下一个递归，

```
import matplotlib.pyplot as plt
import numpy as np
import sympy

x = np.zeros(20)
y = np.zeros(20)
y_E = np.zeros(20)
z = np.zeros(20)
x[0] = 0
y[0] = 1
y_E[0] = 1
z[0] = (1+2*x[0])**0.5
h = 0.05

# dy/dx 导数
def f(x, y):
    return y-2*x/y

############################
##### 牛顿迭代法构建方程 #####
############################

# dy/dx = f(x, y)
# y - yn = (x - xn) * f(x, y)
# h * f(x, y) - (y - yn) = 0
def F(x, y, yn):
    return h * f(x, y) - (y - yn)

# 求解dF(x, y, yn)/dy
# d(0.05 * (y - 2*x/y) - y + yn) / dy
# 0.05 * (1 + 2*x/y**2) - 1
# 0.1 * x/y**2 - 0.95
def dF(x, y):
    return 0.1*x/y**2 - 0.95

############################
############################
############################

def newtonMethod(assum, d1, d3):
    y = assum
    Next_y = 0
    if F(d1, y, d3) == 0.0:
        return  y
    else:
        Next_y = y - F(d1, y, d3) / dF(d1, y)

    # 零点距离
    if abs(F(d1, y, d3) - F(d1, Next_y, d3)) < 1e-5:
        return Next_y
        '''设置迭代跳出条件, 同时输出满足f(x) = 0的x值'''
    else:
        return newtonMethod(Next_y, d1, d3)


for i in range(1, 20):
    x[i] = x[i-1]+h
    y[i] = newtonMethod(4, x[i], y[i-1])
    y_E[i] = y_E[i-1] + h*f(x[i-1], y_E[i-1])
    z[i] = (1+2*x[i])**0.5

plt.plot(x, y, label='Implicit Euler', color='green')
plt.plot(x, y_E, label='Euler', color='orange')
plt.plot(x, z, label='true', color='red')
plt.legend()
plt.show()
```