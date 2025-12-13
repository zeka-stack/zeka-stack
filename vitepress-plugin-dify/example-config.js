// VitePress Plugin Dify 配置示例
// 将此配置添加到你的 .vitepress/config.js 或 .vitepress/config.ts 文件中

import { defineConfig } from 'vitepress';
import difyPlugin from 'vitepress-plugin-dify';

// ============================================
// 示例 1: 基础聊天气泡配置（最简单）
// ============================================
export default defineConfig({
  vite: {
    plugins: [
      difyPlugin({
        enable: true,
        token: 'your-dify-app-token-here',
        mode: 'bubble'
      })
    ]
  }
});

// ============================================
// 示例 2: 自定义样式的聊天气泡
// ============================================
// export default defineConfig({
//   vite: {
//     plugins: [
//       difyPlugin({
//         enable: true,
//         token: 'your-dify-app-token-here',
//         mode: 'bubble',
//         baseUrl: 'https://udify.app',
//         bubble: {
//           draggable: true,
//           dragAxis: 'both',
//           containerProps: {
//             style: {
//               right: '30px',
//               bottom: '30px',
//               backgroundColor: '#3e86f6',
//               width: '60px',
//               height: '60px',
//               borderRadius: '30px'
//             },
//             className: 'my-custom-chat-button'
//           }
//         },
//         inputs: {
//           user_name: "访客"
//         },
//         userVariables: {
//           name: '访客用户'
//         }
//       })
//     ]
//   }
// });

// ============================================
// 示例 3: Iframe 嵌入模式
// ============================================
// export default defineConfig({
//   vite: {
//     plugins: [
//       difyPlugin({
//         enable: true,
//         token: 'your-dify-app-token-here',
//         mode: 'iframe',
//         baseUrl: 'https://udify.app',
//         iframe: {
//           width: '100%',
//           height: '600px',
//           style: 'border: 1px solid #e0e0e0; border-radius: 8px;',
//           className: 'dify-iframe',
//           containerSelector: '#dify-chat-container'  // 可选：指定插入位置
//         }
//       })
//     ]
//   }
// });

// ============================================
// 示例 4: TypeScript 配置（完整配置）
// ============================================
// import type { DifyPluginOptions } from 'vitepress-plugin-dify';
//
// const difyOptions: DifyPluginOptions = {
//   enable: true,
//   token: 'your-dify-app-token-here',
//   mode: 'bubble',
//   baseUrl: 'https://udify.app',
//   isDev: false,
//   
//   // 聊天气泡配置
//   bubble: {
//     draggable: true,
//     dragAxis: 'both',
//     containerProps: {
//       style: {
//         right: '20px',
//         bottom: '20px',
//         backgroundColor: '#155EEF',
//         width: '50px',
//         height: '50px',
//         borderRadius: '25px'
//       },
//       className: 'custom-chat-button'
//     }
//   },
//   
//   // 预填充用户上下文
//   inputs: {
//     name: "John Doe",
//     department: "Support"
//   },
//   
//   // 系统变量
//   systemVariables: {
//     user_id: 'USER_123',
//     conversation_id: 'CONV_456'
//   },
//   
//   // 用户个人资料信息
//   userVariables: {
//     avatar_url: 'https://example.com/avatar.jpg',
//     name: 'John Doe'
//   }
// };
//
// export default defineConfig({
//   vite: {
//     plugins: [
//       difyPlugin(difyOptions)
//     ]
//   }
// });

