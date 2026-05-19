# Zeka Stack v3.0.0 SkillsJars 集成方案

## 背景

Zeka Stack v3.0.0 的核心方向是从传统的 Spring Boot Starter 集合，升级为面向 AI 时代的 Java 工程平台。过去 Starter 的主要价值是降低接入成本、统一依赖与自动装配；在
AI Native 场景下，Starter 还应该承担另一层职责：把组件的工程约束、推荐用法、配置边界和常见风险，变成 AI Agent 可以直接理解和执行的上下文。

SkillsJars 的思路正好契合这个方向。它把 Agent Skill 以 JAR 的方式发布到 Maven Central，并支持 Maven / Gradle 插件将依赖中的 `SKILL.md` 抽取到
AI 工具可读取的目录。对于 JVM 技术栈来说，这意味着 Skill 不再是散落在本地的提示词文件，而可以像普通依赖一样被版本化、分发和消费。

因此，Zeka Stack 可以把每个 Starter 的使用说明沉淀为随组件发布的 Skill，让使用 Zeka Stack 的开发者在使用 Codex、Claude Code、Kiro、Cursor、GitHub
Copilot 等 AI 工具时，自动获得组件级工程规则。

## 目标

本方案的目标不是给仓库“加一些提示词文件”，而是建立一套可持续维护的 AI Native Starter Skill 机制。

核心目标包括：

1. 让每个 Cubo Starter 都能提供面向 AI Agent 的组件说明。
2. 让 Skill 随 Maven 构建产物一起发布，避免使用者手工复制文档。
3. 让 AI 生成业务代码时优先遵守 Zeka Stack 的封装、约定和边界。
4. 让 Starter 的 README、人类文档、示例工程和 Skill 形成一致的知识体系。
5. 为后续 Spring AI / MCP / Agent Runtime 集成预留 classpath 读取能力。

## 基本判断

SkillsJars 对 Zeka Stack 的价值主要体现在三个方面。

### 1. Starter 知识随依赖分发

传统 README 需要开发者主动阅读，AI Agent 通常不会稳定地按模块 README 建立长期约束。将 `SKILL.md` 打进 JAR 后，组件知识可以跟随依赖进入使用方项目，再通过
SkillsJars 插件抽取到 AI 工具目录。

这让 Starter 的工程规则和依赖版本一样，成为可管理、可升级、可追踪的项目资产。

### 2. AI 生成代码时获得组件语义

以 `cubo-rest-spring-boot` 为例，AI 不应该只知道项目用了 Spring MVC，而应该知道：

- REST 层应遵守 Zeka Stack 的统一响应与异常处理模型。
- 参数校验应优先复用 Cubo / Blen 提供的规范能力。
- 不应绕过 Zeka 封装直接散装定义响应结构。
- 示例代码应符合当前 Starter 的推荐接入方式。

这些内容适合写入 Skill，而不是只放在给人看的文档里。

### 3. 为运行时 Agent 集成留出入口

SkillsJars 文档中已经给出 Spring AI 场景：自定义 Agent 可以从 classpath 的 `META-INF/skills` 读取 Skill。Zeka Stack 后续如果建设 `agent-core`、
`agent-mcp` 或 Spring AI 适配层，可以直接复用这套打包结构。

## 集成范围

第一阶段只覆盖 Cubo Starter，不建议一开始扩展到所有模块。

首批建议覆盖：

| 组件                           | 优先级 | 原因                                       |
|------------------------------|-----|------------------------------------------|
| `cubo-rest-spring-boot`      | P0  | REST 规范、统一响应、异常处理、参数校验最容易被 AI 写偏         |
| `cubo-mybatis-spring-boot`   | P0  | 数据访问层规则多，适合沉淀生成约束和常见坑                    |
| `cubo-openapi-spring-boot`   | P1  | 关系到 AI Consumable Backend Contract 的后续方向 |
| `cubo-endpoint-spring-boot`  | P1  | 关系到运行时诊断、健康检查和 AI Ops                    |
| `cubo-messaging-spring-boot` | P1  | Kafka / RocketMQ 分支多，需要明确选型和配置边界         |
| `cubo-launcher-spring-boot`  | P2  | 启动入口和环境装配重要，但可在基础模式跑通后再做                 |
| `cubo-logsystem-spring-boot` | P2  | 与 AI Ops 相关，但需要先整理日志语义和示例                |
| `cubo-dict-spring-boot`      | P2  | 可后续作为业务支撑型 Starter 补充                    |
| `cubo-combiner-spring-boot`  | P2  | 更适合作为聚合 Skill，而不是首批单点 PoC                |

## 目录规范

