---
title: '反滤波'
date: '2022-07-05'
---

## 使用傅里叶变换去卷积和逆滤波

如果已经有了一张具有模糊核的模糊图像，我们需要将其恢复到原始图像。原理上，我们只需要对原有的滤波卷积核每一个值进行倒数的操作即可实现逆滤波器的效果。在此我们仍然是在频域上进行卷积，代码如下。

需要注意的是，卷积核取到数的过程中需要在原来的数值上加一个微小数值epsilon，以避免分母为零。

```python

im = EyEnd #255*rgb2gray(imread('./images/snow.jpg'))
gauss_kernel = np.outer(signal.gaussian(im.shape[0], 3), signal.gaussian(im.shape[1], 3))
 
freq = fp.fft2(im)
freq_kernel = fp.fft2(fp.ifftshift(gauss_kernel))
conv = freq*freq_kernel
im_blur = fp.ifft2(conv).real
im_blur = 255*im_blur/np.max(im_blur)
 
epsilon = 10**-6
freq = fp.fft2(im_blur)
freq_kernel = 1/(epsilon+freq_kernel) # avoid freq_kernel is zero
im_rst = fp.ifft2(conv).real
im_rst = 255*im_rst/np.max(im_rst)
 
pylab.figure(figsize = (10, 6))
pylab.subplot(221), pylab.imshow(im), pylab.title('Original Image'), pylab.axis('off')
pylab.subplot(222), pylab.imshow(im_blur), pylab.title('Blurred Image Image'), pylab.axis('off')
pylab.subplot(223), pylab.imshow(im_rst), pylab.title('Restored Image with inverse filter'), pylab.axis('off')
pylab.subplot(224), pylab.imshow(im_rst - im), pylab.title('Diff Image'), pylab.axis('off')

```

## 利用维纳滤波器去卷积

前面的去卷积方法需要已知模糊核，在这里使用维纳滤波器，在不知道模糊核的情况下，从损坏的信号中去除噪声，达到复原图像的目的。首先构造一个已经损坏了的图像。

```python

im = rgb2gray(imread('./images/cat.jpg'))
 
n = 7
psf = np.ones((n, n))/n**2
im1 = signal.convolve2d(im, psf, mode = 'same')
im1 += 0.1*np.std(im1)*np.random.standard_normal(im.shape)

```

再使用维纳滤波完成操作，最后就能得到图像

```python

im2, _ = restoration.unsupervised_wiener(im1, psf)
fig, axes = pylab.subplots(nrows = 1, ncols = 3, figsize = (200, 40), sharex = True,
 sharey = True)
pylab.gray()
axes[0].imshow(im), axes[0].axis('off'), axes[0].set_title('Original image', size = 200)
axes[1].imshow(im1), axes[1].axis('off'), axes[1].set_title('Noisy blurred image', size = 200)
axes[2].imshow(im2), axes[2].axis('off'), axes[2].set_title('Self tuned restoration', size = 200)
fig.tight_layout()
pylab.show()

```

## 使用低通滤波，重建图像

```python

im_fft = fp.ifftshift(im_fft_shift)
im = np.clip(fp.ifft2(im_fft).real, 0, 255)
pylab.figure(figsize = (10,10))
pylab.imshow(im,pylab.cm.gray), pylab.axis('off'), pylab.title('Noise image'), pylab.show()

keep_fraction = 0.1
r,c = im_fft.shape
im_fft[int(r*keep_fraction):int(r*(1-keep_fraction))] = 0
im_fft[:, int(c*keep_fraction):int(c*(1-keep_fraction))] = 0
pylab.figure(), plot_spectrum(fp.fftshift(im_fft)), pylab.title('Filitered Spectrum')

im_new = fp.ifft2(im_fft).real
pylab.figure(figsize = (10, 10))
pylab.imshow(im_new,pylab.cm.gray), pylab.axis('off'), pylab.title('Reconstructed image'), pylab.show()

```
