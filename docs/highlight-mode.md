# 高亮模式实现方案

## 1. 文本处理层

### 1.1 分组算法
```typescript
interface TextChunk {
  text: string;          // 文本内容
  index: number;         // 分组索引
  isBreak: boolean;      // 是否是句末/段落
  length: number;        // 实际字符长度
}
```

- 基本分组规则：
  - 按固定字数（highlightSize）进行分组
  - 保持中文字符的完整性
  - 处理标点符号和空格
  - 保持句子的语义完整性

- 特殊情况处理：
  - 句末标点处理
  - 段落换行处理
  - 不完整分组的处理
  - 停用词的处理

## 2. 显示层

### 2.1 垂直布局设计
```typescript
interface DisplayConfig {
  fontSize: number;         // 字体大小
  lineHeight: number;       // 行高
  textAlign: 'center';      // 文本对齐方式
  containerHeight: number;  // 容器高度
  transition: string;       // 过渡动画
}

interface DisplayStyles {
  highlighted: {
    color: string;         // 高亮颜色（纯白）
    opacity: number;       // 不透明度 1
  };
  dimmed: {
    color: string;         // 暗色文本
    opacity: number;       // 不透明度 0.3-0.5
  };
}
```

- 布局规则：
  - 垂直排列，每行一个分组
  - 当前高亮组位于视觉中心
  - 上下文等距分布
  - 所有文本居中对齐

- 显示效果：
  - 高亮组：
    - 纯白色显示
    - 最高不透明度
    - 位于视觉中心
  - 上下文：
    - 灰色显示
    - 降低不透明度
    - 保持等距分布

### 2.2 动画效果
- 切换动画：
  ```css
  .chunk {
    transition: all 0.3s ease-out;
    transform-origin: center;
  }
  
  .highlighted {
    transform: scale(1);
    opacity: 1;
  }
  
  .dimmed {
    transform: scale(0.95);
    opacity: 0.3;
  }
  ```

- 动画类型：
  - 透明度渐变
  - 位置平移
  - 缩放效果
  - 颜色过渡

### 2.3 响应式调整
- 屏幕适配：
  - 自适应容器高度
  - 动态行高计算
  - 字体大小响应
  - 间距自动调整

- 性能优化：
  - 使用 CSS transform
  - 启用硬件加速
  - 优化重绘性能
  - 控制动画帧率
