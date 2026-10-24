# Zeka Stack AI 开发工具实施方案

日期：2026-10-23。决策：CLI 使用 Go；工程语言文档使用 `arch.md`；本次一起交付文档、Skills、CLI、MCP。

## 目标与验收

让开发者通过 AI 生成可读、符合框架约定的业务项目。AI 必须先理解已存在的封装，再生成 Controller、Service、DAO、Form、DTO、PO 与 Converter，不得自行发明响应模型、异常体系、配置属性或组件 API。

验收围绕完整使用路径：

1. 从 For Agents 找到工程规范、业务开发 Skill、组件查询入口。
2. 从同一份 `arch.md` 取得分层规则、可复用类型、正例与反例。
3. 每个可依赖的 starter 都有独立、自包含的 SkillsJars `SKILL.md`。
4. Go CLI 在离线环境查询 starter、配置、规范和示例，检查业务项目的依赖与常见反模式。
5. `zeka mcp` 通过标准 stdio 协议提供同一套知识和只读检查。
6. 元数据可从仓库重建，携带来源与内容摘要；有测试验证查询、检查与 MCP 调用。

## Ant Design 的启发

调研入口：

- https://ant.design/docs/react/for-agents-cn
- https://github.com/ant-design/ant-design-cli
- https://ant.design/docs/react/mcp/

Ant Design 将 For Agents、设计语言、Markdown 文档、Skills 和离线 CLI/MCP 连接起来。CLI 提供组件查询、示例、设计语言及项目检查；MCP 复用 CLI 数据，提供 8 个查询工具与 2 个提示模板。可借鉴的是共享内容来源和明确的 Agent 使用顺序。

Zeka Stack 的核心上下文是后端工程语言，因此对应的规范命名为 `arch.md`。除了 API 查询，还必须约束职责边界、继承体系、对象转换、校验、事务和已有工具的使用。

## 内容与来源

优先级：当前源码与 POM > 自动配置入口与属性定义 > 生成器模板及可运行示例 > README 与站点说明。模板也需要结合实现核对，不把示例中的占位字段视为业务规范。

扫描所有初始化的工程目录，建立 Java 类型、文档、POM 和配置来源索引。排除 `.git`、构建产物、缓存与第三方依赖。扫描覆盖率与语义核对覆盖率分别报告，不把自动索引说成逐行审计。

人工重点核对 starter 依赖、自动装配、公开方法、业务生成模板、统一响应、异常、持久层和业务参考实现。发现不一致时修正维护源文档，站点同步副本由构建流程生成。

## 交付结构

| 通道 | 内容 | 维护位置 |
| --- | --- | --- |
| For Agents | 可复制提示词、接入流程、业务项目 AGENTS 模板 | `zeka-stack.github.io/ai/` |
| 工程语言 | 分层、编码范式、封装选用、反模式、验证要求 | 根目录 `arch.md` |
| LLMs.txt | 索引、全文与页面 Markdown，配置站点域名 | 文档站插件与生成资产 |
| 业务 Skill | 从需求到业务模块的执行流程 | `supports/skills/zeka-stack-business-dev/` |
| 组件 Skill | 依赖、选型、配置、Bean、扩展与限制 | 各 starter 的 `skills/<artifactId>/SKILL.md` |
| CLI / MCP | 单二进制和共享离线知识库 | `supports/zeka-cli/` |

根目录 `arch.md` 是唯一维护源，生成脚本同步到 CLI 内嵌资源与文档站公开文件。业务 Skill、组件 Skill 直接从源目录打包进 CLI。元数据生成必须确定性执行，并支持 `--check` 检测过期副本。

## 工程语言内容