建议在每个 Starter 聚合模块下维护 `skills/` 目录，而不是直接把 `SKILL.md` 放在模块根目录。

这里需要区分两个位置：

- 源码维护位置：SkillsJars 默认从项目根目录的 `skills/` 读取 Skill，也可以通过 Maven 插件的 `skillsDir` 参数指定其他目录。
- JAR 内部位置：插件执行 `package` 后，会把 Skill 放入构建产物的 `META-INF/skills/...` 路径。

因此，`SKILL.md` 不需要手工放到 `src/main/resources`。如果某个 Starter 的最终产物需要携带 Skill，更推荐将 Skill 源文件就近维护在组件根目录的
`skills/` 下，然后在具体产出 JAR 的子模块中通过 `skillsDir` 指向该目录。

推荐结构如下：

```text
cubo-starter/
└── cubo-rest-spring-boot/
    ├── docs/
    ├── skills/
    │   └── cubo-rest-spring-boot/
    │       ├── SKILL.md
    │       └── references/
    │           ├── configuration.md
    │           ├── examples.md
    │           └── constraints.md
    ├── cubo-rest-spring-boot-core/
    ├── cubo-rest-spring-boot-autoconfigure/
    └── cubo-rest-spring-boot-starter/
```

这样做有三个原因：

1. 符合 SkillsJars 默认的 `skills/<skill-name>/SKILL.md` 结构。
2. 一个组件未来可以扩展多个 Skill，例如 `rest-controller-generation`、`rest-error-handling-review`。
3. 主说明和引用材料分离，避免 `SKILL.md` 过长影响 Agent 按需加载。

对于 `cubo-rest-spring-boot` 这类聚合模块，PoC 阶段可以先把源码放在：

```text
cubo-starter/cubo-rest-spring-boot/skills/cubo-rest-spring-boot/SKILL.md
```

然后让具体发布给使用方依赖的模块负责打包，例如：

```text
cubo-starter/cubo-rest-spring-boot/cubo-rest-spring-boot-starter/pom.xml
```

如果插件执行目录不是 `cubo-rest-spring-boot` 聚合模块根目录，则需要配置 `skillsDir` 指向上一级的 `skills` 目录。

## Skill 命名规范

Skill 名称建议与组件 artifact 保持一致，使用小写短横线格式。

示例：

```yaml
---
name: cubo-rest-spring-boot
description: Use when implementing REST APIs in projects that depend on Zeka Stack Cubo REST Starter.
license: Apache-2.0
---
```

说明：

- `name` 与 Starter 名称一致，方便使用者和 Agent 建立映射。
- `description` 必须说明触发场景，避免 Agent 在无关任务中误用。
- `allowed-tools` 初期不建议滥用，除非某个 Skill 明确需要读取文件、执行脚本或修改代码。
- `license` 应与对应模块的开源协议保持一致。

## SKILL.md 内容模板

每个 Starter Skill 建议采用统一骨架。

```markdown
---
name: cubo-rest-spring-boot
description: Use when implementing REST APIs in projects that depend on Zeka Stack Cubo REST Starter.
license: Apache-2.0
---

# Cubo REST Spring Boot

## When To Use

Use this skill when the task involves REST controllers, request validation, response models, exception handling, API versioning, or servlet/reactive REST integration in a Zeka Stack project.

## Component Purpose

Explain what this starter provides and what problem it solves.

## Dependency Usage

Show the recommended Maven dependency and mention whether servlet/reactive variants exist.

## Coding Rules

List the rules AI-generated code must follow.

## Configuration Rules

List key properties, defaults, and constraints.

## Examples

Point to concise examples or reference files.

## Do Not

List common mistakes and forbidden shortcuts.
```

实际内容应优先引用模块已有 README、`docs/detail-*.md` 和示例工程，不要重新发明一套和现有文档不一致的说法。

## Maven 集成方案

### 方案 A：随每个 Starter 组件打包 Skill

在每个 `cubo-*-spring-boot` 组件中维护 `skills/`，并在具体会发布给使用方依赖的 JAR 模块中接入 SkillsJars Maven 插件，将组件 Skill 打入模块产物。

以 `cubo-rest-spring-boot` 为例，推荐源码维护位置为：

```text
cubo-starter/cubo-rest-spring-boot/skills/cubo-rest-spring-boot/SKILL.md
```

推荐优先在具体 starter 子模块中打包：

```text
cubo-starter/cubo-rest-spring-boot/cubo-rest-spring-boot-starter/pom.xml
```

如果插件从 `cubo-rest-spring-boot-starter` 子模块执行，而 Skill 源文件放在上一级聚合模块，则需要配置 `skillsDir`。示意如下：

