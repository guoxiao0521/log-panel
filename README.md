# @guoxiao/log-panel

一个轻量级、可拖拽的浮动日志面板，用于在无法打开开发者工具的环境中查看 console 输出。

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![npm version](https://img.shields.io/npm/v/@guoxiao/log-panel.svg)

## ✨ 特性

- 🎯 **零依赖** - 纯原生 JavaScript 实现，无需任何外部依赖
- 🎨 **可拖拽** - 支持拖拽移动，自动边界检测
- 📦 **轻量级** - 压缩后仅约 27KB
- 🔄 **实时拦截** - 自动拦截所有 console 输出（log/warn/error/info/debug）
- 🎭 **类型区分** - 不同类型日志使用不同颜色标识
- ⏱️ **时间戳** - 每条日志都带有精确的时间戳（HH:mm:ss）
- 🗂️ **对象格式化** - 自动格式化对象和数组为 JSON 显示
- 🔒 **内存安全** - 自动限制日志数量，防止内存泄漏
- 📱 **响应式** - 支持移动端和桌面端
- 🌓 **暗色主题** - 仿 VS Code 的专业暗色主题

## 📦 安装

### NPM

```bash
npm install @guoxiao/log-panel
```

### 直接引入

```html
<script src="https://unpkg.com/@guoxiao/log-panel/dist/log-panel.umd.js"></script>
```

## 🚀 快速开始

### 浏览器直接引入（UMD）

```html
<!DOCTYPE html>
<html>
<head>
  <script src="dist/log-panel.umd.js"></script>
</head>
<body>
  <script>
    // 初始化日志面板
    LogPanel.init({
      position: 'bottom-right',
      width: 400,
      height: 300
    });

    // 正常使用 console
    console.log('Hello, Log Panel!');
    console.warn('这是一条警告');
    console.error('这是一条错误');
  </script>
</body>
</html>
```

### ES 模块

```javascript
import LogPanel from '@guoxiao/log-panel';

// 初始化
LogPanel.init({
  position: 'bottom-right',
  width: 400,
  height: 300,
  maxLogs: 1000
});

// 使用
console.log('Hello, Log Panel!');
```

### CommonJS

```javascript
const LogPanel = require('@guoxiao/log-panel');

LogPanel.init({
  position: 'top-left',
  width: 500,
  height: 400
});
```

### Vue 2/3 集成

```vue
<template>
  <div id="app">
    <!-- 你的应用内容 -->
  </div>
</template>

<script>
import LogPanel from '@guoxiao/log-panel';

export default {
  mounted() {
    LogPanel.init({
      position: 'bottom-right',
      width: 400,
      height: 300
    });
  },
  beforeDestroy() {
    LogPanel.destroy();
  }
}
</script>
```

### React 集成

```jsx
import { useEffect } from 'react';
import LogPanel from '@guoxiao/log-panel';

function App() {
  useEffect(() => {
    LogPanel.init({
      position: 'bottom-right',
      width: 400,
      height: 300
    });

    return () => {
      LogPanel.destroy();
    };
  }, []);

  return <div>Your App</div>;
}
```

## 📖 API 文档

### LogPanel.init(options)

初始化日志面板。

**参数：**

| 参数 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `position` | `string` | `'bottom-right'` | 面板初始位置：`'top-left'` \| `'top-right'` \| `'bottom-left'` \| `'bottom-right'` |
| `width` | `number` | `400` | 面板宽度（像素） |
| `height` | `number` | `300` | 面板高度（像素） |
| `maxLogs` | `number` | `1000` | 最大日志条数，超出后自动删除旧日志 |

**示例：**

```javascript
LogPanel.init({
  position: 'top-left',
  width: 500,
  height: 400,
  maxLogs: 2000
});
```

### LogPanel.destroy()

销毁日志面板，恢复原始 console 方法。

```javascript
LogPanel.destroy();
```

### LogPanel.clear()

清空所有日志记录。

```javascript
LogPanel.clear();
```

### LogPanel.getLogs()

获取所有日志记录数组。

**返回值：** `Array<LogEntry>`

```javascript
const logs = LogPanel.getLogs();
console.log(logs);
// [
//   {
//     type: 'log',
//     message: 'Hello',
//     timestamp: Date,
//     time: '14:30:25'
//   },
//   ...
// ]
```

## 🎯 使用场景

### UE4 嵌入式 Web 应用

在 UE4 中嵌入的 Web 页面通常无法打开开发者工具，使用 Log Panel 可以方便地查看日志：

```javascript
// 在 UE4 Web 应用中初始化
LogPanel.init({
  position: 'bottom-right',
  width: 400,
  height: 300
});

// 正常使用 console，日志会显示在面板中
console.log('UE4 应用已启动');
console.log('当前版本:', '1.0.0');
```

### Electron 应用调试

```javascript
// 在 Electron 渲染进程中使用
import LogPanel from '@guoxiao/log-panel';

LogPanel.init({
  position: 'top-right',
  width: 450,
  height: 350
});
```

### 移动端 WebView 调试

```javascript
// 在移动端 WebView 中使用
LogPanel.init({
  position: 'bottom-left',
  width: 300,
  height: 250
});

// 调试移动端特定问题
console.log('设备信息:', navigator.userAgent);
```

### 生产环境错误监控

```javascript
// 仅在需要时动态加载
if (needDebug) {
  import('@guoxiao/log-panel').then(({ default: LogPanel }) => {
    LogPanel.init({
      position: 'bottom-right',
      width: 400,
      height: 300
    });
  });
}
```

## 🎨 日志类型和颜色

| 类型 | 方法 | 颜色 | 说明 |
|------|------|------|------|
| log | `console.log()` | 青色边框 | 普通日志 |
| info | `console.info()` | 青色边框 | 信息日志 |
| debug | `console.debug()` | 青色边框 | 调试日志 |
| warn | `console.warn()` | 黄色边框+背景 | 警告日志 |
| error | `console.error()` | 红色边框+背景 | 错误日志 |

## 🔧 高级用法

### 对象和数组日志

```javascript
const user = {
  name: '张三',
  age: 25,
  hobbies: ['编程', '游戏', '音乐']
};

console.log('用户信息:', user);
// 会自动格式化为 JSON 显示
```

### 多个日志面板

```javascript
// 创建多个独立的日志面板实例
import { LogPanel as LogPanelClass } from '@guoxiao/log-panel';

const panel1 = new LogPanelClass();
panel1.init({ position: 'top-left' });

const panel2 = new LogPanelClass();
panel2.init({ position: 'bottom-right' });
```

### 条件加载

```javascript
// 仅在开发环境加载
if (process.env.NODE_ENV === 'development') {
  import('@guoxiao/log-panel').then(({ default: LogPanel }) => {
    LogPanel.init();
  });
}
```

## 📝 注意事项

1. **不影响原始功能**：Log Panel 会拦截 console 方法，但不会影响其原始功能，日志仍会输出到浏览器控制台
2. **Z-Index**：面板使用 `z-index: 9999`，确保显示在最上层
3. **内存管理**：默认最多保存 1000 条日志，超出后自动删除最早的日志
4. **对象显示**：对象和数组会被转换为 JSON 字符串显示
5. **生产环境**：建议根据需要动态加载，避免影响生产环境性能

## 🛠️ 开发

```bash
# 克隆项目
git clone https://github.com/guoxiao0521/log-panel.git

# 安装依赖
npm install

# 开发模式（监听文件变化）
npm run dev

# 构建
npm run build

# 启动本地服务器
npm run serve
```

## 📄 许可证

ISC © guoxiao

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 🔗 相关链接

- [GitHub 仓库](https://github.com/guoxiao0521/log-panel)
- [NPM 包](https://www.npmjs.com/package/@guoxiao/log-panel)
- [问题反馈](https://github.com/guoxiao0521/log-panel/issues)

## 📊 浏览器支持

- Chrome/Edge ≥ 88
- Firefox ≥ 78
- Safari ≥ 14
- 移动端浏览器

## 🎉 致谢

感谢所有贡献者和使用者的支持！