- 项目父 POM、BOM、组合 starter 与单 starter 的选择。
- `ZekaStarter` 启动方式及扫描包前缀约束。
- 按业务模块组织的包结构与 Controller / Service / DAO 职责。
- `@RestControllerWrapper`、`ServletController`、自动响应包装、`@OriginalResponse`。
- `LowestExceptionAssert`、`BaseCodes` 和统一异常处理。
- `BaseService` / `BaseServiceImpl` / `BaseDao`，分页、事务与实体基类。
- Form / DTO / Query / PO，MapStruct `ExtendConverter`，校验分组。
- 序列化枚举、日志、Trace、配置、测试与常用工具类选型。
- 一个完整业务模块作为范例，包含明确 import、关键注释和真实 API。
- 不适用于 Reactive 的 Servlet 规则必须注明，不把阻塞式 MyBatis 放入事件循环。

## CLI 与 MCP

CLI 命令：

| 命令 | 行为 |
| --- | --- |
| `list` / `info <starter>` | starter 清单、依赖、配置与来源 |
| `doc <starter>` / `arch` / `demo` | 自包含 Skill、工程规范、业务范例 |
| `search <keyword>` | 查询可复用类型与工具，返回来源 |
| `usage <dir>` | 扫描 POM 中的 Zeka 依赖与已有类型使用 |
| `doctor <dir>` | 只读检查父 POM、依赖、包前缀、技术栈选择 |
| `lint <dir>` | 提示字段注入、裸 BaseMapper、控制层直连 Mapper 等常见反模式 |
| `skills extract --dir <dir>` | 导出内嵌 Skills；默认不覆盖不同内容 |
| `setup --client ...` | 输出客户端配置与接入指引，不改全局配置 |
| `mcp` | 以 stdio 启动 MCP Server |

MCP tools：`zeka_list`、`zeka_info`、`zeka_doc`、`zeka_arch`、`zeka_demo`、`zeka_search`、`zeka_doctor`、`zeka_usage`、`zeka_lint`。Prompts：`zeka-expert`、`zeka-module-generator`。Resource：`zeka://arch.md`。

检查器是静态启发式检查，输出规则编号、文件、行号、原因和建议；不声称替代 Java 编译、语义分析或 Spring 上下文测试。MCP 项目检查通过启动参数限定工作区；返回发现项，不执行构建、SQL、网络请求或代码修改。

元数据包含 schema 版本、框架版本、各来源哈希、starter artifactId / Maven 依赖 / 配置来源 / Skill，以及可复用 Java 类型的包名、说明、方法签名与源码路径。只采集源码元数据，不依赖可能过期的 `target/classes` 作为唯一依据。

## 已知不一致与修正方向

| 位置 | 问题 | 修正 |
| --- | --- | --- |
| MyBatis Skill | 使用裸 BaseMapper、字段注入、重复时间字段 | 改为 Zeka 持久层基类和构造注入 |
| REST Servlet Skill | 引用不存在的 ResultCodeEnum | 改为 BaseCodes 并补自动包装和包前缀条件 |
| Messaging 文档 | send、topics、序列化接口及属性与实现不符 | 按 MessagingTemplate、UnifiedMessage、topic/groupId 修正 |
| Dict 文档 | 表名、URL、配置项与源码不符 | 使用 sys_dict_*、/dicts、真实 DictProperties |
| 快速开始 | 引用 packaging=pom 的聚合 artifact | 使用可依赖 starter，修正目录和分层结构 |

进一步扫描发现的问题记录在审计报告，不顺手重构运行时代码或覆盖用户已有修改。

## 实施与验证

1. 方案、工程语言和业务范例 → 对照生成器与实现检查类型和调用。
2. 修正文档、补齐 Skills → 核对模块覆盖、自包含性、配置来源。
3. CLI / MCP / 元数据 → Go 单元测试、`go vet`、编译、真实 stdio 握手及工具调用。
4. 文档站与生成流程 → 构建、链接与公开 Markdown 检查。
5. 全仓来源索引与审计报告 → 记录覆盖边界、未验证事项及发布步骤。

本次不发布软件、不部署站点、不提交 Git。安装文档使用本地构建路径；仓库发布坐标和预编译下载地址只在实际发布后填写。