```xml
<plugin>
    <groupId>com.skillsjars</groupId>
    <artifactId>maven-plugin</artifactId>
    <version>0.0.6</version>
    <configuration>
        <skillsDir>${project.basedir}/../skills</skillsDir>
    </configuration>
    <executions>
        <execution>
            <goals>
                <goal>package</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

优点：

- Skill 与组件源码就近维护。
- 组件发布时自动携带对应 AI 使用说明。
- 使用者只依赖某个 Starter，就能获得对应组件上下文。
- 不需要额外新增聚合型 Skills 模块，符合 Starter 依赖即能力入口的设计。

风险：

- 当前部分聚合模块是 `pom` packaging，需要确认 SkillsJars Maven 插件对 `pom` 模块的打包行为。
- 如果聚合模块本身不发布可消费 JAR，应该由具体 `starter` 子模块打包 Skill，并通过 `skillsDir` 指向组件根目录的 `skills/`。
- 同一个组件存在多个 starter 变体时，需要决定是每个变体都携带同一份 Skill，还是只让主 starter 携带。

### 方案 B：新增独立 `cubo-starter-skills` 模块

新增一个专门发布 SkillsJar 的模块，集中维护所有 Cubo Starter 的 Skill。

推荐结构：

```text
cubo-starter/
└── cubo-starter-skills/
    ├── pom.xml
    └── skills/
        ├── cubo-rest-spring-boot/
        │   └── SKILL.md
        ├── cubo-mybatis-spring-boot/
        │   └── SKILL.md
        └── cubo-openapi-spring-boot/
            └── SKILL.md
