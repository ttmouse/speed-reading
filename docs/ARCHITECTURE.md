# 速读训练器架构设计

## 整体架构

### 1. 技术栈
- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **状态管理**: React Hooks

### 2. 目录结构
```
app/
├── components/         # 组件
│   └── Reader/        # 阅读器相关组件
│       ├── Controls/  # 控制组件
│       ├── Display/   # 显示组件
│       └── Settings/  # 设置组件
├── hooks/             # 自定义 Hooks
├── utils/             # 工具函数
│   └── text/         # 文本处理相关
├── types/             # TypeScript 类型定义
└── styles/            # 样式文件
```

## 核心模块

### 1. 文本处理模块
```typescript
// app/utils/text/
├── textChunker.ts     // 文本分块
├── textHighlighter.ts // 文本高亮
└── textProcessor.ts   // 文本预处理
```

#### 1.1 文本分块器 (TextChunker)
- 职责：将输入文本分割成适当大小的块
- 功能：
  - 按字数分组
  - 保持段落完整性
  - 处理标点符号
  - 处理换行符

#### 1.2 文本高亮器 (TextHighlighter)
- 职责：管理文本的高亮状态
- 功能：
  - 构建字符映射
  - 计算高亮范围
  - 生成高亮信息

### 2. 显示模块
```typescript
// app/components/Reader/Display/
├── index.tsx          // 显示组件入口
├── SerialMode.tsx     // 串行模式
└── HighlightMode/     // 高亮模式
    ├── index.tsx      // 高亮模式入口
    ├── ScrollView.tsx // 滚动视图
    └── PageView.tsx   // 分页视图
```

#### 2.1 分页视图实现 (PageView)
```typescript
interface PageViewProps {
  chunks: string[];           // 文本块数组
  currentPosition: number;    // 当前位置
  settings: ReadingSettings;  // 包含页面设置
}

interface PageInfo {
  pageIndex: number;         // 当前页索引
  totalPages: number;        // 总页数
  chunksPerPage: number;     // 每页块数
  currentPageChunks: string[]; // 当前页文本块
}

// 核心实现逻辑
class PageViewController {
  // 1. 页面计算
  calculatePage(position: number, chunks: string[], settings: ReadingSettings): PageInfo {
    const { pageSize, chunkSize } = settings;
    const chunksPerPage = pageSize * chunkSize;
    const pageIndex = Math.floor(position / chunksPerPage);
    
    return {
      pageIndex,
      totalPages: Math.ceil(chunks.length / chunksPerPage),
      chunksPerPage,
      currentPageChunks: this.getPageChunks(chunks, pageIndex, chunksPerPage)
    };
  }

  // 2. 获取页面文本块
  getPageChunks(chunks: string[], pageIndex: number, chunksPerPage: number): string[] {
    const startIndex = pageIndex * chunksPerPage;
    return chunks.slice(startIndex, startIndex + chunksPerPage);
  }

  // 3. 组织页面布局
  organizeLayout(chunks: string[], settings: ReadingSettings): LayoutInfo {
    const { pageSize, chunkSize } = settings;
    const lines: string[][] = [];
    
    // 按行组织文本块
    for (let i = 0; i < chunks.length; i += chunkSize) {
      const line = chunks.slice(i, i + chunkSize);
      lines.push(line);
    }
    
    // 补充空行到设定行数
    while (lines.length < pageSize) {
      lines.push(Array(chunkSize).fill(''));
    }
    
    return { lines };
  }

  // 4. 高亮状态管理
  getHighlightState(blockIndex: number, currentPosition: number): HighlightState {
    return {
      isHighlighted: blockIndex <= currentPosition,
      isCurrent: blockIndex === currentPosition,
      opacity: this.calculateOpacity(blockIndex, currentPosition)
    };
  }
}

// 视图渲染
function PageView({ chunks, currentPosition, settings }: PageViewProps) {
  const controller = new PageViewController();
  const pageInfo = controller.calculatePage(currentPosition, chunks, settings);
  const layout = controller.organizeLayout(pageInfo.currentPageChunks, settings);

  return (
    <motion.div
      key={pageInfo.pageIndex}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {layout.lines.map((line, lineIndex) => (
        <div className="flex" key={lineIndex}>
          {line.map((block, blockIndex) => {
            const globalBlockIndex = lineIndex * settings.chunkSize + blockIndex;
            const highlightState = controller.getHighlightState(
              globalBlockIndex,
              currentPosition % pageInfo.chunksPerPage
            );
            
            return (
              <span
                key={blockIndex}
                className="text-block"
                style={{
                  color: highlightState.isHighlighted ? highlightColor : dimmedTextColor,
                  opacity: highlightState.opacity,
                  transition: 'all 0.2s ease'
                }}
              >
                {block}
              </span>
            );
          })}
        </div>
      ))}
    </motion.div>
  );
}
```

