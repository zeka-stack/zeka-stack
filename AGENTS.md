# Repository Guidelines

## 基本协作规则

1. 每次回复的开头和结尾都必须称呼用户：`【dong4j】`。
2. 默认使用中文回复，除非用户明确要求使用其他语言。
3. 用户提出代码或文件修改需求时，必须先给出实现方案并征求确认；用户确认后才能修改代码。
4. 修改前先查看真实文件、真实目录和当前 `git status --short`，不要凭记忆或路径名猜测。
5. 不要回滚或覆盖用户已有改动；如果遇到无关改动，只说明并绕开。

## 项目结构

Zeka Stack 是一个多模块、子仓库组合的 Java 工程体系：

- `arco-meta/`：构建基础层，包含顶层父 POM、构建父 POM、Maven 插件和注解处理器。
- `blen-kernel/`：基础内核层，提供通用模型、Web、认证、校验、追踪、SPI、测试等基础能力。
- `cubo-starter/`：Spring Boot Starter 套件，是当前 AI Native Starter Skill 的重点目录。
- `cubo-starter-examples/`：Starter 示例工程。
- `domi-suite/`、`eiko-orch/`、`felo-space/`：业务与中间件扩展层。
- `supports/`：公共脚本、资源、辅助工具和仓库级 Agent Skills。
- `docs/plans/`：架构规划、方案评估和阶段性设计文档。
- `zeka-idea-plugin/`：IDEA 插件与相关 AI 能力探索。
- `zeka-stack.github.io/`：文档站点。

初始化或更新子仓库时使用：

```bash
git submodule update --init --recursive
```

## Skills 目录

仓库级可复用 Agent Skill 放在：

```text
supports/skills/
```

当前已有：

```text
supports/skills/send-email-batch/
supports/skills/zeka-starter-skill-builder/
```

当任务涉及为 Zeka Stack 的 `*-starter` 生成或维护 SkillsJars `SKILL.md` 时，应优先阅读：

```text
supports/skills/zeka-starter-skill-builder/SKILL.md
```

该 Skill 记录了 starter skill 的固定规范：

- `SKILL.md` 写到具体 starter 模块下，而不是组件根、`core`、`common` 或 `autoconfigure`。
- 路径格式为 `<starter-module>/skills/<starter-artifact-id>/SKILL.md`。
- 内容必须自包含，不引用使用方解包后看不到的 `README.md`、`docs/` 或示例工程路径。
- 一个组件有多个 starter 时，每个 starter 单独生成，并在正文中加入选型对比。
- 默认不添加 `allowed-tools`。
- 解包验证使用完整坐标：`./mvnw com.skillsjars:maven-plugin:0.0.7:extract -Ddir=.cursor/skills`。

注意：`supports/skills/` 是本仓库维护 Skill 源文件的位置，不等同于所有 AI 工具都会自动加载的运行时目录。需要给 Cursor、Kiro、Claude、Codex
等工具使用时，应按各工具规则同步或解包到对应目录，例如 `.cursor/skills`、`.kiro/skills`、`.claude/skills` 或用户全局 skills 目录。

## 构建与测试

本项目使用 `asdf` 管理 JDK 版本，项目根目录的 `.tool-versions` 是运行时版本来源。进入仓库后应先让本地 shell 识别该版本，不要临时切换到其他 JDK。

Maven 命令优先使用仓库内的 Maven Wrapper：

```bash
./mvnw ...
```

不要默认使用系统级 `mvn`，除非用户明确要求或当前子项目没有可用的 wrapper。

常用指令通过根目录 `makefile` / `Makefile` 集中管理。新增或调整常用开发命令时，优先考虑更新 makefile，而不是只把命令散落在聊天或临时文档中。

常用命令：

```bash
./mvnw clean install
./mvnw clean install -DskipTests
./mvnw clean install -pl blen-kernel -am
```

示例工程通常在对应示例目录运行：

```bash
../../mvnw spring-boot:run
```

测试主要基于 JUnit 5。常用：

```bash
./mvnw test
```

如果用户明确要求“不需要编译打包”或“验证我自己来”，不要主动执行 Maven 构建、测试、打包或运行命令。

## 编码与文档风格

- 优先遵循现有模块风格、命名和注释方式。
- 新增完整代码文件时，需要补充模块级说明、关键类说明、关键方法说明和必要的复杂逻辑注释。
- 注释解释“为什么这样做”和“关键约束是什么”，不要只复述代码。
- 不做与需求无关的格式化、重构或清理。
- 方案、规划、架构说明优先落到 `docs/plans/` 或用户指定路径。
- 纯文档改动如果未执行构建或检查，需要在回复中明确说明。

## Maven 与 SkillsJars 约定

- SkillsJars 的 `package` 阶段由组件父 POM 统一管理，不要在每个 starter POM 中重复添加插件。
- starter 模块只维护自己的 `skills/<starter-artifact-id>/SKILL.md`。
- `extract` 只解析当前 Maven 项目依赖图中的 JAR，以及 SkillsJars 插件自身 dependencies；不会扫描本地 `.m2` 的所有 JAR。
- 如果短前缀命令失败，使用完整坐标：

```bash
./mvnw com.skillsjars:maven-plugin:0.0.7:extract -Ddir=.cursor/skills
```

## 提交与合并请求

提交信息使用 Conventional Commits 风格：

```text
feat(kernel): ...
fix(build): ...
docs(starter): ...
```

提交或 PR 描述应包含：

- 变更说明
- 影响模块
- 必要的测试或未测试说明
- 文档、可视化或行为变更的截图 / 链接（如适用）

<claude-mem-context>
# Memory Context

# claude-mem status

This project has no memory yet. The current session will seed it; subsequent sessions will receive auto-injected context for relevant past
work.

Memory injection starts on your second session in a project.

`/learn-codebase` is available if the user wants to front-load the entire repo into memory in a single pass (~5 minutes on a typical repo,
optional). Otherwise memory builds passively as work happens.

Live activity: http://localhost:37701
How it works: `/how-it-works`

This message disappears once the first observation lands.
</claude-mem-context>
