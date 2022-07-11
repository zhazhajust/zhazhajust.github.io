---
title: '动态开点线段树'
date: '2022-07-09'
---

## 动态线段树模板

```C++

/**
 * @Description: 线段树（动态开点）
 * @Author: LFool
 * @Date 2022/6/7 09:15
 **/
public class SegmentTreeDynamic {
    class Node {
        Node left, right;
        int val, add;
    }
    private int N = (int) 1e9;
    private Node root = new Node();
    public void update(Node node, int start, int end, int l, int r, int val) {
        if (l <= start && end <= r) {
            node.val += (end - start + 1) * val;
            node.add += val;
            return ;
        }
        int mid = (start + end) >> 1;
        pushDown(node, mid - start + 1, end - mid);
        if (l <= mid) update(node.left, start, mid, l, r, val);
        if (r > mid) update(node.right, mid + 1, end, l, r, val);
        pushUp(node);
    }
    public int query(Node node, int start, int end, int l, int r) {
        if (l <= start && end <= r) return node.val;
        int mid = (start + end) >> 1, ans = 0;
        pushDown(node, mid - start + 1, end - mid);
        if (l <= mid) ans += query(node.left, start, mid, l, r);
        if (r > mid) ans += query(node.right, mid + 1, end, l, r);
        return ans;
    }
    private void pushUp(Node node) {
        node.val = node.left.val + node.right.val;
    }
    private void pushDown(Node node, int leftNum, int rightNum) {
        if (node.left == null) node.left = new Node();
        if (node.right == null) node.right = new Node();
        if (node.add == 0) return ;
        node.left.val += node.add * leftNum;
        node.right.val += node.add * rightNum;
        // 对区间进行「加减」的更新操作，下推懒惰标记时需要累加起来，不能直接覆盖
        node.left.add += node.add;
        node.right.add += node.add;
        node.add = 0;
    }
}

```

对于表示为「区间和」且对区间进行「加减」的更新操作的情况，我们在更新节点值的时候『需要✖️左右孩子区间叶子节点的数量 (注意是叶子节点的数量)』；我们在下推懒惰标记的时候『需要累加』！！(这种情况和模版一致！！) 如题目 最近的请求次数
对于表示为「区间和」且对区间进行「覆盖」的更新操作的情况，我们在更新节点值的时候『需要✖️左右孩子区间叶子节点的数量 (注意是叶子节点的数量)』；我们在下推懒惰标记的时候『不需要累加』！！(因为是覆盖操作！！) 如题目 区域和检索 - 数组可修改
对于表示为「区间最值」且对区间进行「加减」的更新操作的情况，我们在更新节点值的时候『不需要✖️左右孩子区间叶子节点的数量 (注意是叶子节点的数量)』；我们在下推懒惰标记的时候『需要累加』！！ 如题目 我的日程安排表 I、我的日程安排表 III

## 我的日程安排表 I

```C++

class Node {
    friend class MyCalendar;
    // 左右孩子节点
    Node *left, *right;
    // 当前节点值，以及懒惰标记的值
    int val, add;
};

class MyCalendar {
    public:    
        MyCalendar():N(1e9), root(new Node()){
        }
        bool book(int start, int end) {
            // 先查询该区间是否为 0
            if (query(root, 0, N, start, end - 1) != 0) return false;
            // 更新该区间
            update(root, 0, N, start, end - 1, 1);
            return true;
        }
        void update(Node* node, int start, int end, int l, int r, int val) {
            if (l <= start && end <= r) {
                node -> val += val;
                node -> add += val;
                return ;
            }
            pushDown(node);
            int mid = (start + end) >> 1;
            if (l <= mid) update(node -> left, start, mid, l, r, val);
            if (r > mid) update(node -> right, mid + 1, end, l, r, val);
            pushUp(node);
        }
        int query(Node* node, int start, int end, int l, int r) {
            if (l <= start && end <= r) return node -> val;
            pushDown(node);
            int mid = (start + end) >> 1, ans = 0;
            if (l <= mid) ans = query(node -> left, start, mid, l, r);
            if (r > mid) ans = max(ans, query(node -> right, mid + 1, end, l, r));
            return ans;
        }
    // *************** 下面是模版 ***************
    private:
        int N;
        Node* root;
        void pushUp(Node* node) {
            // 每个节点存的是当前区间的最大值
            node -> val = max(node -> left -> val, node -> right -> val);
        }
        void pushDown(Node* node) {
            if (node -> left == nullptr) node -> left = new Node();
            if (node -> right == nullptr) node -> right = new Node();
            if (node -> add == 0) return ;
            node -> left -> val += node -> add;
            node -> right -> val += node -> add;
            node -> left -> add += node -> add;
            node -> right ->add += node -> add;
            node -> add = 0;
        }
};

/**
 * Your MyCalendar object will be instantiated and called as such:
 * MyCalendar* obj = new MyCalendar();
 * bool param_1 = obj->book(start,end);
 */

```