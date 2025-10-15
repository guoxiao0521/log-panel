/**
 * Log Panel - 主入口
 * 用于在嵌入式 Web 应用中显示日志的可拖拽面板
 */

import Logger from './logger.js';
import Panel from './panel.js';
import './styles.css';

class LogPanel {
  constructor() {
    this.logger = null;
    this.panel = null;
    this.initialized = false;
  }

  /**
   * 初始化日志面板
   * @param {Object} options 配置选项
   * @param {string} options.position - 面板位置: 'top-left', 'top-right', 'bottom-left', 'bottom-right'
   * @param {number} options.width - 面板宽度(px)
   * @param {number} options.height - 面板高度(px)
   * @param {number} options.maxLogs - 最大日志数量
   */
  init(options = {}) {
    if (this.initialized) {
      console.warn('LogPanel already initialized');
      return;
    }

    // 创建日志拦截器
    this.logger = new Logger({
      maxLogs: options.maxLogs || 1000
    });

    // 开始拦截 console
    this.logger.intercept();

    // 创建面板
    this.panel = new Panel(this.logger, options);

    this.initialized = true;

    console.log('LogPanel initialized');
  }

  /**
   * 销毁日志面板
   */
  destroy() {
    if (!this.initialized) {
      return;
    }

    // 恢复原始 console
    if (this.logger) {
      this.logger.restore();
    }

    // 销毁面板
    if (this.panel) {
      this.panel.destroy();
    }

    this.logger = null;
    this.panel = null;
    this.initialized = false;

    console.log('LogPanel destroyed');
  }

  /**
   * 清空日志
   */
  clear() {
    if (this.logger) {
      this.logger.clear();
    }
    if (this.panel) {
      this.panel.renderLogs();
    }
  }

  /**
   * 获取所有日志
   */
  getLogs() {
    return this.logger ? this.logger.getLogs() : [];
  }
}

// 创建单例实例
const logPanelInstance = new LogPanel();

// 导出为默认对象(用于浏览器 UMD 格式)
export default {
  init: (options) => logPanelInstance.init(options),
  destroy: () => logPanelInstance.destroy(),
  clear: () => logPanelInstance.clear(),
  getLogs: () => logPanelInstance.getLogs()
};

// 同时导出类(用于 ES 模块)
export { LogPanel };

