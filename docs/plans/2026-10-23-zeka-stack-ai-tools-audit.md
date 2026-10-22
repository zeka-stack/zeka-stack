# Zeka Stack AI 工具与文档核对记录

日期：2026-10-23。对应方案：`2026-10-23-zeka-stack-ai-tools-plan.md`。

## 交付与统一来源

已提供 For Agents、`arch.md`、LLMs 文本入口、业务 Skill、15 个 starter Skill、Go CLI 和 stdio MCP。CLI 与 MCP 共用知识库；站点的工程规范、业务 Skill、范例与组件 Skill 下载由同一生成脚本派生。

文档站原有 LLM 插件将目录首页生成为 `ai.md`，生成脚本另外提供 `ai/index.md` 兼容入口。原始 Markdown 下载使用明确的地址，避免 VitePress 将其错误改写为不存在的 HTML 页面。

## 扫描范围与语义核对范围

生成脚本遍历根目录、十个已初始化工程目录及 `docs/`。扫描对象包含 Java、Markdown、POM/XML、模板、脚本和 JS/TS 等第一方文件；排除 `.git`、构建产物、依赖缓存、编辑器目录和符号链接。当前包含 4966 个 Java 文件；框架公共主源码索引提供 928 个公开类型。

`supports/zeka-cli/inventory.json` 保存逐文件路径与 SHA-256。`make ai-audit` 输出全部实际计数、缺失框架 import、已知错误 API 范例及旧风格候选。

**自动索引覆盖不等于全仓逐行语义审计。** 本次人工重点核对业务生成器、基础模型/响应/异常、持久层、15 个 starter 依赖与自动配置、属性类、消息/字典接口和主要入口文档。IDE 插件、历史规划和所有边缘工具没有逐方法执行验证；不能据此声称整个框架已经消除全部历史文档问题。

## 已修正的问题

| 范围 | 原问题 | 本次修正 |
| --- | --- | --- |
| REST 入口与深入文档 | 自建 ApiResponse、虚构 Result.success/fail、错误响应字段和注解属性、包装包条件不明确 | 使用真实 Result/R、标记注解与 Advice 实现摘录，明确 Servlet 和根包条件 |
| MyBatis 概述与 Skill | 裸 BaseMapper、字段注入、重复时间字段、配置默认值错误 | 使用 BaseDao/BaseService/BaseServiceImpl，明确实体基类差异与真实默认值 |
| MyBatis 性能/SQL 文档 | perform-max-time 拼写、BlockAttack 默认条件错误 | 按 performmaxTime 字段和真实 ConditionalOnProperty 修正 |
| Messaging | send/topics/filter/retry/batch/MessageSerializer 等虚构 API，错误配置前缀 | 改用 UnifiedMessage 与 sendSync/sendAsync/sendOneWay，明确 topic/groupId/type 与能力边界 |
| Dict README/USAGE | 错误表名/路由/方法，要求复制服务实现，虚构配置 | 使用 sys_dict_*、/dicts、真实 DictionaryService，明确缓存 Bean 条件 |
| Launcher | zeka-stack.launcher 等不存在前缀与不准确启动写法 | 改用 zeka-stack.app，说明 ZekaStarter 与 JVM 包前缀 |
| Logsystem | zeka-stack.logsystem 等不存在前缀 | 使用 zeka-stack.logging 和实际扩展点 |
| OpenAPI | 旧 Swagger 2 注解及未实现属性、错误自动装配示例 | 使用 OpenAPI 3 注解、实际配置与 Profile 条件 |
| Endpoint | 将多类端点统称完整 Actuator 管理，虚构细粒度开关 | 明确实际 InitializationService/PreloadComponent 和开关边界 |
| Combiner | framework/SSM 组成错误，错误声称附带消息能力 | 按两个组合器 POM 重写依赖清单 |
| 快速开始/BOM 示例 | 聚合 POM 当 JAR、在聚合示例目录运行、结构不完整 | 指向具体 starter/叶子示例，补推荐业务结构 |
| BaseForm/BaseDTO 注释 | 与生成器及实际业务跨层用法冲突 | 注释改为真实输入/输出契约，不更改运行逻辑 |
| 教程业务代码 | 11 处字段注入会被当成新业务范式 | 改为构造注入；测试/基础设施机制示例按上下文保留 |
| Skill 元信息 | 原有 license 与所属仓库 LICENSE 不一致 | 统一为实际 MIT，并修正维护 Skill 的模板 |

以上修改维护源，站点副本通过原有同步函数更新。新增 Skill 正文自包含；没有让使用方引用解包后不存在的框架文档路径。

## 保留但明确说明的运行条件

这些属于现有实现边界，本次以准确文档说明，不擅自改变框架运行行为：

- Dict 的 cache-type / preload-cache Bean 条件缺少 matchIfMissing，示例显式配置；enable-cache 属性不能代替真实 Bean 选择条件。
- RefreshScope 开关拼接中使用 `LauncherProperties.PREFIX + "refresh"`，缺少分隔点，不能承诺常见 YAML 写法一定生效。
- 部分 ProjectInfoEndpoint 不受 endpoint 总开关控制，需要真实访问控制。
- 非法 SQL/BlockAttack 的默认开关为 false，且仅非生产 Profile 装配；不能承诺生产默认全表更新保护。
- Messaging 单实现的类路径隔离、复杂消息转换与真实 broker 行为需要应用上下文验证，统一模板不自动提供业务幂等和分布式事务。
- CLI 知识是当前源码快照，JAR 依赖版本不同时先核对，暂不提供历史版本切换。

## 验证入口与发布边界

已运行 Go 测试、race 检查、go vet、原生二进制构建与真实 stdio smoke；MCP 通过官方 SDK 验证全部 tools/prompts/resource，覆盖工作区越界与 Skill 冲突保护。文档站已通过 VitePress 构建，继续以最终生成结果检查 Markdown 下载和 LLM 索引。

推荐复现：

```bash
make ai-generate
make ai-check
make ai-audit
make zeka-cli-test
make zeka-cli-build
python3 supports/zeka-cli/scripts/smoke_mcp.py supports/zeka-cli/bin/zeka
```

未执行整个 Java 工程的 Maven 构建、SkillsJars JAR 打包/提取或消息/数据库集成测试。业务范例已核对来源 API，但未宣称在完整应用中编译运行通过。未发布二进制、未部署站点、未提交 Git；公开新地址需要站点部署后才可远程访问。
