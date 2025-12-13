/**
 * TypeScript 类型定义
 */

export interface DifyBubbleConfig {
  draggable?: boolean;
  dragAxis?: 'x' | 'y' | 'both';
  containerProps?: {
    style?: string | Record<string, string>;
    className?: string;
  };
}

export interface DifyIframeConfig {
  width?: string;
  height?: string;
  style?: string;
  className?: string;
  containerSelector?: string;
}

export interface DifyPluginOptions {
  enable?: boolean;
  token: string;
  mode?: 'bubble' | 'iframe';
  baseUrl?: string;
  isDev?: boolean;
  bubble?: DifyBubbleConfig;
  iframe?: DifyIframeConfig;
  inputs?: Record<string, any>;
  systemVariables?: Record<string, any>;
  userVariables?: Record<string, any>;
}

export default function difyPlugin(options?: DifyPluginOptions): {
  name: string;
  enhanceApp?: (ctx: { app: any }) => void;
  transformIndexHtml?: (html: string) => string;
};

