---
title: '高斯差分和超高斯滤波'
date: '2022-07-05'
---

```python

def gauss_func(Nx, sigma, n):
    x = np.arange(Nx) * dx
    cen = x0
    print(cen)
    amp = 1
    return amp * np.exp(-(x - cen) ** n / (2 * sigma ** n))

def gauss_func2d(Nx, Ny, sigma, n):
    x = np.arange(Nx)
    y = np.arange(Ny)
    Y, X = np.meshgrid(y, x)
    cen = [x0, y0]
    print(cen)
    amp = 1
    R = np.sqrt((X * dx - cen[0])**2 + (Y * dy - cen[1])**2)
    return amp * np.exp(- R ** n / (2 * sigma ** n))

```