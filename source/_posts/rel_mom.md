---
title: '广义动量守恒推导'
date: '2025-02-27'
---

下面给出一个较为详细的推导思路，说明为什么会得到方程
\[
\frac{d}{dt}\left(\mathbf{p}_\perp + q\,\mathbf{A}\right) = 0 \quad \Longrightarrow \quad \mathbf{p}_\perp = \mathbf{p}_\perp^0 - q\,\mathbf{A},
\]
以及 \(\mathbf{p}_\perp^0 = m \gamma^0 \mathbf{v}_\perp^0\) 等结果。这里 \(\mathbf{p}_\perp\) 指的是粒子的横向(与主传播方向正交)动量，\(\mathbf{A}\) 是电磁势(矢势)，\(q\) 是粒子电荷，\(m\) 是粒子质量，\(\gamma\) 是相对论因子。下面分步骤说明。

---

## 1. 广义动量的定义与运动方程

在经典电动力学中，带电粒子在电磁场中运动的拉格朗日量可以写作  
\[
\mathcal{L} \;=\; -\,m c^2\,\sqrt{1 - v^2/c^2} \;+\; q\,\mathbf{A}\cdot\mathbf{v} \;-\; q\,\phi,
\]  
其中 \(\mathbf{A}\) 是矢势、\(\phi\) 是标势，\(\mathbf{v}\) 是粒子速度，\(c\) 是光速。相应的**广义动量**(canonical momentum)定义为  
\[
\mathbf{P} \;=\; \frac{\partial \mathcal{L}}{\partial \mathbf{v}} 
\;=\; \mathbf{p} + q\,\mathbf{A},
\]  
其中  
\[
\mathbf{p} \;=\; \gamma m\,\mathbf{v} 
\quad (\text{惯性动量或机械动量}).
\]  
因此  
\[
\mathbf{p} \;=\; \mathbf{P} \;-\; q\,\mathbf{A}.
\]

### 电磁场中的牛顿方程
带电粒子在电磁场中的相对论运动方程(牛顿-洛伦兹方程)可以写作  
\[
\frac{d\mathbf{p}}{dt} \;=\; q\,\bigl(\mathbf{E} + \mathbf{v}\times\mathbf{B}\bigr).
\]  
若用广义动量 \(\mathbf{P} = \mathbf{p} + q\mathbf{A}\) 来表述，则有  
\[
\frac{d\mathbf{P}}{dt} 
\;=\; q\,\mathbf{E} + q\,\frac{d\mathbf{A}}{dt} 
\;=\; q\bigl(\mathbf{E} + \mathbf{v}\times\mathbf{B}\bigr),
\]  
因为 \(\mathbf{E} = -\,\nabla \phi - \partial_t \mathbf{A}\) 且 \(\mathbf{v}\times\mathbf{B}\) 也可以用 \(\mathbf{A}\) 表示。经过一系列推导后，若在某些方向(比如横向方向 \(\perp\))上，系统的对称性或平移不变性保证了对该分量的广义动量守恒，那么就会得到  
\[
\frac{d}{dt}(\mathbf{p}_\perp + q\,\mathbf{A}_\perp) \;=\; 0.
\]

---

## 2. 为何 \(\frac{d}{dt}(\mathbf{p}_\perp + q\,\mathbf{A}) = 0\)？

在文中(方程(10b))，作者给出的理由是「由于在 \(y\) 和 \(z\) 方向的平移不变性(translational invariance)」，导致横向广义动量不随时间变化，即  
\[
\frac{d}{dt}\bigl(\mathbf{p}_\perp + q\,\mathbf{A}\bigr) = 0.
\]  
换言之，在横向方向(相对于主传播或流动方向)没有空间上的变化或外力的额外依赖，因而该分量的广义动量守恒。  

如果令 \(\mathbf{p}_\perp^0\) 表示 \(t < 0\) 时刻(或“初始”)的横向动量，且当 \(t<0\) 时矢势 \(\mathbf{A} = 0\)，那么守恒量就是  
\[
\mathbf{p}_\perp^0 + q\,\mathbf{A}\big|_{t<0} \;=\; \mathbf{p}_\perp^0.
\]  
因为守恒，所以在 \(t\ge 0\) 的任何时刻都满足  
\[
\mathbf{p}_\perp(t) + q\,\mathbf{A}(t) \;=\; \mathbf{p}_\perp^0.
\]  
从而得到  
\[
\mathbf{p}_\perp(t) 
\;=\; \mathbf{p}_\perp^0 - q\,\mathbf{A}(t).
\]  
这正是方程(11)的主要形式。

---

## 3. 初始横向动量 \(\mathbf{p}_\perp^0\) 的物理含义

<!-- 作者接下来又写道   -->
\[
\mathbf{p}_\perp^0 \;=\; m\,\gamma^0 \,\mathbf{v}_\perp^0 
\;=\; -\,\hat{\mathbf{y}}\,m\,c\,\tan\alpha,
\]  
表明最初(比如等离子体还未受到后续场作用时，\(t<0\))，带电粒子在横向(\(\perp\))方向有一个初始速度 \(\mathbf{v}_\perp^0\)，对应的相对论动量即  
\[
\mathbf{p}_\perp^0 = \gamma^0 m \mathbf{v}_\perp^0.
\]  
这里 \(\gamma^0 = 1/\sqrt{1 - (v_\perp^0)^2/c^2}\) 表示初始速度对应的相对论因子。文中举例给出了 \(\mathbf{p}_\perp^0 = -\,\hat{\mathbf{y}}\,m\,c\,\tan\alpha\) 这样一个具体数值，说明粒子初始时在负 \(y\) 方向以一定速度(\(\tan\alpha\) 相关)运动。

---

## 4. 总结推导脉络

1. **广义动量守恒的关键**：由于在横向方向上(这里指 \(y,z\) 或者作者只关注某个正交方向)不存在对粒子的净推力，或者说系统在该方向上具备平移对称性，因此\(\mathbf{p}_\perp + q\,\mathbf{A}\) 守恒。  
2. **初始条件**：\(t<0\) 时，\(\mathbf{A}=0\)，故初始时刻的广义动量就是粒子的机械动量 \(\mathbf{p}_\perp^0\)。  
3. **随时间推演**：由于守恒量不变，可写出  
   \[
   \mathbf{p}_\perp(t) + q\,\mathbf{A}(t) 
   \;=\; \mathbf{p}_\perp^0 
   \quad\Longrightarrow\quad
   \mathbf{p}_\perp(t) 
   \;=\; \mathbf{p}_\perp^0 - q\,\mathbf{A}(t).
   \]  
4. **相对论动量表达**：\(\mathbf{p}_\perp^0 = m\,\gamma^0\,\mathbf{v}_\perp^0\)，并且在具体物理情景(例如等离子体流动)中可以给出速度或动量的方向和大小，如文中的 \(-\hat{\mathbf{y}}\,m\,c\,\tan\alpha\)。

<!-- 这就是文中方程(10b) 和(11)背后的主要推导逻辑。 -->
要点在于：  
- 电磁场中，**机械动量** \(\mathbf{p}\) 并非一定守恒，但**广义动量** \(\mathbf{p} + q\mathbf{A}\) 可能由于对称性而守恒。  
- 一旦认定在某个方向上无净力(或场结构具备平移不变性)，就可断言那一方向的广义动量守恒，从而得到 \(\mathbf{p}_\perp = \mathbf{p}_\perp^0 - q\mathbf{A}\) 这样的形式。  
- 初始条件决定了 \(\mathbf{p}_\perp^0\) 的具体值，再结合守恒方程就能得到随时间演化的横向动量。