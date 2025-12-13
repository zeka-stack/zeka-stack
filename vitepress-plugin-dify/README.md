# vitepress-plugin-dify

一个用于将 Dify AI 应用嵌入到 VitePress 文档中的插件。

## 功能特性

- 🎈 **聊天气泡模式**：浮动聊天按钮，点击打开 AI 助手
- 🖼️ **Iframe 嵌入模式**：在页面内容中完整嵌入界面
- ⚙️ **灵活配置**：支持丰富的自定义选项
- 📱 **响应式设计**：自动适应不同屏幕尺寸
- 🔧 **TypeScript 支持**：完整的类型定义

## 安装

```bash
npm install vitepress-plugin-dify --save-dev
```

或者使用本地开发版本：

```json
{
  "devDependencies": {
    "vitepress-plugin-dify": "file:dependencies/vitepress-plugin-dify"
  }
}
```

## 配置

在 VitePress 的配置文件中（`.vitepress/config.js` 或 `.vitepress/config.ts`）添加插件：

### 基础配置

```javascript
import { defineConfig } from 'vitepress';
import difyPlugin from 'vitepress-plugin-dify';

export default defineConfig({
  // ... 其他配置

  vite: {
    plugins: [
      difyPlugin({
        enable: true,                    // 是否启用插件
        token: 'YOUR_APP_TOKEN',        // Dify 应用令牌（必需）
        mode: 'bubble',                 // 嵌入模式：'bubble' 或 'iframe'
        baseUrl: 'https://udify.app',   // Dify 服务地址（可选，默认 https://udify.app）
        isDev: false                     // 是否为开发环境（可选）
      })
    ]
  }
});
```

### 聊天气泡模式配置

```javascript
import { defineConfig } from 'vitepress';
import difyPlugin from 'vitepress-plugin-dify';

export default defineConfig({
  vite: {
    plugins: [
      difyPlugin({
        enable: true,
        token: 'YOUR_APP_TOKEN',
        mode: 'bubble',
        baseUrl: 'https://udify.app',

        // 聊天气泡配置
        bubble: {
          draggable: false,             // 是否允许拖动按钮
          dragAxis: 'both',             // 拖动方向：'x'、'y' 或 'both'
          containerProps: {             // 容器属性
            style: {                    // 自定义样式（对象格式）
              right: '20px',
              bottom: '20px',
              backgroundColor: '#155EEF',
              width: '50px',
              height: '50px',
              borderRadius: '25px'
            },
            className: 'custom-chat-button'  // 自定义 CSS 类名
          }
        },

        // 预填充用户上下文（可选）
        inputs: {
          name: "John Doe",
          department: "Support"
        },

        // 系统变量（可选）
        systemVariables: {
          user_id: 'USER_123',
          conversation_id: 'CONV_456'
        },

        // 用户个人资料信息（可选）
        userVariables: {
          avatar_url: 'https://example.com/avatar.jpg',
          name: 'John Doe'
        }
      })
    ]
  }
});
```

### Iframe 嵌入模式配置

```javascript
import { defineConfig } from 'vitepress';
import difyPlugin from 'vitepress-plugin-dify';

export default defineConfig({
  vite: {
    plugins: [
      difyPlugin({
        enable: true,
        token: 'YOUR_APP_TOKEN',
        mode: 'iframe',
        baseUrl: 'https://udify.app',

        // iframe 配置
        iframe: {
          width: '100%',                 // iframe 宽度
          height: '600',                 // iframe 高度
          style: 'border: none; border-radius: 8px;',  // 自定义样式
          className: 'dify-iframe',     // CSS 类名
          containerSelector: '#dify-container'  // 容器选择器（可选，不指定则插入到 body 末尾）
        }
      })
    ]
  }
});
```

## 使用示例

### 示例 1：基础聊天气泡

最简单的配置，使用默认样式：

```javascript
import { defineConfig } from 'vitepress';
import difyPlugin from 'vitepress-plugin-dify';

export default defineConfig({
  vite: {
    plugins: [
      difyPlugin({
        enable: true,
        token: 'your-dify-app-token',
        mode: 'bubble'
      })
    ]
  }
});
```

### 示例 2：自定义样式的聊天气泡

```javascript
import { defineConfig } from 'vitepress';
import difyPlugin from 'vitepress-plugin-dify';

export default defineConfig({
  vite: {
    plugins: [
      difyPlugin({
        enable: true,
        token: 'your-dify-app-token',
        mode: 'bubble',
        bubble: {
          draggable: true,
          dragAxis: 'both',
          containerProps: {
            style: {
              right: '30px',
              bottom: '30px',
              backgroundColor: '#3e86f6',
              width: '60px',
              height: '60px',
              borderRadius: '30px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }
          }
        }
      })
    ]
  }
});
```

### 示例 3：Iframe 嵌入到指定容器

