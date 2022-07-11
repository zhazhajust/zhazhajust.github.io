---
title: 'matplotlib colorbar位置'
date: '2022-07-04'
---

matplotlib 3.5以上版本

```python

fig, ax = plt.subplots(figsize = [3, 1.5])
norm = mpl.colors.Normalize(0, 20, clip=True)
im = plt.pcolormesh([[0,0,0],[0,0,20],[0,6,0]], cmap = 'jet', norm = norm)

cbar2 = fig.colorbar(im, cmap = 'jet', location='top',  shrink = 0.8)
cbar2.set_label('E$_k$ [MeV]')

```

如果figure.colorbar没有location参数，则使用mpl.colorbar.make_axes或者mpl.colorbar.make_axes_gridspec构造cax然后生成调用C
olorbar构造函数生成cbar

```python

#plt.colorbar().set_label.__doc__
#kw = {"location": "top", "orientation": "horizontal",
#                   "anchor": (0.5, 0.0), "panchor": (0.5, 1.0), "pad": 0.05}
#kw['orientation'] = kw['orientation']
#location = kw['ticklocation'] = kw['location']

kw = {'shrink': 0.8, 'orientation': "horizontal", 'location': 'top'}
#cax, kw = mpl.colorbar.make_axes_gridspec(ax, **kw)
cax, kw = mpl.colorbar.make_axes(ax, **kw)

NON_COLORBAR_KEYS = ['fraction', 'pad', 'shrink', 'aspect', 'anchor',
                        'panchor']

cb_kw = {k: v for k, v in kw.items() if k not in NON_COLORBAR_KEYS}

cbar = mpl.colorbar.Colorbar(cax, im, ticklocation = "top", orientation = "horizontal")
cbar.set_label('E$_k$ [MeV]')

```

此外，也可以自定义cax然后生成cbar

```python

cax = fig.add_axes([0.15, 1.05, 0.7, 0.05], label="<colorbar>")
cbar = mpl.colorbar.Colorbar(cax, im, orientation = "horizontal", ticklocation = "top")
cbar.set_ticks([0, 10, 20])
cbar.ax.xaxis.set_ticks_position('top')
cbar.ax.xaxis.set_label_position('top')
cbar.set_label('E$_k$ [MeV]')

```
