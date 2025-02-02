---
title: '分治算法'
date: '2022-07-01'
---
## 问题

给你一个由数字和运算符组成的字符串 expression ，按不同优先级组合数字和运算符，计算并返回所有可能组合的结果。你可以 按任意顺序 返回答案。

生成的测试用例满足其对应输出值符合 32 位整数范围，不同结果的数量不超过 $10^4$ 。

### 示例

```C++
输入：expression = "2-1-1"
输出：[0,2]
解释：
((2-1)-1) = 0 
(2-(1-1)) = 2
```

## 解题思路

对于一个形如 x op y（op 为运算符，x 和 y 为数） 的算式而言，它的结果组合取决于 x 和 y 的结果组合数，而 x 和 y 又可以写成形如 x op y 的算式。

因此，该问题的子问题就是 x op y 中的 x 和 y：以运算符分隔的左右两侧算式解。

然后我们来进行 分治算法三步走：

分解：按运算符分成左右两部分，分别求解
解决：实现一个递归函数，输入算式，返回算式解
合并：根据运算符合并左右两部分的解，得出最终解

```C++

class Solution {
public:
    vector<int> diffWaysToCompute(string expression) {
        vector<int> vec1, vec2, res;
        int flag = 0;
        int n = expression.size();
        for(int i = 0; i < n; i++){
            char oper = expression[i];
            if(oper == '+' || oper == '-' || oper == '*'){
                flag = 1;
                vec1 = diffWaysToCompute(string(expression, 0, i));
                vec2 = diffWaysToCompute(string(expression, i + 1, n - i - 1));
                for(auto v1: vec1){
                    for(auto v2: vec2){
                        if(oper == '+'){
                            res.push_back(v1 + v2);
                        }else if(oper == '-'){
                            res.push_back(v1 - v2);
                        }else{
                            res.push_back(v1 * v2);
                        }
                    }
                }
            }
        }
        if(flag == 0){
            return {std::stoi(expression)};
        }
        return res;
    }
};

```

以及**python**版本

```python

class Solution:
    def diffWaysToCompute(self, input: str) -> List[int]:
        # 如果只有数字，直接返回
        if input.isdigit():
            return [int(input)]

        res = []
        for i, char in enumerate(input):
            if char in ['+', '-', '*']:
                # 1.分解：遇到运算符，计算左右两侧的结果集
                # 2.解决：diffWaysToCompute 递归函数求出子问题的解
                left = self.diffWaysToCompute(input[:i])
                right = self.diffWaysToCompute(input[i+1:])
                # 3.合并：根据运算符合并子问题的解
                for l in left:
                    for r in right:
                        if char == '+':
                            res.append(l + r)
                        elif char == '-':
                            res.append(l - r)
                        else:
                            res.append(l * r)

        return res

```