```

优点：

- 构建模型简单，避免聚合 POM 打包限制。
- 使用者可以一次性引入全部 Zeka Starter Skills。
- 适合作为 3.0.0 的 AI Native 能力包发布。

风险：

- Skill 与组件源码距离变远，需要维护同步机制。
- 使用者即使只使用一个 Starter，也可能抽取到全部 Skill。

### 推荐选择

建议第一阶段采用方案 A，先在具体 Starter 组件内做 PoC，不新增独立 `cubo-starter-skills` 模块。

原因：

1. 当前目标是先验证 SkillsJars 的构建、发布、抽取、AI 工具消费链路。
2. Starter Skill 的核心价值是“组件知识随组件依赖分发”，就近放在组件目录更符合这个模型。
3. 使用者依赖哪个 Starter，就应该获得哪个 Starter 对应的 AI 上下文，避免一次性抽取无关 Skill。
4. 如果后续需要提供全量 Skill 包，再考虑新增聚合模块作为补充，而不是 PoC 的第一选择。

## 使用方接入方式

使用方项目可以在构建插件中加入 SkillsJars 提取逻辑，然后将 Skill 抽取到 AI 工具目录。

示例命令：

```bash
./mvnw skillsjars:extract -Ddir=.codex/skills
```

不同 AI 工具可以使用不同目录：

| 工具               | 推荐目录                            |
|------------------|---------------------------------|
| Codex            | `.codex/skills` 或用户全局 skills 目录 |
| Claude Code      | `.claude/skills`                |
| Kiro             | `.kiro/skills`                  |
| Cursor / Copilot | 视具体支持能力决定                       |

使用方项目的 `AGENTS.md` 可以增加约定：在开始开发前执行 Skill 抽取命令，保证 AI 工具拿到当前依赖版本对应的 Zeka Stack 组件说明。

## PoC 路线

建议按四步推进。

### Step 1：在单个 Starter 组件内建立 Skill

在 `cubo-starter/cubo-rest-spring-boot` 下新增组件级 `skills/` 目录，先只包含一个 `cubo-rest-spring-boot` Skill。

推荐源码位置：

```text
cubo-starter/cubo-rest-spring-boot/skills/cubo-rest-spring-boot/SKILL.md
```

推荐打包接入位置：

```text
cubo-starter/cubo-rest-spring-boot/cubo-rest-spring-boot-starter/pom.xml
```

验收标准：

- Maven 能成功 package。
- 构建产物中包含 `META-INF/skills/.../cubo-rest-spring-boot/SKILL.md`。
- `SKILL.md` frontmatter 符合 SkillsJars 要求。
- 如果插件执行目录不是组件根目录，`skillsDir` 能正确指向组件根 `skills/`。

### Step 2：抽取到 AI 工具目录

在本仓库或示例消费项目中验证：

```bash
./mvnw skillsjars:extract -Ddir=.codex/skills
```

验收标准：

- `.codex/skills` 下可以看到 `cubo-rest-spring-boot/SKILL.md`。
- AI 工具启动后能发现该 Skill。
- 生成 REST 代码时会主动遵守 Skill 中的响应、异常、校验规则。

### Step 3：扩展到第二个 Starter

选择 `cubo-mybatis-spring-boot` 作为第二个 Skill，验证多 Skill 发布和抽取。

验收标准：

- 多个 Skill 可以同时打包。
- Agent 能根据任务类型区分 REST 与 MyBatis Skill。
- 生成 Mapper / Service / Entity 相关代码时不会绕过 Zeka Stack 数据访问约束。

### Step 4：形成模板和维护规范

将 Skill 模板沉淀到 `cubo-spring-boot-templates` 或 `docs`，后续新增 Starter 时同步生成。

验收标准：

- 新增 Starter 时可以自动生成 Skill 骨架。
- Skill 与 README / 示例工程之间有明确同步规则。
- PR checklist 中增加 “是否需要更新 Starter Skill”。

## 风险与约束

### 1. Skill 是执行上下文，不只是文档

Skill 会影响 AI Agent 的行为，因此不能把未经审查的长文、临时想法或不稳定指令直接塞进去。每个 Skill 都应该像代码一样 review。

### 2. 避免 Skill 过长

`SKILL.md` 应保留核心判断和操作规则，详细说明放到 `references/`。这样 Agent 可以先加载短上下文，需要时再读取细节。

### 3. 避免与 README 产生冲突

Skill 不应该另起一套说法。组件能力说明、依赖引入方式、配置项名称、示例代码必须与 README、`docs/detail-*.md` 和示例工程保持一致。

### 4. 不要一次性全量铺开

全量给所有 Starter 加 Skill 容易产生大量低质量文档。应该先用 `cubo-rest-spring-boot` 跑通，再按优先级扩展。

### 5. 注意供应链安全

SkillsJars 官方也提示 Agent Skills 可能包含危险或恶意行为。Zeka Stack 发布的 Skill 应限制在组件使用说明、代码生成约束和安全边界提醒，不应包含危险自动化命令。

## 与 Zeka Stack v3.0.0 的关系

这套机制属于 `AI Assisted Development` 的基础能力，也能为后续方向提供支撑：

- 对 `AI First Scaffold`：新模块模板可以同步生成 Skill 骨架。
- 对 `AI Consumable Backend Contract`：OpenAPI / Frontend Manifest 的生成规则可以通过 Skill 指导 AI 使用。
- 对 `AI Config Copilot`：配置项解释和风险提示可以逐步沉淀为配置类 Skill。
- 对 `AI Ops Copilot`：日志、端点、健康检查的诊断规则可以成为运行期 Skill。
- 对 `Agent Ready Runtime`：Spring AI 或 MCP Server 可以从 classpath 加载 `META-INF/skills`，复用同一份组件知识。

## 推荐落地顺序

短期建议：

1. 在 `cubo-rest-spring-boot` 组件内新增 `skills/cubo-rest-spring-boot/SKILL.md`。
2. 在 `cubo-rest-spring-boot-starter` 中接入 SkillsJars Maven 插件，并通过 `skillsDir` 指向组件根 `skills/`。
3. 验证 Maven package 与 SkillsJars extract。
4. 用一个示例任务测试 AI 是否按 Skill 生成 REST 代码。

中期建议：

1. 扩展 `cubo-mybatis-spring-boot`、`cubo-openapi-spring-boot`。
2. 建立 Skill 模板和 PR checklist。
3. 在文档站点增加 “AI Native Starter Skills” 章节。

长期建议：

1. 将 Skill 生成纳入 Starter 模板。
2. 将 Skill 与接口契约、配置元数据、示例工程建立引用关系。
3. 为 Spring AI / MCP Runtime 提供 classpath Skill loader 示例。

## 结论

SkillsJars 可以作为 Zeka Stack v3.0.0 中 Starter AI Native 化的关键基础设施。

最合适的切入点不是直接修改所有 Starter，也不是先建立独立聚合 Skills 模块，而是先在 `cubo-rest-spring-boot` 组件内做 PoC：在组件根目录维护
`skills/cubo-rest-spring-boot/SKILL.md`，在具体发布的 `cubo-rest-spring-boot-starter` 模块中通过 `skillsDir` 打包该 Skill，验证 “Skill 编写 ->
Maven 打包 -> 依赖分发 -> 工具抽取 -> AI 使用” 的完整链路。链路跑通后，再将这套机制扩展到更多 Starter，并逐步纳入模板、文档和发布流程。

最终目标是让 Zeka Stack 的 Starter 不只提供代码依赖，也提供随依赖分发的 AI 工程上下文，让开发者使用 AI 工具时天然站在 Zeka Stack 的工程规范之内。
