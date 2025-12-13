/**
 * VitePress Plugin for Dify (CommonJS version)
 * 支持将 Dify AI 应用嵌入到 VitePress 文档中
 */

module.exports = function difyPlugin(options = {}) {
  const {
    enable = true,
    token,
    mode = 'bubble', // 'bubble' 或 'iframe'
    baseUrl = 'https://udify.app',
    isDev = false,
    
    // 聊天气泡配置
    bubble = {},
    
    // iframe 配置
    iframe = {},
    
    // 通用配置
    inputs = {},
    systemVariables = {},
    userVariables = {}
  } = options;

  // 如果未启用或未配置 token，则跳过
  if (!enable || !token) {
    return {
      name: 'vitepress-plugin-dify',
      apply: 'build'
    };
  }

  return {
    name: 'vitepress-plugin-dify',
    
    /**
     * 在客户端增强应用
     * 用于聊天气泡模式
     */
    enhanceApp({ app }) {
      if (mode === 'bubble' && typeof window !== 'undefined') {
        // 构建配置对象
        const bubbleConfig = {
          draggable: bubble.draggable !== undefined ? bubble.draggable : false,
          dragAxis: bubble.dragAxis || 'both',
          containerProps: bubble.containerProps || {}
        };

        // 处理 containerProps.style，支持对象和字符串两种格式
        if (bubbleConfig.containerProps.style && typeof bubbleConfig.containerProps.style === 'object') {
          // 将样式对象转换为字符串
          const styleStr = Object.keys(bubbleConfig.containerProps.style)
            .map(key => `${key}: ${bubbleConfig.containerProps.style[key]}`)
            .join('; ');
          bubbleConfig.containerProps.style = styleStr;
        }

        const difyConfig = {
          token: token,
          isDev: isDev,
          baseUrl: baseUrl,
          containerProps: bubbleConfig.containerProps,
          draggable: bubbleConfig.draggable,
          dragAxis: bubbleConfig.dragAxis
        };

        // 添加可选配置
        if (Object.keys(inputs).length > 0) {
          difyConfig.inputs = inputs;
        }
        if (Object.keys(systemVariables).length > 0) {
          difyConfig.systemVariables = systemVariables;
        }
        if (Object.keys(userVariables).length > 0) {
          difyConfig.userVariables = userVariables;
        }

        // 设置全局配置
        window.difyChatbotConfig = difyConfig;

        // 动态加载 Dify 嵌入脚本
        const script = document.createElement('script');
        script.src = `${baseUrl}/embed.min.js`;
        script.defer = true;
        document.head.appendChild(script);
      }
    },

    /**
     * 转换 HTML（Vite 钩子）
     * 用于 iframe 模式或需要修改 HTML 的场景
     */
    transformIndexHtml(html) {
      if (mode === 'iframe') {
        const iframeConfig = {
          width: iframe.width || '100%',
          height: iframe.height || '600',
          style: iframe.style || 'border: none; border-radius: 8px;',
          className: iframe.className || ''
        };

        // 构建 iframe URL
        let iframeUrl = `${baseUrl}/chatbot/${token}`;

        // 生成 iframe HTML
        const iframeHtml = `
          <iframe 
            src="${iframeUrl}"
            width="${iframeConfig.width}" 
            height="${iframeConfig.height}"
            style="${iframeConfig.style}"
            class="${iframeConfig.className}"
            frameborder="0"
            allow="microphone">
          </iframe>
        `;

        // 如果指定了容器选择器，插入到指定位置
        if (iframe.containerSelector) {
          // 查找容器并插入
          const containerId = iframe.containerSelector.replace('#', '');
          const containerRegex = new RegExp(`<([^>]+) id=["']${containerId}["']([^>]*)>`, 'i');
          if (containerRegex.test(html)) {
            html = html.replace(containerRegex, (match, tag, attrs) => {
              return `<${tag}${attrs}>${iframeHtml}`;
            });
          } else {
            // 如果容器不存在，插入到 body 末尾
            html = html.replace('</body>', `${iframeHtml}</body>`);
          }
        } else {
          // 默认插入到 body 末尾
          html = html.replace('</body>', `${iframeHtml}</body>`);
        }
      }

      return html;
    }
  };
};

