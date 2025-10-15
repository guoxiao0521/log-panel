/**
 * 日志拦截器模块
 * 负责拦截 console 方法并记录日志
 */

class Logger {
  constructor(options = {}) {
    this.logs = [];
    this.maxLogs = options.maxLogs || 1000;
    this.originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug
    };
    this.listeners = [];
    this.intercepted = false;
  }

  /**
   * 开始拦截 console 方法
   */
  intercept() {
    if (this.intercepted) return;
    
    const self = this;
    
    ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
      console[method] = function(...args) {
        // 调用原始方法
        self.originalConsole[method].apply(console, args);
        
        // 记录日志
        self.addLog(method, args);
      };
    });
    
    this.intercepted = true;
  }

  /**
   * 恢复原始 console 方法
   */
  restore() {
    if (!this.intercepted) return;
    
    ['log', 'warn', 'error', 'info', 'debug'].forEach(method => {
      console[method] = this.originalConsole[method];
    });
    
    this.intercepted = false;
  }

  /**
   * 添加日志记录
   */
  addLog(type, args) {
    const timestamp = new Date();
    const message = this.formatArgs(args);
    
    const logEntry = {
      type,
      message,
      timestamp,
      time: this.formatTime(timestamp)
    };
    
    this.logs.push(logEntry);
    
    // 限制日志数量
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // 通知监听器
    this.notifyListeners(logEntry);
  }

  /**
   * 格式化参数
   */
  formatArgs(args) {
    return args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  }

  /**
   * 格式化时间
   */
  formatTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  /**
   * 添加日志更新监听器
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * 移除监听器
   */
  removeListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * 通知所有监听器
   */
  notifyListeners(logEntry) {
    this.listeners.forEach(listener => {
      try {
        listener(logEntry);
      } catch (e) {
        this.originalConsole.error('Error in log listener:', e);
      }
    });
  }

  /**
   * 清空日志
   */
  clear() {
    this.logs = [];
  }

  /**
   * 获取所有日志
   */
  getLogs() {
    return this.logs;
  }
}

export default Logger;

