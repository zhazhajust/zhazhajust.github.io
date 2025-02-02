---
title: 'Marching Cube算法提取网格'
date: '2022-08-15'
---


# PyMesh3D

## Basic Installation

This project for mesh render in data science.

```python
pip install --upgrade pip
pip install pymesh3d
```

If you need mayavi backend.

```python
pip install mayavi
pip install pyqt
```

## Quick Start

```python
import pymesh
import numpy as np
import matplotlib.pyplot as plt
```

Look at the directory example for full example.

```python
##########################################
############ Rotate Mesh Data ############
##########################################

wkdir = "../../Render"

ey = np.load(wkdir + "/Ez.npy")[::2, ::50]

m, n = ey.shape[0], ey.shape[1]
res = np.zeros([m, n, n])
pymesh.rotate(ey, res, ifhalf = False)

fig = plt.figure(figsize=(4, 3))
plt.contourf(res[:, int(n/2), :].T)
cbar = plt.colorbar()
```

![png](https://github.com/zhazhajust/pymesh/blob/main/example/example_files/example_1_0.png?raw=true)

```python
##########################################
############# Save Mesh Data #############
##########################################

mesh = pymesh.get_iso_surf(res, contours_number = 4, cmap = "jet")
color = pymesh.interp_color(mesh.iso_vals, cmap = "jet")
mesh.export(wkdir + "test", "obj")
```

```python
##########################################
############# Load Mesh Data #############
##########################################

mesh = pymesh.Mesh.load(wkdir + "test", "obj")
```

```python
##########################################
############# Plot Mesh Data #############
##########################################
```

```python
from mayavi import mlab

mlab_mesh = pymesh.iso_surface(mesh, colormap = "RdBu")
mlab.colorbar()
mlab.show()
```
![png](https://github.com/zhazhajust/pymesh/blob/main/example/example_files/example_3_0.png?raw=true)

```python
################ plt example #################

surf = mesh.plt_trisurf(cmap = "jet")
plt.colorbar(surf, orientation = 'horizontal')
plt.tight_layout()
```

![png](https://github.com/zhazhajust/pymesh/blob/main/example/example_files/example_2_0.png?raw=true)
