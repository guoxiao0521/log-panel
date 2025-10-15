/**
 * 面板 UI 模块
 * 负责创建和管理日志显示面板
 */

class Panel {
  constructor(logger, options = {}) {
    this.logger = logger;
    this.options = {
      position: options.position || 'bottom-right',
      width: options.width || 400,
      height: options.height || 300,
      ...options
    };
    
    this.container = null;
    this.logContainer = null;
    this.isMinimized = false;
    this.isDragging = false;
    this.dragOffset = { x: 0, y: 0 };
    
    this.init();
  }

  /**
   * 初始化面板
   */
  init() {
    this.createPanel();
    this.setupEventListeners();
    this.renderLogs();
    
    // 监听新日志
    this.onLogAdded = (logEntry) => {
      this.appendLog(logEntry);
    };
    this.logger.addListener(this.onLogAdded);
  }

  /**
   * 创建面板 DOM 结构
   */
  createPanel() {
    // 主容器
    this.container = document.createElement('div');
    this.container.className = 'log-panel-container';
    this.container.style.width = `${this.options.width}px`;
    this.container.style.height = `${this.options.height}px`;
    
    // 设置初始位置
    this.setPosition(this.options.position);
    
    // 标题栏
    const header = document.createElement('div');
    header.className = 'log-panel-header';
    header.innerHTML = `
      <span class="log-panel-title">日志面板</span>
      <div class="log-panel-actions">
        <button class="log-panel-btn log-panel-clear" title="清空日志">🗑️</button>
        <button class="log-panel-btn log-panel-minimize" title="最小化">−</button>
      </div>
    `;
    
    // 日志容器
    this.logContainer = document.createElement('div');
    this.logContainer.className = 'log-panel-logs';
    
    // 组装
    this.container.appendChild(header);
    this.container.appendChild(this.logContainer);
    
    // 添加到页面
    document.body.appendChild(this.container);
    
    // 保存引用
    this.header = header;
    this.clearBtn = header.querySelector('.log-panel-clear');
    this.minimizeBtn = header.querySelector('.log-panel-minimize');
  }

  /**
   * 设置面板位置
   */
  setPosition(position) {
    const positions = {
      'top-left': { top: '20px', left: '20px' },
      'top-right': { top: '20px', right: '20px' },
      'bottom-left': { bottom: '20px', left: '20px' },
      'bottom-right': { bottom: '20px', right: '20px' }
    };
    
    const pos = positions[position] || positions['bottom-right'];
    Object.assign(this.container.style, pos);
  }

  /**
   * 设置事件监听
   */
  setupEventListeners() {
    // 拖拽功能
    this.header.addEventListener('mousedown', this.onDragStart.bind(this));
    document.addEventListener('mousemove', this.onDragMove.bind(this));
    document.addEventListener('mouseup', this.onDragEnd.bind(this));
    
    // 清空按钮
    this.clearBtn.addEventListener('click', () => {
      this.logger.clear();
      this.logContainer.innerHTML = '';
    });
    
    // 最小化按钮
    this.minimizeBtn.addEventListener('click', () => {
      this.toggleMinimize();
    });
  }

  /**
   * 开始拖拽
   */
  onDragStart(e) {
    // 如果点击的是按钮,不触发拖拽
    if (e.target.classList.contains('log-panel-btn')) {
      return;
    }
    
    this.isDragging = true;
    this.header.style.cursor = 'grabbing';
    
    const rect = this.container.getBoundingClientRect();
    this.dragOffset = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // 移除定位属性,使用 left/top
    this.container.style.right = 'auto';
    this.container.style.bottom = 'auto';
  }

  /**
   * 拖拽移动
   */
  onDragMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    let left = e.clientX - this.dragOffset.x;
    let top = e.clientY - this.dragOffset.y;
    
    // 边界限制
    const maxX = window.innerWidth - this.container.offsetWidth;
    const maxY = window.innerHeight - this.container.offsetHeight;
    
    left = Math.max(0, Math.min(left, maxX));
    top = Math.max(0, Math.min(top, maxY));
    
    this.container.style.left = `${left}px`;
    this.container.style.top = `${top}px`;
  }

  /**
   * 结束拖拽
   */
  onDragEnd() {
    if (this.isDragging) {
      this.isDragging = false;
      this.header.style.cursor = 'grab';
    }
  }

  /**
   * 切换最小化状态
   */
  toggleMinimize() {
    this.isMinimized = !this.isMinimized;
    
    if (this.isMinimized) {
      this.container.classList.add('minimized');
      this.minimizeBtn.textContent = '+';
      this.minimizeBtn.title = '恢复';
    } else {
      this.container.classList.remove('minimized');
      this.minimizeBtn.textContent = '−';
      this.minimizeBtn.title = '最小化';
    }
  }

  /**
   * 渲染所有日志
   */
  renderLogs() {
    this.logContainer.innerHTML = '';
    const logs = this.logger.getLogs();
    logs.forEach(log => {
      this.appendLog(log);
    });
  }

  /**
   * 添加单条日志
   */
  appendLog(logEntry) {
    const logElement = document.createElement('div');
    logElement.className = `log-panel-item log-panel-${logEntry.type}`;
    
    const icon = this.getLogIcon(logEntry.type);
    
    logElement.innerHTML = `
      <span class="log-panel-time">${logEntry.time}</span>
      <span class="log-panel-icon">${icon}</span>
      <span class="log-panel-message">${this.escapeHtml(logEntry.message)}</span>
    `;
    
    this.logContainer.appendChild(logElement);
    
    // 自动滚动到底部
    this.logContainer.scrollTop = this.logContainer.scrollHeight;
  }

  /**
   * 获取日志类型图标
   */
  getLogIcon(type) {
    const icons = {
      log: 'ℹ️',
      info: 'ℹ️',
      warn: '⚠️',
      error: '❌',
      debug: '🐛'
    };
    return icons[type] || 'ℹ️';
  }

  /**
   * 转义 HTML
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * 销毁面板
   */
  destroy() {
    // 移除监听器
    if (this.onLogAdded) {
      this.logger.removeListener(this.onLogAdded);
    }
    
    // 移除 DOM
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    // 清理引用
    this.container = null;
    this.logContainer = null;
  }
}

export default Panel;