```javascript
import { defineConfig } from 'vitepress';
import difyPlugin from 'vitepress-plugin-dify';

export default defineConfig({
  vite: {
    plugins: [
      difyPlugin({
        enable: true,
        token: 'your-dify-app-token',
        mode: 'iframe',
        iframe: {
          width: '100%',
          height: '600px',
          containerSelector: '#dify-chat-container',
          style: 'border: 1px solid #e0e0e0; border-radius: 8px;'
        }
      })
    ]
  }
});
```

在 Markdown 文件中创建容器：

```markdown
<div id="dify-chat-container"></div>
```

### 示例 4：TypeScript 配置

```typescript
import { defineConfig } from 'vitepress';
import difyPlugin, { type DifyPluginOptions } from 'vitepress-plugin-dify';

const difyOptions: DifyPluginOptions = {
  enable: true,
  token: 'your-dify-app-token',
  mode: 'bubble',
  bubble: {
    draggable: true,
    containerProps: {
      style: {
        right: '20px',
        bottom: '20px'
      }
    }
  },
  inputs: {
    user_name: "访客"
  }
};

export default defineConfig({
  vite: {
    plugins: [
      difyPlugin(difyOptions)
    ]
  }
});
```

## 获取 Dify 应用令牌

1. 登录你的 Dify 账户
2. 进入你的应用
3. 前往 **发布 → 嵌入**
4. 复制你的唯一令牌（token）

## CSS 变量自定义

对于聊天气泡模式，你可以使用 CSS 变量来自定义样式。在你的 VitePress 主题 CSS 文件中添加：

```css
#dify-chatbot-bubble-button {
  --dify-chatbot-bubble-button-bg-color: #3e86f6;
  --dify-chatbot-bubble-button-width: 60px;
  --dify-chatbot-bubble-button-height: 60px;
  --dify-chatbot-bubble-button-border-radius: 30px;
  --dify-chatbot-bubble-button-bottom: 20px;
  --dify-chatbot-bubble-button-right: 20px;
}
```

支持的 CSS 变量：

- `--dify-chatbot-bubble-button-bottom`: 按钮到底部的距离（默认 `1rem`）
- `--dify-chatbot-bubble-button-right`: 按钮到右侧的距离（默认 `1rem`）
- `--dify-chatbot-bubble-button-left`: 按钮到左侧的距离（默认 `unset`）
- `--dify-chatbot-bubble-button-top`: 按钮到顶部的距离（默认 `unset`）
- `--dify-chatbot-bubble-button-bg-color`: 按钮背景颜色（默认 `#155EEF`）
- `--dify-chatbot-bubble-button-width`: 按钮宽度（默认 `50px`）
- `--dify-chatbot-bubble-button-height`: 按钮高度（默认 `50px`）
- `--dify-chatbot-bubble-button-border-radius`: 按钮边框半径（默认 `25px`）
- `--dify-chatbot-bubble-button-box-shadow`: 按钮阴影
- `--dify-chatbot-bubble-button-hover-transform`: 悬停变换（默认 `scale(1.1)`）

## 注意事项

1. **Token 安全**：请妥善保管你的 Dify 应用令牌，不要将其提交到公开的代码仓库
2. **HTTPS**：生产环境建议使用 HTTPS，某些浏览器可能阻止 HTTP 下的 iframe 内容
3. **跨域问题**：确保你的 Dify 服务允许跨域访问
4. **响应式设计**：iframe 模式建议使用百分比或响应式单位设置宽高
5. **开发环境**：在开发模式下，确保 `isDev` 配置正确，以便使用正确的 Dify 服务地址

## 故障排除

### 聊天按钮未出现

- 检查 `enable` 是否为 `true`
- 确认 `token` 配置正确
- 检查浏览器控制台是否有 JavaScript 错误
- 确认 Dify 服务地址可访问
- 确保插件正确添加到 VitePress 配置中

### Iframe 无法加载

- 确认 iframe URL 包含正确的应用令牌
- 检查网站是否允许 iframe 内容（检查 X-Frame-Options 头）
- 确保使用 HTTPS（如果 Dify 应用需要）
- 检查 `containerSelector` 是否正确

### TypeScript 类型错误

- 确保安装了 TypeScript 类型定义
- 检查导入语句是否正确
- 确认 `index.d.ts` 文件存在

## API 参考

### DifyPluginOptions

```typescript
interface DifyPluginOptions {
  enable?: boolean;              // 是否启用插件
  token: string;                 // Dify 应用令牌（必需）
  mode?: 'bubble' | 'iframe';    // 嵌入模式
  baseUrl?: string;              // Dify 服务地址
  isDev?: boolean;               // 是否为开发环境
  bubble?: DifyBubbleConfig;     // 聊天气泡配置
  iframe?: DifyIframeConfig;     // iframe 配置
  inputs?: Record<string, any>;  // 预填充输入
  systemVariables?: Record<string, any>;  // 系统变量
  userVariables?: Record<string, any>;    // 用户变量
}
```

## 参考文档

- [Dify 官方文档 - 网站嵌入](https://docs.dify.ai/zh/use-dify/publish/webapp/embedding-in-websites)
- [VitePress 插件开发指南](https://vitepress.dev/guide/plugin)

## 许可证

MIT License

## 作者

dong4j