#### 2.2 视图更新策略
- **页面切换**:
  ```typescript
  // 使用 Framer Motion 处理页面切换动画
  <motion.div
    key={pageIndex}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  />
  ```

- **高亮更新**:
  ```typescript
  // 使用 CSS transition 处理高亮切换
  <span style={{
    color: isHighlighted ? highlightColor : dimmedTextColor,
    transition: 'color 0.2s ease'
  }} />
  ```

### 3. 控制模块
```typescript
// app/components/Reader/Controls/
├── index.tsx          // 控制组件入口
├── SpeedControl.tsx   // 速度控制
└── ProgressBar.tsx    // 进度控制
```

#### 3.1 控制组件 (Controls)
- 职责：用户交互控制
- 功能：
  - 速度调节
  - 进度控制
  - 模式切换

### 4. 状态管理
```typescript
// app/hooks/
├── useReader.ts       // 阅读器状态
├── useTextProcessor.ts // 文本处理
└── useReadingStats.ts // 统计数据
```

#### 4.1 阅读器状态 (ReaderState)
```typescript
interface ReaderState {
  text: string;            // 原始文本
  chunks: string[];        // 分块后的文本
  currentPosition: number; // 当前位置
  isPlaying: boolean;      // 播放状态
  isPaused: boolean;       // 暂停状态
  display: string;         // 显示内容
}
```

#### 4.2 设置状态 (Settings)
```typescript
interface ReadingSettings {
  // 基础设置
  chunkSize: number;
  speed: number;
  fontSize: number;
  
  // 模式设置
  readingMode: 'serial' | 'highlight';
  highlightStyle: 'scroll' | 'page';
  
  // 显示设置
  fontColor: string;
  bgColor: string;
  dimmedTextColor: string;
}
```

## 数据流

### 1. 文本处理流程
```
原始文本 -> 预处理 -> 分块 -> 高亮计算 -> 显示
```

### 2. 状态更新流程
```
用户操作 -> 状态更新 -> 重新计算 -> 视图更新
```

### 3. 设置变更流程
```
设置变更 -> 更新配置 -> 重新处理 -> 刷新显示
```

## 性能优化

### 1. 计算优化
- 使用 useMemo 缓存计算结果
- 使用 useCallback 缓存函数
- 避免不必要的重渲染

### 2. 渲染优化
- 组件拆分
- 条件渲染
- 虚拟列表

### 3. 动画优化
- 使用 CSS transforms
- 避免布局抖动
- 使用 will-change

## 扩展性

### 1. 新增阅读模式
- 实现相应的显示组件
- 添加模式切换逻辑
- 更新设置选项

### 2. 新增功能
- 添加新的工具函数
- 扩展状态管理
- 更新用户界面

## 测试策略

### 1. 单元测试
- 工具函数测试
- Hook 测试
- 组件测试

### 2. 集成测试
- 模块交互测试
- 状态流转测试
- 用户操作测试

### 3. 性能测试
- 渲染性能
- 计算性能
- 内存使用 