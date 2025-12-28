# Repository Guidelines

## 项目结构与模块组织

仓库以多模块与子模块组合的方式组织：核心层按 `arco-meta/`、`blen-kernel/`、`cubo-starter/`、`domi-suite/`、`eiko-orch/`、`felo-space/` 分层，示例位于
`cubo-starter-examples/`。工具与资源集中在 `supports/`，IDE 插件在 `zeka-idea-plugin/`，文档站点在 `zeka-stack.github.io/`。根目录 `pom.xml`
负责聚合构建（部分模块可能注释掉）。初始化或更新时需同步子模块：`git submodule update --init --recursive`。

## 构建、测试与开发命令

- `./mvnw clean install`：构建全仓库所有模块。
- `./mvnw clean install -DskipTests`：跳过测试的快速构建。
- `./mvnw clean install -pl blen-kernel -am`：构建指定模块及其依赖。
- 示例运行（从示例目录）：`../../mvnw spring-boot:run`（如 `cubo-starter-examples/...` 或 `felo-space/felo-mall`）。

## 编码风格与命名约定

统一规范与配置放在 `supports/`，请优先使用其中的脚本与配置。Javadoc 版本标注遵循 `@since 1.0.0`、`@version 1.0.0` 的约定（见 `README.md`
的开发指南）。如新增模块，建议按现有分层命名（如 `cubo-*-spring-boot`、`blen-kernel-*`）。

## 测试指南

测试主要基于 JUnit 5（见 `arco-meta/` 与各模块 `pom.xml`）。常用命令：`./mvnw test` 或在模块内运行同名命令。当前未发现统一覆盖率阈值要求，如有新增测试请与模块维护约定对齐。

## 提交与合并请求规范

提交记录采用 Conventional Commits 风格：`type(scope): 描述`，例如 `feat(kernel): ...`、`fix(build): ...`
。提交时请描述影响模块与行为变更；合并请求建议包含：变更说明、影响模块列表、必要的运行/测试结果；若涉及可视化或文档变更，请附截图或链接。
